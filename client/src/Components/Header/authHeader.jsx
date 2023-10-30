import React, { useState, useRef, useEffect } from "react";
import "./authHeader.css";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import logo from "../../Images/logo.png";
import DropdownMenu from "../Menu/dropDownMenu";
import { getAuth, signOut } from "firebase/auth";
import { FiUser } from "react-icons/fi";

export default function AuthHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  const redirectToChat = () => {
    navigate("/chat");
  };

  const redirectToProfile = () => {
    navigate("/profile");
  }

  const handleLogout = () => {
    const auth = getAuth();

    // Sign out the user
    signOut(auth)
      .then(() => {
        // Redirect to the login page or any other desired page after logout
        navigate("/login");
        setIsUserMenuOpen(false); // Close the user menu on logout
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
    { label: "Chat", onClick: redirectToChat },
  ];

  const buttonsCountRef = useRef(buttons.length);

  useEffect(() => {
    // Calculate the height of the dropdown based on the number of buttons
    if (dropdownRef.current) {
      const buttonHeight = 50; // Adjust this value based on your button styling
      const dropdownHeight = buttonsCountRef.current * buttonHeight - 75;
      dropdownRef.current.style.height = `${dropdownHeight}px`;
    }
  }, [isUserMenuOpen]);

  const handleUserIconClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="authHeader-Header">
      <CSSTransition
        in={true}
        timeout={350}
        classNames="authHeader-NavAnimation"
        unmountOnExit
      >
        <nav className="authHeader-Nav">
          <img src={logo} alt={"Logo"} width={50} height={50} />
          {buttons.slice(0, 6).map((button, index) => (
            <button key={index} onClick={button.onClick}>
              {button.label}
            </button>
          ))}
          <button onClick={handleUserIconClick}>
            <FiUser size={24} /> {/* User icon */}
          </button>
        </nav>
      </CSSTransition>

      {/* Render the user dropdown */}
      {isUserMenuOpen && (
        <div
          ref={dropdownRef}
          className={`user-dropdown-container ${isUserMenuOpen ? "active" : ""}`}
        >
          <DropdownMenu
            buttons={[
              { label: "Profile", onClick: redirectToProfile },
              { label: "Logout", onClick: handleLogout }
            ]}
            closeMenu={() => setIsUserMenuOpen(false)} // Pass closeMenu here
          />
        </div>
      )}
    </header>
  );
}
