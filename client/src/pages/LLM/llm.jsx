import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';

const LLM = () => {
  const { user } = useAuthentication();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading');

  useEffect(() => {
    if (user && user.uid) {
      // Query the Firestore database for the user's subscription status

      const query = db.collection('Staff').doc(user.uid);

      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            // Assuming the document structure includes an 'activeSubscription' field and a 'priceID' field
            const activeSubscription = doc.data().activeSubscription;
            const priceID = doc.data().priceID;

            // Check if the user has an active subscription with the required price IDs
            if (activeSubscription === true && (priceID === 'price_1NxvKuF4O3GGcqFnjiaCWlHp' || priceID === 'price_1NxvKuF4O3GGcqFnHupONSSa')) {
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

  const makeApiRequestWithRetry = async () => {
    const maxRetries = 3; // Maximum number of retries
    let retries = 0;
    let retryDelay = 1000; // Initial retry delay in milliseconds

    while (retries < maxRetries) {
      try {
        const response = await axios.post('http://localhost:4000/api/ask-gpt3', { input });
        setResponse(response.data.answer);
        return; // Request successful, exit the loop
      } catch (error) {
        if (error.response && error.response.status === 429) {
          // 429 Too Many Requests error, retry after a delay
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          retries++;
          retryDelay *= 2; // Exponential backoff
        } else {
          console.error('Error:', error);
          break; // Handle other errors differently
        }
      }
    }

    // Handle the case when retries are exhausted
    console.error('Too many retries. Please try again later.');
  };

  const handleSubmit = () => {
    if (subscriptionStatus === 'active') {
      makeApiRequestWithRetry();
    } else {
      alert('Upgrade to a Premium subscription to access this feature.');
    }
  };

  let content;

  switch (subscriptionStatus) {
    case 'active':
      content = (
        <div>
          <h1>HealthAI Chatbot</h1>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSubmit}>Ask</button>
          {response && <p>Bot: {response}</p>}
        </div>
      );
      break;
    case 'upgrade':
      content = (
        <div>
          <h1>Upgrade to Standard</h1>
          <p>You need a Standard subscription to access this feature.</p>
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

export default LLM;
