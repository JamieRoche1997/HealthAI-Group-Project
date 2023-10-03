// authObserver.jsx
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase Authentication
const auth = getAuth();
console.log(auth);

export const useAuthentication = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false when authentication is resolved
    });

    return unsubscribe; // Clean up the observer
  }, []);

  return { user, loading }; // Return loading state as well
};

const AuthObserver = ({ children }) => {
  const { user, loading } = useAuthentication(); // Get user and loading state

  // Render loading indicator while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render content based on user authentication state
  return <>{children(user)}</>;
};

export default AuthObserver;
