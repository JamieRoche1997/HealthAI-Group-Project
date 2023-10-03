import React, { useState, useEffect } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';

const Profile = () => {
  const { user, loading } = useAuthentication(); // Get the loading state from useAuthentication hook
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user && user.email) {
      // Query the Firestore database for the user's name based on their email
      const query = db.collection('Users').where('email', '==', user.email);

      query
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // Assuming there is only one matching document
            const userData = querySnapshot.docs[0].data();
            const name = userData.name;
            setUserName(name);
          } else {
            console.log('User not found in Firestore');
          }
        })
        .catch((error) => {
          console.error('Error getting user data from Firestore:', error);
        });
    }
  }, [user]);

  return (
    <div>
      <h1>Profile</h1>
      {loading ? ( // Check if loading is true, show a loading indicator
        <p>Loading...</p>
      ) : (
        user ? (
          <p>Welcome, {userName}!</p>
        ) : (
          <p>You are not signed in.</p>
        )
      )}
    </div>
  );
};

export default Profile;
