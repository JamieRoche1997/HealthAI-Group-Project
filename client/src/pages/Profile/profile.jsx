import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';

const Profile = () => {
  const { user } = useAuthentication();
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      // Query the Firestore database for the user's data based on their uid
      const query = db.collection('Staff').doc(user.uid);

      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setUserData(userData);
          } else {
            console.log('User not found in Firestore');
          }
        })
        .catch((error) => {
          console.error('Error getting user data from Firestore:', error);
        });

      setLoggedIn(true);
    }
  }, [user]);

  return (
    <div>
      <h1>Profile</h1>
      {loggedIn ? (
        <div>
          <p>Welcome, {userData?.name || 'User'}!</p>
          {userData && (
            <>
              <p>Email: {userData.email}</p>
              <p>Address Line 1: {userData.addressLine1}</p>
              <p>Address Line 2: {userData.addressLine2}</p>
              <p>Town: {userData.town}</p>
              <p>City: {userData.city}</p>
              <p>Country: {userData.country}</p>
              <p>Postcode: {userData.postcode}</p>
              <p>Phone Number: {userData.phoneNumber}</p>
              <p>Medical License Number: {userData.licenseNumber}</p>
            </>
          )}
        </div>
      ) : (
        <p>Please log in to access your profile.</p>
      )}
    </div>
  );
};

export default Profile;
