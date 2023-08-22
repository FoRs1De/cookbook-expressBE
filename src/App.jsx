/* eslint-disable */
import './App.css';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Contentful from './Contentful';

import Layout from './components/Layout';
import NotFound from './components/NotFound';
import Home from './components/Home';
import Recipe from './components/Recipe';
import Form from './components/Form';

function App() {
  const [recipe, setRecipe] = useState([]);
  const { getCookbook } = Contentful();
  const [loading, setLoading] = useState(true);
  const [newRecipe, setNewRecipe] = useState();
  const [alertForm, setAlertForm] = useState('');
  useEffect(() => {
    getCookbook()
      .then((res) => {
        if (res) {
          setRecipe(res);
        }
        setLoading(false); // Set loading to false once the data is fetched
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Handle the error and set loading to false
      });
  }, []);

  // Create a function to group recipes by group name
  const groupRecipesByGroup = (recipes) => {
    const groupedRecipes = {};
    recipes.forEach((recipe) => {
      if (!groupedRecipes[recipe.group]) {
        groupedRecipes[recipe.group] = [];
      }
      groupedRecipes[recipe.group].push(recipe);
    });
    return groupedRecipes;
  };

  const groupedRecipes = groupRecipesByGroup(recipe);

  useEffect(() => {
    if (newRecipe) {
      const createNewEntry = async (newEntryData) => {
        try {
          const url = `http://localhost:3000/api`;

          const response = await axios.post(url, newEntryData);

          return response;
        } catch (error) {
          console.error('Error creating new entry:', error.message);
          setAlertForm(error.message);
          const timeout = setTimeout(() => {
            setAlertForm('');
          }, 3000);
          return () => clearTimeout(timeout);
        }
      };

      // Usage example
      const newEntryData = newRecipe;
      console.log(newEntryData);
      createNewEntry(newEntryData).then((createdEntry) => {
        if (createdEntry) {
          console.log('New entry created:', createdEntry);
          setAlertForm('New recipe added');
          const timeout = setTimeout(() => {
            setAlertForm('');
          }, 5000);
          return () => clearTimeout(timeout);
        } else {
          console.log('Failed to create new entry.');
          setAlertForm('Error, please contact administator');
          const timeout = setTimeout(() => {
            setAlertForm('');
          }, 3000);
          return () => clearTimeout(timeout);
        }
      });
    } else {
      console.log('nothing sent');
    }
  }, [newRecipe]);

  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={<Layout recipes={groupedRecipes} loading={loading} />}
        >
          <Route index element={<Home recipe={recipe} loading={loading} />} />
          {recipe.map((groupRecipe) => (
            <Route
              key={groupRecipe.group}
              path={`/${groupRecipe.group
                .replace(/\s+/g, '-')
                .toLowerCase()}/:recipeName/`}
              element={<Recipe recipe={recipe} loading={loading} />}
            />
          ))}
          <Route
            path="add-item"
            element={
              <Form
                recipe={recipe}
                loading={loading}
                setNewRecipe={setNewRecipe}
                alertForm={alertForm}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
