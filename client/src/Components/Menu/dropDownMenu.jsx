import React from "react";
import "./dropDownMenu.css"; // Import your CSS file

const DropdownMenu = ({ buttons, closeMenu}) => {
  return (
    <div className="dropdown-menu">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="dropdown-item"
          onClick={() => {
            button.onClick(); // Call the original click handler
            closeMenu(); // Close the menu
          }}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default DropdownMenu;
