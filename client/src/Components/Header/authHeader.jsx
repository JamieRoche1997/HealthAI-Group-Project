import React, { useState, useEffect } from "react";
import "./authHeader.css";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import logo from "../../Images/logo.png";
import DropdownMenu from "../Menu/dropDownMenu"; // Import the DropdownMenu component
import { getAuth, signOut } from "firebase/auth"; // Import Firebase authentication functions

export default function AuthHeader() {
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

  const redirectToDashboard = () => {
    navigate("/dashboard");
  };

  const redirectToReports = () => {
    navigate("/reports");
  };

  const redirectToPatients = () => {
    navigate("/patients");
  };

  const redirectToPredict = () => {
    navigate("/predict");
  };

  const redirectToLLM = () => {
    navigate("/llm");
  };

const handleLogout = () => {
    const auth = getAuth();

    // Sign out the user
    signOut(auth)
      .then(() => {
        // Redirect to the login page or any other desired page after logout
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
};


  // Define button data
  const buttons = [
    { label: "Dashboard", onClick: redirectToDashboard },
    { label: "Reports", onClick: redirectToReports },
    { label: "Patients", onClick: redirectToPatients },
    { label: "Predict", onClick: redirectToPredict },
    { label: "LLM", onClick: redirectToLLM },
    { label: "Logout", onClick: handleLogout },
  ];

  return (
    <header className="authHeader-Header">
      <CSSTransition
        in={!isSmallScreen}
        timeout={350}
        classNames="authHeader-NavAnimation"
        unmountOnExit
      >
        <nav className="authHeader-Nav">
          <img src={logo} alt={"Logo"} width={50} height={50} />
          {buttons.map((button, index) => (
            <button key={index} onClick={button.onClick}>
              {button.label}
            </button>
          ))}
        </nav>
      </CSSTransition>

      {isSmallScreen && <DropdownMenu buttons={buttons} />}
    </header>
  );
}
