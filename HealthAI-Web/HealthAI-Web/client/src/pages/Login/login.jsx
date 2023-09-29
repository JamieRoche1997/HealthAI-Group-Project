import React, { useState } from "react";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import PasswordReset from "./passwordReset"; // Import the PasswordReset component
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [isPasswordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const navigate = useNavigate();
  const apiLoginUrl = "http://localhost:4000/api/login";
  const apiResetURL = "http://localhost:4000/api/reset-password";

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(apiLoginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Login successful
        const data = await response.json();
        setLoginError(null); // Clear any previous login error
        console.log("Success");

        // Redirect to the '/profile' path upon successful login
        navigate("/profile");
      } else {
        // Login failed
        const errorMessage = await response.text();
        setLoginError(errorMessage); // Set the login error message
        console.log("Fail");
      }
    } catch (error) {
      console.error(error);
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
        console.log(user);

        // Redirect to the './profile' path upon successful Google login
        navigate("/profile");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const handleOpenPasswordResetModal = () => {
    setPasswordResetModalOpen(true);
  };

  const handleResetPassword = async (resetEmail) => {
    try {
      const response = await fetch(apiResetURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      if (response.ok) {
        console.log("Password reset email sent!");
        handleClosePasswordResetModal();
      } else {
        const errorMessage = await response.text();
        console.error("Password reset error:", errorMessage);
      }
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  const handleClosePasswordResetModal = () => {
    setPasswordResetModalOpen(false);
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {loginError && <p className="error-message">{loginError}</p>}
      <button className="link-btn" onClick={handleOpenPasswordResetModal}>
        Forgot your password?
      </button>
      <button className="link-btn" onClick={redirectToRegister}>
        Don't have an account? Register here!
      </button>
      <button onClick={signInWithGoogle}>Sign in with Google</button>

      {/* Render the PasswordResetModal as a portal */}
      <PasswordReset
        isOpen={isPasswordResetModalOpen}
        onClose={handleClosePasswordResetModal}
        onResetPassword={handleResetPassword} // Pass the reset function
      />
    </div>
  );
};
