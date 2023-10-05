import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import logo from "../../Images/logo.png";

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const redirectToRegister = () => {
    navigate("/signup"); // Redirect to the "/signup" path
  };

  const redirectToLogin = () => {
    navigate("/login"); // Redirect to the "/login" path
  };

  useEffect(() => {
    const user = auth.currentUser;

    // Check if the user is already authenticated
    if (user) {
      navigate("/profile"); // Redirect to the "/profile" path
    }
  }, [auth, navigate]);

  return (
    <div className="home-form-container">
      <img src={logo} alt={"Logo"} width={100} height={100} />
      <br />
      <h1>Welcome to the HealthAI Website!</h1>
      <br />
      <button className="home-btn" onClick={redirectToLogin}>
        Login
      </button>
      <br />
      <button className="home-btn" onClick={redirectToRegister}>
        Sign Up
      </button>
    </div>
  );
};

export default Home;
