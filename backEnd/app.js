const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');

// multer configuration
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '')); // Use a unique filename
  },
});
const upload = multer({ storage: storage });

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
    res.status(400).json({ error: 'Recipes not found' });
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

app.use('/images', express.static('uploads'));

//POST REQUEST SQL
app.post('/sql', upload.single('file'), async (req, res) => {
  try {
    const bodyData = req.body;
    const file = req.file.filename;

    // Check if the recipe name already exists in the database
    const existenceResult = await client.query(
      'SELECT COUNT(*) FROM recipes WHERE name = $1',
      [bodyData.name]
    );
    const recipeExists = parseInt(existenceResult.rows[0].count) > 0;

    if (recipeExists) {
      return res.status(400).json({ error: 'Recipe name already exists' });
    }

    // Convert ingredients array to a single string
    const ingredientsString = bodyData.ingredients;
    const recipeId = uuid();

    // Insert new recipe into the database
    const queryInsertRecipe = `
      INSERT INTO recipes (id, name, "group_name", image, description, ingredients) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const insertRecipeResult = await client.query(queryInsertRecipe, [
      recipeId,
      bodyData.name,
      bodyData.group,
      file,
      bodyData.description,
      ingredientsString,
    ]);

    const insertedRecipe = insertRecipeResult.rows[0];
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

app.delete('/sql/:id', async (req, res) => {
  try {
    const itemId = req.params.id;

    // Delete the recipe with the given ID from the database
    const deletionResult = await client.query(
      `DELETE FROM recipes WHERE id = $1`,
      [itemId]
    );

    // Check if any rows were affected by the deletion
    if (deletionResult.rowCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
