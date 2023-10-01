import React from "react";

const DropdownMenu = ({ buttons }) => {
  return (
    <div className="dropdown-menu">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="dropdown-item"
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default DropdownMenu;
