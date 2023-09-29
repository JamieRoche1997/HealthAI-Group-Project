import React, { useState } from "react";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, email, password);

        db.collection("Users").add({
          name: name,
          email: email,
          password: password,
        });

        // enter your registration logic here
    };

    const redirectToLogin = () => {
        navigate("/login"); // Redirect to the "/login" path
      }

    return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="John Doe" id="name" name="name"/>
        <label htmlFor="email">Email Address:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="johndoe@gmail.com" id="email" name="email"/>
        <label htmlFor="password">Password:</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="*******" id="password" name="password"/>
        <button type="submit">Register</button>
      </form>
      <button className="link-btn" onClick={redirectToLogin}>Already have an account? Login here!</button>
    </div>
  );
};