const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
//import client elephantSQL
const client = require('./db/elephantsql.js');

const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');

  const rawData = fs.readFileSync(filePath, 'utf8');
  const existingData = JSON.parse(rawData);

  res.json(existingData);
});

//recive data from sql
app.get('/sql', (req, res) => {
  try {
    client.query(`SELECT * FROM recipes;`, (err, result) => {
      if (err) {
        return res.status(404).send('Error running query: ' + err.message);
      }
      res.send(result.rows);
    });
  } catch (error) {
    res.status(400).json({ error: 'Recipe not found' });
  }

  // res.json();
});

app.post('/api', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');

  const rawData = fs.readFileSync(filePath, 'utf8');
  const existingData = JSON.parse(rawData);
  const bodyData = req.body;
  const recipeExists = existingData.some((recipe) => {
    return recipe.name == bodyData.name;
  });

  if (!recipeExists) {
    const newData = { id: uuid(), ...bodyData };
    const finalData = [...existingData, newData];

    fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2));

    res.send(`Data written to data.json
  ${JSON.stringify(bodyData)}
  `);
  } else {
    res
      .status(400)
      .send(`Error: recipe name exists, don't repeat your recipes`);
  }
});

//POST REQUEST SQL
app.post('/sql', async (req, res) => {
  try {
    const { name, group, image, description, ingredients } = req.body;

    // Check if the recipe name already exists in the database
    const queryCheckExistence = 'SELECT COUNT(*) FROM recipes WHERE name = $1';
    const existenceResult = await pool.query(queryCheckExistence, [name]);
    const recipeExists = parseInt(existenceResult.rows[0].count) > 0;

    if (recipeExists) {
      return res.status(400).json({ error: 'Recipe name already exists' });
    }

    // Insert new recipe into the database
    const queryInsertRecipe = `
      INSERT INTO recipes (id, name, group, image, description) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const recipeId = uuid(); // Generate a new UUID for the recipe
    const insertRecipeResult = await pool.query(queryInsertRecipe, [
      recipeId,
      name,
      group,
      image,
      description,
    ]);
    const insertedRecipe = insertRecipeResult.rows[0];

    // Insert ingredients for the recipe into the database
    const queryInsertIngredients = `
      INSERT INTO ingredients (recipe_id, ingredient) 
      VALUES ($1, $2);
    `;

    for (const ingredient of ingredients) {
      await pool.query(queryInsertIngredients, [recipeId, ingredient]);
    }

    res.status(201).json(insertedRecipe);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('/api/:id', (req, res) => {
  const filePath = path.join(__dirname, 'data.json');

  const rawData = fs.readFileSync(filePath, 'utf8');
  const existingData = JSON.parse(rawData);

  let itemId = req.params.id;

  const itemIndex = existingData.findIndex((recipe) => {
    return recipe.id === itemId;
  });

  if (itemIndex !== -1) {
    const deletedItem = existingData.splice(itemIndex, 1)[0];
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    res.status(200).json({ message: 'Recipe deleted', recipe: deletedItem });
  } else {
    res.status(404).json({ error: 'Recipe not found' });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
