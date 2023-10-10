import React, { useEffect } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';

const Reports = () => {
  const { user } = useAuthentication();

  useEffect(() => {
    if (user && user.email) {
      // Query the Firestore database for the user's name based on their email
      const query = db.collection('Staff').where('email', '==', user.email);

      query
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // Assuming there is only one matching document
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
            <h1>
                Reports
            </h1>
        </div>
    )
};
 
export default Reports;