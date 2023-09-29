import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import PasswordReset from "./passwordReset"; // Import the PasswordReset component

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isPasswordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        setLoginError(null); // Clear any previous login error
        console.log("Success");

        // Redirect to the '/profile' path upon successful login
        navigate("/profile");
      })
      .catch((error) => {
        const errorMessage = error.message;
        setLoginError(errorMessage); // Set the login error message
        console.log("Fail");
      });
  }

  const handleOpenPasswordResetModal = () => {
    setPasswordResetModalOpen(true);
  }

  const handleClosePasswordResetModal = () => {
    setPasswordResetModalOpen(false);
  }

  const handlePasswordReset = (resetEmail) => {
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        console.log("Password reset email sent!");
        handleClosePasswordResetModal();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Password reset error:", errorMessage);
      });
  }

  const redirectToRegister = () => {
    navigate("/register");
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
      {loginError && <p className="error-message">{loginError}</p>}
      <button className="link-btn" onClick={handleOpenPasswordResetModal}>Forgot your password?</button>
      <button className="link-btn" onClick={redirectToRegister}>Don't have an account? Register here!</button>

      {/* Render the PasswordResetModal as a portal */}
      <PasswordReset
        isOpen={isPasswordResetModalOpen}
        onClose={handleClosePasswordResetModal}
        onResetPassword={handlePasswordReset}
      />
    </div>
  );
};
