// Logout.jsx
import React from 'react';
import { auth } from '../../firebase';
import { useAuthentication } from '../../Components/authObserver'; // Import the hook

const Logout = () => {
  const user = useAuthentication(); // Use the hook to get the authentication state

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log('User Logged Out!');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return user ? (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  ) : (
      <p>You are not signed in.</p>
    );
};

export default Logout;
