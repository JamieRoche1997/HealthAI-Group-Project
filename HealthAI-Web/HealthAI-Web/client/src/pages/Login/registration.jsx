import React, { useState } from "react";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, email, password);

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
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