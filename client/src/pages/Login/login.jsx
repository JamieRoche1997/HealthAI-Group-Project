import React, { useState } from "react";
import "../../firebase";
import { useNavigate } from "react-router-dom";
import PasswordReset from "./passwordReset"; // Import the PasswordReset component
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate();
  const [isPasswordResetModalOpen, setPasswordResetModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Login successful
      setLoginError(null);
      console.log("Success");

      // Redirect to the '/profile' path upon successful login
      navigate("/profile");
    } catch (error) {
      const errorMessage = error.message;
      setLoginError(errorMessage);
      console.error("Fail");
    }
  };

  const signInWithGoogle = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        navigate("/profile");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signInWithTwitter = () => {
    const auth = getAuth();
    const provider = new TwitterAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        navigate("/profile");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signInWithFacebook = () => {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        navigate("/profile");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOpenPasswordResetModal = () => {
    setPasswordResetModalOpen(true);
  };

  const handleResetPassword = async (resetEmail) => {
    const auth = getAuth();

    try {
      // Send a password reset email
      await sendPasswordResetEmail(auth, resetEmail);

      // Password reset email sent
      console.log("Password reset email sent!");
      handleClosePasswordResetModal();
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

      {/* Render the PasswordResetModal as a portal */}
      <PasswordReset
        isOpen={isPasswordResetModalOpen}
        onClose={handleClosePasswordResetModal}
        onResetPassword={handleResetPassword}
      />
      <button className="link-btn" onClick={redirectToRegister}>
        Don't have an account? Register here!
      </button>
      <button className="google-btn" onClick={signInWithGoogle}>Sign in with Google</button><br/>
      <button className="twitter-btn" onClick={signInWithTwitter}>Sign in with X</button><br/>
      <button className="facebook-btn" onClick={signInWithFacebook}>Sign in with Facebook</button><br/>
    </div>
  );
};
