import React, { useState, useEffect } from "react";
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
  linkWithPopup,
  AuthErrorCodes,
  signOut,
} from "firebase/auth";
import { db } from "../../firebase"; // Import the Firestore instance

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [isPasswordResetModalOpen, setPasswordResetModalOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Check if the user is already signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/profile");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Login successful
      setLoginError(null);
      console.log("Success");

      // Redirect to the '/profile' path upon successful login
      navigate("/profile");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);

        // Store user data in Firestore
        storeUserData(user, provider.providerId);

        navigate("/profile");
      })
      .catch((error) => {
        handleAuthError(error);
      });
  };

  const signInWithTwitter = () => {
    const provider = new TwitterAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);

        // Store user data in Firestore
        storeUserData(user, provider.providerId);

        navigate("/profile");
      })
      .catch((error) => {
        handleAuthError(error);
      });
  };

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);

        // Store user data in Firestore
        storeUserData(user, provider.providerId);

        navigate("/profile");
      })
      .catch((error) => {
        handleAuthError(error);
      });
  };

  const storeUserData = async (user, provider) => {
    const userRef = db.collection("Users").doc(user.uid);

    // Check if the user already exists in the database
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      // If the user doesn't exist, store their data
      await userRef.set({
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        provider: provider,
      });
    } else {
      // If the user already exists, update the provider
      await userRef.update({
        provider: provider,
      });
    }
  };

  const handleAuthError = async (error) => {
    const errorCode = error.code;
    switch (errorCode) {
      case AuthErrorCodes.EMAIL_NOT_FOUND:
        setLoginError("Email not found. Please check your email and try again.");
        break;
      case AuthErrorCodes.WRONG_PASSWORD:
        setLoginError("Wrong password. Please try again.");
        break;
      case AuthErrorCodes.ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL:
        // Handle linking the account with a different provider
        handleAccountLinking(error.credential);
        break;
      default:
        setLoginError("Login failed. Please try again.");
        console.error("Authentication error:", error);
    }
  };

  const handleAccountLinking = async (credential) => {
    try {
      // Sign out the current user
      await signOut(auth);

      // Link the account with the new credential (provider)
      const user = auth.currentUser;
      await linkWithPopup(user, credential);

      // User is now linked with the new provider, update the Firestore data
      storeUserData(user, credential.providerId);

      // Redirect to the '/profile' path
      navigate("/profile");
    } catch (error) {
      console.error("Account linking error:", error);
    }
  };

  const handleOpenPasswordResetModal = () => {
    setPasswordResetModalOpen(true);
  };

  const handleResetPassword = async (resetEmail) => {
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

  const redirectToSignUp = () => {
    navigate("/signup");
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
      <button className="link-btn" onClick={redirectToSignUp}>
        Don't have an account? Sign up here!
      </button>
      <button className="google-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <br />
      <button className="twitter-btn" onClick={signInWithTwitter}>
        Sign in with X
      </button>
      <br />
      <button className="facebook-btn" onClick={signInWithFacebook}>
        Sign in with Facebook
      </button>
      <br />
    </div>
  );
};
