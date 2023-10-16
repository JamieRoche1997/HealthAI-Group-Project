import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import axios from 'axios';

const Predict = () => {
  const { user } = useAuthentication();
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading');
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      // Query the Firestore database for the user's subscription status

      const query = db.collection('Staff').doc(user.uid);

      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            // Assuming the document structure includes an 'activeSubscription' field and a 'price' field
            const activeSubscription = doc.data().activeSubscription;
            const priceID = doc.data().priceID;

            // Check if the user has an active subscription with the required price ID
            if (activeSubscription === true && priceID === 'price_1NxvKuF4O3GGcqFnHupONSSa') {
              setSubscriptionStatus('active');
            } else {
              setSubscriptionStatus('upgrade');
            }
          } else {
            console.log('User not found in Firestore');
            setSubscriptionStatus('notfound');
          }
        })
        .catch((error) => {
          console.error('Error getting user data from Firestore:', error);
          setSubscriptionStatus('error');
        });
    }
  }, [user]);

  const retrieveCustomerPortalSession = () => {
    if (user && user.uid) {
      // Set loading state to true
      setIsLoadingUpgrade(true);

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
                  setIsLoadingUpgrade(false);
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

  let content;

  switch (subscriptionStatus) {
    case 'active':
      content = (
        <div>
          <h1>Predict</h1>
          {/* Add the content of the /predict page here */}
        </div>
      );
      break;
    case 'upgrade':
      content = (
        <div>
          <h1>Upgrade to Premium</h1>
          <p>You need a Premium subscription to access this page.</p>
          <button onClick={retrieveCustomerPortalSession} disabled={isLoadingUpgrade}>
            {isLoadingUpgrade ? 'Loading...' : 'Upgrade'}
          </button><br /><br />
        </div>
      );
      break;
    case 'notfound':
      content = <p>User not found in Firestore.</p>;
      break;
    case 'error':
      content = <p>Error getting user data from Firestore.</p>;
      break;
    default:
      content = <p>Loading...</p>;
  }

  return <div>{content}</div>;
};

export default Predict;
