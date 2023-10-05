import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';

const Dashboard = () => {
  const { user } = useAuthentication();
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (user && user.uid) {
      // Query the Firestore database for the user's provider based on their uid
      const query = db.collection('Staff').doc(user.uid);

      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            if (userData.provider) {
              setProvider(userData.provider);
            } else {
              console.log('Provider not found in Firestore');
            }
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
      <h1>Dashboard</h1>
      {provider && <p>You have signed up with {provider}.</p>}
    </div>
  );
};

export default Dashboard;
