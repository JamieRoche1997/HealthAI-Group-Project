import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuthentication();
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [isLoadingManage, setIsLoadingManage] = useState(false);

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
            setUpdatedUserData(userData);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserData({
      ...updatedUserData,
      [name]: value,
    });
  };

  const saveUserData = () => {
    if (user && user.uid) {
      // Update the user's data in Firestore with the updatedUserData object
      const userRef = db.collection('Staff').doc(user.uid);
      userRef
        .update(updatedUserData)
        .then(() => {
          console.log('User data updated successfully');
          setIsEditMode(false); // Exit edit mode
          setUserData(updatedUserData); // Update userData with the edited data
        })
        .catch((error) => {
          console.error('Error updating user data:', error);
        });
    }
  };

  const retrieveCustomerPortalSession = () => {
    if (user && user.uid) {
      // Set loading state to true
      setIsLoadingManage(true);

      // Query the Firestore database for the user's data based on their uid
      const query = db.collection('Staff').doc(user.uid);

      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            if (userData.activeSubscription) {
              // User has an active subscription, create a customer portal session
              axios
                .post('https://healthai-heroku-1a596fab2241.herokuapp.com/api/retrieve-customer-portal-session', {
                  user: user, // Send the user object
                })
                .then((response) => {
                  const { customerPortalSessionUrl } = response.data;
                  window.location.href = customerPortalSessionUrl;
                  console.log(customerPortalSessionUrl);
                })
                .catch((error) => {
                  console.error('Error retrieving customer portal session:', error);
                })
                .finally(() => {
                  // Set loading state back to false when the request is completed
                  setIsLoadingManage(false);
                });
            } else {
              // User does not have an active subscription, redirect to pricing page
              window.location.href = '/pricing-page'; // Change this URL to your pricing page path
            }
          } else {
            console.log('User not found in Firestore');
          }
        })
        .catch((error) => {
          console.error('Error getting user data from Firestore:', error);
        });
    } else {
      console.error('User not authenticated');
    }
  };



  return (
    <div>
      <h1>Profile</h1>
      {loggedIn ? (
        <div>
          {isEditMode ? (
            <div>
              <h2>Personal Details:</h2>
              <label>Name: </label><br />
              <input
                type="text"
                name="name"
                value={updatedUserData.name || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Email: </label><br />
              <input
                type="text"
                name="email"
                value={updatedUserData.email || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Phone Number: </label><br />
              <input
                type="text"
                name="phoneNumber"
                value={updatedUserData.phoneNumber || ''}
                onChange={handleInputChange}
              /><br /><br />

              <h2>Home Details:</h2>

              <label>Address Line 1: </label><br />
              <input
                type="text"
                name="addressLine1"
                value={updatedUserData.addressLine1 || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Address Line 2: </label><br />
              <input
                type="text"
                name="addressLine2"
                value={updatedUserData.addressLine2 || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Town: </label><br />
              <input
                type="text"
                name="town"
                value={updatedUserData.town || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>City: </label><br />
              <input
                type="text"
                name="city"
                value={updatedUserData.city || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Country: </label><br />
              <input
                type="text"
                name="country"
                value={updatedUserData.country || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Postcode: </label><br />
              <input
                type="text"
                name="postcode"
                value={updatedUserData.postcode || ''}
                onChange={handleInputChange}
              /><br /><br />

              <h2>Work Details:</h2>

              <label>Work Address Line 1: </label><br />
              <input
                type="text"
                name="workaddressLine1"
                value={updatedUserData.workaddressLine1 || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Work Address Line 2: </label><br />
              <input
                type="text"
                name="workaddressLine2"
                value={updatedUserData.workaddressLine2 || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Work Town: </label><br />
              <input
                type="text"
                name="worktown"
                value={updatedUserData.worktown || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Work City: </label><br />
              <input
                type="text"
                name="workcity"
                value={updatedUserData.workcity || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Work Country: </label><br />
              <input
                type="text"
                name="workcountry"
                value={updatedUserData.workcountry || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Work Postcode: </label><br />
              <input
                type="text"
                name="workpostcode"
                value={updatedUserData.workpostcode || ''}
                onChange={handleInputChange}
              /><br /><br />

              <label>Medical License Number: </label><br />
              <input
                type="text"
                name="licenseNumber"
                value={updatedUserData.licenseNumber || ''}
                onChange={handleInputChange}
              /><br /><br />

              <button onClick={saveUserData}>Save</button>
            </div>
          ) : (
              <div>
                <p>Welcome, {userData?.name || 'User'}!</p><br />
                {userData && (
                  <>
                    <h2>Personal Details:</h2>
                    <p>Email: {userData.email}</p>
                    <p>Phone Number: {userData.phoneNumber}</p><br />

                    <h2>Home Details:</h2>
                    <p>Address Line 1: {userData.addressLine1}</p>
                    <p>Address Line 2: {userData.addressLine2}</p>
                    <p>Town: {userData.town}</p>
                    <p>City: {userData.city}</p>
                    <p>Country: {userData.country}</p>
                    <p>Postcode: {userData.postcode || 'N/A'}</p><br />

                    <h2>Work Details:</h2>
                    <p>Work Address Line 1: {userData?.workaddressLine1}</p>
                    <p>Work Address Line 2: {userData?.workaddressLine2}</p>
                    <p>Work Town: {userData?.worktown}</p>
                    <p>Work City: {userData?.workcity}</p>
                    <p>Work Country: {userData?.workcountry}</p>
                    <p>Work Postcode: {userData?.workpostcode || 'N/A'}</p>
                    <p>Medical License Number: {userData.licenseNumber || 'N/A'}</p><br />

                    <h2>Payment Details:</h2>
                    <button onClick={retrieveCustomerPortalSession} disabled={isLoadingManage}>
                      {isLoadingManage ? 'Loading...' : 'Manage'}
                    </button><br /><br />
                  </>
                )}
                <button onClick={() => setIsEditMode(true)}>Edit</button>
              </div>
            )}
        </div>
      ) : (
          <p>Please log in to access your profile.</p>
        )}
    </div>
  );
};

export default Profile;


