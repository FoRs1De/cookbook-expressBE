import { useParams } from 'react-router-dom';
import './Recipe.css';

const Recipe = ({ recipe, loading }) => {
  const { recipeName } = useParams();
  function titleCase(str) {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  let startName = titleCase(recipeName);

  let filteredItem = recipe.filter((item) => {
    return item.name == startName;
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
        </>
      ) : (
        <p>No recipe found.</p>
      )}
    </div>
  );
};

export default Recipe;
