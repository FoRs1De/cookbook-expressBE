import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Recipe.css';
import axios from 'axios';

const Recipe = ({ recipe, loading, setResponse }) => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const handleDeleteClick = () => {
    const url = `http://localhost:3000/api/${recipeId}`;
    axios
      .delete(url)
      .then(function (response) {
        // handle success
        console.log(response);
        navigate('/');
        setResponse(true);
        const timeout = setTimeout(() => {
          setResponse(false);
        }, 1000);
        () => clearTimeout(timeout);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  let filteredItem = recipe.filter((item) => {
    return item.id == recipeId;
  });

  return (
    <div className="recipe-container">
      {loading ? (
        <p>Loading...</p>
      ) : recipe?.length > 0 && filteredItem ? (
        <>
          <h1 className="Title-Recipe">{filteredItem[0].name}</h1>
          <img
            className="pic"
            src={filteredItem[0].img}
            alt={filteredItem.name}
          />
          <h3 className="Description">{filteredItem[0].description}</h3>
          <h3 className="ingredients-heading">Ingredients:</h3>
          {filteredItem[0].ingredients.map((item, index) => (
            <p className="recipe-ingredient" key={index}>
              {item}
            </p>
          ))}
          <button onClick={handleDeleteClick}>Delete recipe</button>
        </>
      ) : (
        <p>No recipe found.</p>
      )}
    </div>
  );
};

export default Recipe;
