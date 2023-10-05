import React, { useEffect } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';

const Patients = () => {
  const { user } = useAuthentication();

  useEffect(() => {
    if (user && user.email) {
      // Query the Firestore database for the user's name based on their email
      const query = db.collection('Users').where('email', '==', user.email);

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
                Patients
            </h1>
        </div>
    )
};
 
export default Patients;