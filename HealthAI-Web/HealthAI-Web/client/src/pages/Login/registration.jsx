import React, { useState } from "react";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const Register = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const apiRegisterURL = "http://localhost:4000/api/register";

  const isPasswordValid = (password) => {
    // Password must be at least 10 characters long
    if (password.length < 10) {
      return false;
    }

    // Password must contain at least one capital letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Password must contain at least one number
    if (!/\d/.test(password)) {
      return false;
    }

    // Password must contain at least one special character
    if (!/[!@#$%^&*]/.test(password)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      setPasswordError(
        "Password must be at least 10 characters long and contain one capital letter, one number, and one special character."
      );
      return;
    }

    try {
      const response = await fetch(apiRegisterURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Registration successful
        const data = await response.json();
        console.log("Success");

        // Redirect to the '/login' path upon successful registration
        navigate("/login");
      } else {
        // Registration failed
        const errorMessage = await response.text();
        console.error("Fail:", errorMessage);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

const signInWithGoogle = () => {
  
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  const redirectToLogin = () => {
    navigate("/login"); // Redirect to the "/login" path
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="John Doe"
          id="name"
          name="name"
        />
        <label htmlFor="email">Email Address:</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="johndoe@gmail.com"
          id="email"
          name="email"
        />
        <label htmlFor="password">Password:</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="*******"
          id="password"
          name="password"
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
        <button type="submit">Register</button>
      </form>
      <button className="link-btn" onClick={redirectToLogin}>
        Already have an account? Login here!
      </button>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
};
