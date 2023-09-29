/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useEffect } from "react";
import "./header.css";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom"
import logo from "../../Images/logo.png"

export default function Header() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
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

  const redirectToHome = () => {
    navigate("/"); // Redirect to the "/" path
  }

  const redirectToAbout = () => {
    navigate("/about"); // Redirect to the "/about" path
  }

  const redirectToContact = () => {
    navigate("/contact"); // Redirect to the "/contact" path
  }

  return (
    <header className="Header">
      <CSSTransition
        in={!isSmallScreen}
        timeout={350}
        classNames="NavAnimation"
        unmountOnExit
      >
        <nav className="Nav">
          <img src={logo} alt={"Logo"} width={50} height={50}/>
          <button onClick={redirectToHome}>HealthAI</button>
          <button onClick={redirectToAbout}>About Us</button>
          <button onClick={redirectToContact}>Contact</button>
        </nav>
      </CSSTransition>
      
    </header>
  );
}
