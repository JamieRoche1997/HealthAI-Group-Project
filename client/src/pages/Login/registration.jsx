import React, { useState } from "react";
import "../../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "firebase/auth";

export const Register = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    capitalLetter: false,
    number: false,
    specialCharacter: false,
  });
  const navigate = useNavigate();
  const apiRegisterURL = "https://healthai-heroku-1a596fab2241.herokuapp.com/api/register";

  const isPasswordValid = (password) => {
    const requirements = {
      length: password.length >= 10,
      capitalLetter: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialCharacter: /[!@#$%^&*]/.test(password),
    };

    return requirements;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check if the password meets the requirements
    const requirementsMet = isPasswordValid(newPassword);
    setPasswordRequirements(requirementsMet);

    if (!requirementsMet.length) {
      setPasswordError("Password must be at least 10 characters long.");
    } else if (!requirementsMet.capitalLetter) {
      setPasswordError("Password must contain at least one capital letter.");
    } else if (!requirementsMet.number) {
      setPasswordError("Password must contain at least one number.");
    } else if (!requirementsMet.specialCharacter) {
      setPasswordError("Password must contain at least one special character.");
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requirementsMet = isPasswordValid(password);

    if (!requirementsMet.length || !requirementsMet.capitalLetter || !requirementsMet.number || !requirementsMet.specialCharacter) {
      setPasswordError(
        "Password must meet all requirements: at least 10 characters long, contain one capital letter, one number, and one special character."
      );
      return;
    }

    let apiUrl;
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      // Use localhost URL for development
      apiUrl = "http://localhost:4000/api/register"; // Replace your-port with the actual port
    } else {
      // Use the remote API URL for production
      apiUrl = apiRegisterURL;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Registration successful
        console.log("Success");

        // Redirect to the '/login' path upon successful registration
        navigate("/profile");
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
        // The signed-in user info.
        const user = result.user;
        console.log(user);

        // Redirect to the './profile' path upon successful Google login
        navigate("/profile");
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
  };

  const signInWithTwitter = () => {
    const auth = getAuth();
    const provider = new TwitterAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log(user);

        // Redirect to the './profile' path upon successful Twitter login
        navigate("/profile");
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
  };

  const signInWithFacebook = () => {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        console.log(user);

        // Redirect to the './profile' path upon successful Facebook login
        navigate("/profile");
      })
      .catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
  };

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
          onChange={handlePasswordChange}
          type="password"
          placeholder="*******"
          id="password"
          name="password"
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
        <div className="password-requirements">
          <p>Password Requirements:<br/>
            {passwordRequirements.length ? "✅" : "❌"} At least 10 characters long<br/>
            {passwordRequirements.capitalLetter ? "✅" : "❌"} Contains one capital letter<br/>
            {passwordRequirements.number ? "✅" : "❌"} Contains one number<br/>
            {passwordRequirements.specialCharacter ? "✅" : "❌"} Contains one special character<br/>
            </p>
        </div>
        <button type="submit">Register</button>
      </form>
      <button className="link-btn" onClick={redirectToLogin}>
        Already have an account? Login here!
      </button>
      <button className="google-btn" onClick={signInWithGoogle}>Sign in with Google</button><br/>
      <button className="twitter-btn" onClick={signInWithTwitter}>Sign in with X</button><br/>
      <button className="facebook-btn" onClick={signInWithFacebook}>Sign in with Facebook</button><br/>
    </div>
  );
};
