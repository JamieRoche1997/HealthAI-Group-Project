import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';

const Predict = () => {
  const { user } = useAuthentication();
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading');

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
            console.log(activeSubscription);
            console.log(priceID);

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
          <a
            href="https://billing.stripe.com/p/login/test_6oEdUH5Jw6x6bPa3cc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Upgrade Now</button>
          </a>
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
