import React, { useState } from "react";
import "../../firebase";
import { useNavigate } from "react-router-dom";
import PasswordReset from "./passwordReset"; // Import the PasswordReset component
import { getAuth, signInWithPopup, GoogleAuthProvider, TwitterAuthProvider, FacebookAuthProvider } from "firebase/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [isPasswordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const navigate = useNavigate();
  const apiLoginURL = "https://healthai-heroku-1a596fab2241.herokuapp.com/api/login";
  const apiResetURL = "https://healthai-heroku-1a596fab2241.herokuapp.com/api/reset-password";

  const handleSubmit = async (e) => {
    e.preventDefault();

    let apiUrl;
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        // Use localhost URL for development
        apiUrl = "http://localhost:4000/api/login"; // Replace your-port with the actual port
      } else {
        // Use the remote API URL for production
        apiUrl = apiLoginURL;
      }
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Login successful
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

  const handleOpenPasswordResetModal = () => {
    setPasswordResetModalOpen(true);
  };

  const handleResetPassword = async (resetEmail) => {

    let apiUrl;
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        // Use localhost URL for development
        apiUrl = "http://localhost:4000/api/reset-password"; // Replace your-port with the actual port
      } else {
        // Use the remote API URL for production
        apiUrl = apiResetURL;
      }

    try {
      const response = await fetch(apiUrl, {
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
      {/* Render the PasswordResetModal as a portal */}
      <PasswordReset
        isOpen={isPasswordResetModalOpen}
        onClose={handleClosePasswordResetModal}
        onResetPassword={handleResetPassword} // Pass the reset function
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
