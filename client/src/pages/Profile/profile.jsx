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
              <table>
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={updatedUserData.name || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>
                      <input
                        type="text"
                        name="email"
                        value={updatedUserData.email || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Phone Number:</td>
                    <td>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={updatedUserData.phoneNumber || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>Home Details:</h2>
              <table>
                <tbody>
                  <tr>
                    <td>Address Line 1:</td>
                    <td>
                      <input
                        type="text"
                        name="addressLine1"
                        value={updatedUserData.addressLine1 || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Address Line 2:</td>
                    <td>
                      <input
                        type="text"
                        name="addressLine2"
                        value={updatedUserData.addressLine2 || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Town:</td>
                    <td>
                      <input
                        type="text"
                        name="town"
                        value={updatedUserData.town || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>City:</td>
                    <td>
                      <input
                        type="text"
                        name="city"
                        value={updatedUserData.city || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Country:</td>
                    <td>
                      <input
                        type="text"
                        name="country"
                        value={updatedUserData.country || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Postcode:</td>
                    <td>
                      <input
                        type="text"
                        name="postcode"
                        value={updatedUserData.postcode || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2>Work Details:</h2>
              <table>
                <tbody>
                  <tr>
                    <td>Work Address Line 1:</td>
                    <td>
                      <input
                        type="text"
                        name="workaddressLine1"
                        value={updatedUserData.workaddressLine1 || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Work Address Line 2:</td>
                    <td>
                      <input
                        type="text"
                        name="workaddressLine2"
                        value={updatedUserData.workaddressLine2 || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Work Town:</td>
                    <td>
                      <input
                        type="text"
                        name="worktown"
                        value={updatedUserData.worktown || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Work City:</td>
                    <td>
                      <input
                        type="text"
                        name="workcity"
                        value={updatedUserData.workcity || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Work Country:</td>
                    <td>
                      <input
                        type="text"
                        name="workcountry"
                        value={updatedUserData.workcountry || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Work Postcode:</td>
                    <td>
                      <input
                        type="text"
                        name="workpostcode"
                        value={updatedUserData.workpostcode || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Medical License Number:</td>
                    <td>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={updatedUserData.licenseNumber || ''}
                        onChange={handleInputChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table><br /><br />

              <button onClick={saveUserData}>Save</button>
            </div>
          ) : (
              <div>
                <p>Welcome, {userData?.name || 'User'}!</p><br />
                {userData && (
                  <>
                    <h2>Personal Details:</h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>Email:</td>
                          <td>{userData.email}</td>
                        </tr>
                        <tr>
                          <td>Phone Number:</td>
                          <td>{userData.phoneNumber}</td>
                        </tr>
                      </tbody>
                    </table><br/>

                    <h2>Home Details:</h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>Address Line 1:</td>
                          <td>{userData.addressLine1}</td>
                        </tr>
                        <tr>
                          <td>Address Line 2:</td>
                          <td>{userData.addressLine2}</td>
                        </tr>
                        <tr>
                          <td>Town:</td>
                          <td>{userData.town}</td>
                        </tr>
                        <tr>
                          <td>City:</td>
                          <td>{userData.city}</td>
                        </tr>
                        <tr>
                          <td>Country:</td>
                          <td>{userData.country}</td>
                        </tr>
                        <tr>
                          <td>Postcode:</td>
                          <td>{userData.postcode || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table><br/>

                    <h2>Work Details:</h2>
                    <table>
                      <tbody>
                        <tr>
                          <td>Work Address Line 1:</td>
                          <td>{userData.workaddressLine1}</td>
                        </tr>
                        <tr>
                          <td>Work Address Line 2:</td>
                          <td>{userData.workaddressLine2}</td>
                        </tr>
                        <tr>
                          <td>Work Town:</td>
                          <td>{userData.worktown}</td>
                        </tr>
                        <tr>
                          <td>Work City:</td>
                          <td>{userData.workcity}</td>
                        </tr>
                        <tr>
                          <td>Work Country:</td>
                          <td>{userData.workcountry}</td>
                        </tr>
                        <tr>
                          <td>Work Postcode:</td>
                          <td>{userData.workpostcode || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td>Medical License Number:</td>
                          <td>{userData.licenseNumber || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table><br/>

                    <button onClick={() => setIsEditMode(true)}>Edit</button>

                    <h2>Payment Details:</h2>
                    <button onClick={retrieveCustomerPortalSession} disabled={isLoadingManage}>
                      {isLoadingManage ? 'Loading...' : 'Manage'}
                    </button><br /><br />
                  </>
                )}
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


