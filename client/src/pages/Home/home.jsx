import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Images/logo.png";
 
const Home = () => {

    const navigate = useNavigate();

    const redirectToRegister = () => {
        navigate("/register"); // Redirect to the "/register" path
      }

    const redirectToLogin = () => {
        navigate("/login"); // Redirect to the "/login" path
      }  

    return (
        <div className="home-form-container">
            <img src={logo} alt={"Logo"} width={100} height={100}/><br/>
            <h1>
                Welcome to the HealthAI Website!
            </h1><br/>
            <button className="home-btn" onClick={redirectToLogin}>Login</button><br/>
            <button className="home-btn" onClick={redirectToRegister}>Register</button>

        </div>
    );
};
 
export default Home;