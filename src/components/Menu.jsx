import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { XIcon } from './XIcon';
import { BurgerIcon } from './BurgerIcon';

import './Menu.css';

const Menu = ({ recipes, loading }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log(menuOpen);
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups((prevExpandedGroups) => {
      const newExpandedGroups = { ...prevExpandedGroups };

      Object.keys(newExpandedGroups).forEach((key) => {
        if (key !== groupName) {
          newExpandedGroups[key] = false; // Close other groups
        }
      });

      newExpandedGroups[groupName] = !prevExpandedGroups[groupName]; // Toggle clicked group
      return newExpandedGroups;
    });
  };

  return (
    <div className={`menu ${menuOpen ? 'open' : ''}`}>
      <header>
        <Link to="." className="frontpage-link">
          Home
        </Link>
        {menuOpen ? (
          <div className="x-icon" onClick={() => toggleMenu()}>
            <XIcon />
          </div>
        ) : (
          <div className="burger-icon" onClick={() => toggleMenu()}>
            <BurgerIcon />
          </div>
        )}
        {/* <div className={`menu-icon ${menuOpen ? 'x-icon' : 'burger-icon'}`} onClick={() => toggleMenu()}> {menuOpen ? <XIcon/> : <div><BurgerIcon/></div>}</div> */}
      </header>
      <nav>
        {loading ? (
          <p>Loading...</p>
        ) : (
          Object.entries(recipes).map(([groupName, recipesInGroup]) => (
            <div key={groupName} className="recipe-group-item">
              <h3
                className="menu-group-name"
                onClick={() => toggleGroup(groupName)}
              >
                {groupName}
              </h3>
              {expandedGroups[groupName] && (
                <ul className="menu-recipe-list">
                  {recipesInGroup.map((recipe) => (
                    <li key={recipe.name}>
                      <NavLink
                        to={`/${groupName
                          .replace(/\s+/g, '-')
                          .toLowerCase()}/${recipe.name
                          .replace(/\s+/g, '-')
                          .toLowerCase()}`}
                      >
                        {recipe.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
        <Link to="/add-item" className="add-item-link">
          <h3>Add Item</h3>
        </Link>
      </nav>
    </div>
  );
};

export default Menu;
