// Inside DropdownMenu.jsx

import React from "react";
import "./header.css";

export default function MobileDropdown({ buttons, closeMenu }) {
  const handleItemClick = (onClick) => {
    onClick();
    closeMenu(); // Close the dropdown after clicking an item
  };

  return (
    <div className="DropdownMenu">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => handleItemClick(button.onClick)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
