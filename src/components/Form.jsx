import { useState } from 'react';
import TextField from '@mui/material/TextField';
// import { MenuItem } from '@mui/material';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';

const Form = ({ recipe, setAlertForm, setResponse, alertForm }) => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [name, setName] = useState('');
  const [img, setImg] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const recipeGroups = Array.from(new Set(recipe.map((item) => item.group)));

  let HandleChange = (e, newValue) => {
    setSelectedGroup(newValue);
  };

  let handleName = (e) => {
    let value = e.target.value;
    setName(value.charAt(0).toUpperCase() + value.slice(1));

    const newIngredients = value
      .split(',')
      .map((ingredient) => ingredient.trim());
    setIngredients(newIngredients);
  };

  let handleImg = (e) => {
    const file = e.target.files[0];
    setImg(file);
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

  let handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('name', name);
    formData.append('group', selectedGroup);
    formData.append('file', img);
    formData.append('description', description);
    const ingredientsString = JSON.stringify(ingredients);
    formData.append('ingredients', ingredientsString);
    try {
      const response = await axios.post('http://localhost:3000/sql', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle response as needed
      console.log(response.data);
      setAlertForm('New recipe added');
      setResponse(true);
      const timeout = setTimeout(() => {
        setAlertForm('');
        setResponse(false);
      }, 3000);
      () => clearTimeout(timeout);
    } catch (error) {
      console.error('Error creating new entry:', error.message);
      setAlertForm(error.message);
      const timeout = setTimeout(() => {
        setAlertForm('');
      }, 5000);
      () => clearTimeout(timeout);
    }

    setName('');
    setSelectedGroup('');
    setImg('');
    setDescription('');
    setIngredients([]);
    document.getElementById('newRecipeForm').reset();
  };

  return (
    <div className="form" encType="multipart/form-data">
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

        {/* <TextField
          className="imageField"
          required
          id="outlined-required"
          label="Img"
          placeholder="http://..."
          helperText="Add link to img"
          onChange={handleImg}
        /> */}

        <input type="file" name="file" onChange={handleImg} />

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
