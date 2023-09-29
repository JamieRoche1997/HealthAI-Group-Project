import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    // Add your login logic here
  }

  const redirectToRegister = () => {
    navigate("/register"); // Redirect to the "/register" path
  }

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="johndoe@gmail.com" id="email" name="email"/>
        <label htmlFor="password">Password:</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*******" id="password" name="password"/>
        <button type="submit">Login</button>
      </form>
      <button className="link-btn" onClick={redirectToRegister}>Don't have an account? Register here!</button>
    </div>
  );
};
