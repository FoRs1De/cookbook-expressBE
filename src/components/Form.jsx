import { useState } from 'react';
import TextField from '@mui/material/TextField';
// import { MenuItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const Form = ({ recipe, loading, setNewRecipe, alertForm }) => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const recipeGroups = Array.from(new Set(recipe.map((item) => item.group)));

  let HandleChange = (e, newValue) => {
    setSelectedGroup(newValue);
  };

  console.log(selectedGroup);

  let handleName = (e) => {
    let value = e.target.value;
    setName(value.charAt(0).toUpperCase() + value.slice(1));

    const newIngredients = value
      .split(',')
      .map((ingredient) => ingredient.trim());
    setIngredients(newIngredients);
  };

  let handleImg = (e) => {
    let value = e.target.value;
    setImg(value);
  };

  let handleDescription = (e) => {
    let value = e.target.value;
    setDescription(value);
  };

  let handleIngredients = (e) => {
    let value = e.target.value;
    const newIngredients = value
      .split(',')
      .map((ingredient) => ingredient.trim());
    setIngredients(newIngredients);
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    let newItem = {
      name: name,
      group: selectedGroup,
      image: img,
      description: description,
      ingredients: ingredients,
    };

    setNewRecipe(newItem);

    setName('');
    setSelectedGroup('');
    setImg('');
    setDescription('');
    setIngredients([]);
    document.getElementById('newRecipeForm').reset();
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit} id="newRecipeForm">
        <TextField
          className="nameField"
          required
          id="outlined-required"
          label="Name"
          placeholder="Item name"
          helperText="Give the name to recipe"
          onChange={handleName}
        />

        {/* <TextField
          required
          className="selectField"
          id="select"
          select
          label="Select"
          helperText="Please select recipe group"
          value={selectedGroup}
          onChange={HandleChange}
        >
          {recipeGroups.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField> */}

        <Autocomplete
          freeSolo
          options={recipeGroups}
          inputValue={selectedGroup}
          onInputChange={HandleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Group *"
              variant="outlined"
              helperText="Choose or add group"
            />
          )}
        />

        <TextField
          className="imageField"
          required
          id="outlined-required"
          label="Img"
          placeholder="http://..."
          helperText="Add link to img"
          onChange={handleImg}
        />
        <TextField
          className="descriptionField"
          required
          id="outlined-required"
          label="Description"
          variant="outlined"
          helperText="Add description to recipe"
          onChange={handleDescription}
        />
        <TextField
          className="ingredientsField"
          required
          id="outlined-required"
          label="Ingredients"
          variant="outlined"
          helperText="Devide by comma"
          onChange={handleIngredients}
        />
        <button>Add recipe</button>
      </form>
      <center>
        <div className="alertForm">{alertForm}</div>
      </center>
    </div>
  );
};

export default Form;
