// Import necessary dependencies and assets
import React, { useState } from 'react';
import filterIcon from '../../Assets/Images/Tuning.svg';
import downIcon from '../../Assets/Images/Down.svg';
import { FiSun } from "react-icons/fi";
import { FaMoon } from "react-icons/fa";

// Import styling for the Navbar component
import './Navbar.css';

// Define the Navbar component
export default function Navbar(props) {
  // State variables for toggling filter dropdown and dark mode
  const [toggleFilter, settoggleFilter] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle dark mode and update the parent component
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    props.toggleDarkMode(); // Update the parent component with the new dark mode state
  };

  // Event handler for toggling filter dropdown and handling display value changes
  function handleDisplayToggle(e) {
    settoggleFilter(!toggleFilter);
    if (e.target.value !== undefined) {
      props.handleGroupValue(e.target.value); // Update the parent component with the selected display value
    }
  }

  // Event handler for handling ordering value changes
  function handleOrderingValue(e) {
    settoggleFilter(!toggleFilter);
    if (e.target.value !== undefined) {
      props.handleOrderValue(e.target.value); // Update the parent component with the selected ordering value
    }
  }

  // JSX structure of the Navbar component
  return (
    <>
      <section className={`nav ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="nav-container">
          <div>
            {/* Display toggle button with icon and dropdown */}
            <div className="nav-disp-btn" style={{ float: 'left' }} onClick={handleDisplayToggle}>
              <div className="nav-disp-icon nav-disp-filter">
                <img src={filterIcon} alt="icon" />
              </div>
              <div className="nav-disp-heading">
                Display
              </div>
              <div className="nav-disp-icon nav-disp-drop">
                <img src={downIcon} alt="icon" />
              </div>
            </div>
            {/* Dropdown for display options */}
            <div className={toggleFilter ? "nav-disp-dropdown nav-disp-dropdown-show" : "nav-disp-dropdown"}>
              <div className="nav-disp-filters">
                <div className="nav-dropdown-category">
                  Grouping
                </div>
                <div className="nav-dropdown-selector">
                  {/* Dropdown for grouping options */}
                  <select value={props.groupValue} onChange={handleDisplayToggle} className='nav-selector' name="grouping" id="">
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>
              <div className="nav-disp-filters">
                <div className="nav-dropdown-category">
                  Ordering
                </div>
                <div className="nav-dropdown-selector">
                  {/* Dropdown for ordering options */}
                  <select value={props.orderValue} onChange={handleOrderingValue} className='nav-selector' name="grouping" id="">
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Dark mode toggle button */}
            <div className="dark-mode-toggle-btn" style={{ marginLeft: '95%', fontSize: '20px', marginTop: '10px' }} onClick={toggleDarkMode}>
              {isDarkMode ? <FiSun /> : <FaMoon />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
