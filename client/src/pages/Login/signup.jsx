import React, { useState } from "react";
import "../../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, AuthErrorCodes } from "firebase/auth";
import { db } from "../../firebase"; // Import the Firestore instance

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const provider = "email";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Add confirmPassword state
  const [passwordError, setPasswordError] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    capitalLetter: false,
    number: false,
    specialCharacter: false,
  });
  const navigate = useNavigate();

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
  
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
  
    const auth = getAuth();
  
    try {
      // Create a user with the provided email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // The user is created successfully, you can add additional user data to Firestore or other databases here
      const user = userCredential.user;
  
      // Add user data to Firestore, including uid
      const userDocRef = db.collection("Staff").doc(user.uid);
      await userDocRef.set({
        uid: user.uid, // Add the uid to Firestore
        name: name,
        email: email,
        provider: provider,
        timestamp: new Date(),
      });
  
      // Redirect to the '/profile' path upon successful sign up
      navigate("/register-info");
    } catch (error) {
      console.error("Sign up error:", error);
  
      // Handle specific Firebase error codes
      switch (error.code) {
        case AuthErrorCodes.EMAIL_EXISTS:
          setPasswordError("Email already exists. Please use a different email.");
          break;
        case AuthErrorCodes.NETWORK_REQUEST_FAILED:
          setPasswordError("Network error. Please check your internet connection and try again.");
          break;
        default:
          setPasswordError("Sign up failed. Please try again.");
      }
    }
  };
  

  const redirectToLogin = () => {
    navigate("/login"); // Redirect to the "/login" path
  };

  return (
    <div className="auth-form-container">
      <h2>Sign Up</h2>
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
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
          placeholder="*******"
          id="confirmPassword"
          name="confirmPassword"
        />
        {passwordError && <p className="error-message">{passwordError}</p>}
        <div className="password-requirements">
          <p>
            Password Requirements:<br />
            {passwordRequirements.length ? "✅" : "❌"} At least 10 characters long<br />
            {passwordRequirements.capitalLetter ? "✅" : "❌"} Contains one capital letter<br />
            {passwordRequirements.number ? "✅" : "❌"} Contains one number<br />
            {passwordRequirements.specialCharacter ? "✅" : "❌"} Contains one special character<br />
          </p>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <button className="link-btn" onClick={redirectToLogin}>
        Already have an account? Login here!
      </button>
    </div>
  );
};
