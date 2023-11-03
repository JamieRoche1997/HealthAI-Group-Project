import React, { useState, useEffect } from "react";
import "./header.css";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import logo from "../../Images/logo.png";
import MobileDropdown from "./dropdownMenu"; // Import the DropdownMenu component

export default function Header() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const handleMediaQueryChange = (mediaQuery) => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const redirectToHome = () => {
    navigate("/");
  };

  const redirectToAbout = () => {
    navigate("/about");
  };

  const redirectToContact = () => {
    navigate("/contact");
  };

  const redirectToRating = () => {
    navigate("/rating");
  }

  const buttons = [
    { label: "HealthAI", onClick: redirectToHome },
    { label: "About Us", onClick: redirectToAbout },
    { label: "Contact", onClick: redirectToContact },
    { label: "Rating", onClick: redirectToRating },
  ];

  return (
    <header className="Header">
      <CSSTransition
        in={!isSmallScreen}
        timeout={350}
        classNames="NavAnimation"
        unmountOnExit
      >
        <nav className="Nav">
          <img src={logo} alt={"Logo"} width={50} height={50} />
          {buttons.map((button, index) => (
            <button key={index} onClick={button.onClick}>
              {button.label}
            </button>
          ))}
        </nav>
      </CSSTransition>

      {isSmallScreen && (
        <>
          <div className="MobileDropdownButton" onClick={toggleDropdown}>
            <span>Menu</span>
          </div>
          {isDropdownOpen && <MobileDropdown buttons={buttons} closeMenu={toggleDropdown} />}
        </>
      )}
    </header>
  );
}
