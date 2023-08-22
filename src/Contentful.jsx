import axios from 'axios';

const Contentful = () => {
  const getCookbook = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api');
      const entries = response.data;

      const saniEntries = entries.map((item) => {
        const name = item.name;
        const description = item.description;
        const ingredients = item.ingredients;
        const img = item.image;
        const id = item.id;
        const group = item.group;
        return { name, description, ingredients, img, id, group };
      });

      return saniEntries;
    } catch (error) {
      console.log(error);
    }
  };

  return { getCookbook };
};

export default Contentful;
