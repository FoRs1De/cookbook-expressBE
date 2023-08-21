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
          const url = `https://api.contentful.com/spaces/fvwgdnm4oux1/environments/master/entries`;

          const response = await axios.post(
            url,
            {
              fields: newEntryData,
            },
            {
              headers: {
                'Content-Type': 'application/vnd.contentful.management.v1+json',
                Authorization: `Bearer CFPAT-8FVJRToLGY4Ot_ur6xxSuO-qnVkDhNBuOekBefmjyqc`,
                'X-Contentful-Content-Type': 'cookbook',
              },
            }
          );

          return response.data;
        } catch (error) {
          console.error('Error creating new entry:', error.message);
          console.log(error);
          return null;
        }
      };

      // Usage example
      const newEntryData = newRecipe;
      console.log(newEntryData);
      createNewEntry(newEntryData).then((createdEntry) => {
        if (createdEntry) {
          console.log('New entry created:', createdEntry);

          // Publish the created entry
          const entryId = createdEntry.sys.id;
          const publishEntry = async (entryId) => {
            try {
              const publishUrl = `https://api.contentful.com/spaces/fvwgdnm4oux1/environments/master/entries/${entryId}/published`;

              const publishResponse = await axios.put(
                publishUrl,
                {},
                {
                  headers: {
                    'Content-Type':
                      'application/vnd.contentful.management.v1+json',
                    Authorization: `Bearer CFPAT-8FVJRToLGY4Ot_ur6xxSuO-qnVkDhNBuOekBefmjyqc`,
                    'X-Contentful-Content-Type': 'cookbook',
                  },
                }
              );

              return publishResponse.data;
            } catch (error) {
              console.error('Error publishing entry:', error.message);
              console.log(error);
              return null;
            }
          };

          // Publish the created entry
          publishEntry(entryId).then((publishedEntry) => {
            if (publishedEntry) {
              console.log('Entry published:', publishedEntry);
            } else {
              console.log('Failed to publish entry.');
            }
          });
        } else {
          console.log('Failed to create new entry.');
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
                .toLowerCase()}/:recipe/:recipeId/`}
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
