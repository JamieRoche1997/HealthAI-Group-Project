import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'; // Import Axios
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';

const LLM = () => {
  const { user } = useAuthentication();
  const [input, setInput] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading');
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);
  const [conversation, setConversation] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user && user.uid) {
      const query = db.collection('Staff').doc(user.uid);

      query.get()
        .then((doc) => {
          if (doc.exists) {
            const activeSubscription = doc.data().activeSubscription;
            const priceID = doc.data().priceID;

            if (activeSubscription && (priceID === 'price_1NxvKcF4O3GGcqFnjiaCWlHp' || priceID === 'price_1NxvKuF4O3GGcqFnHupONSSa')) {
              setSubscriptionStatus('active');
            } else {
              setSubscriptionStatus('upgrade');
            }
          } else {
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
      setIsLoadingUpgrade(true);
      const query = db.collection('Staff').doc(user.uid);

      query.get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            if (userData.activeSubscription) {
              axios
                .post('https://healthai-heroku-1a596fab2241.herokuapp.com/api/retrieve-customer-portal-session', {
                  user: user,
                })
                .then((response) => {
                  const { customerPortalSessionUrl } = response.data;
                  window.location.href = customerPortalSessionUrl;
                })
                .catch((error) => {
                  console.error('Error retrieving customer portal session:', error);
                })
                .finally(() => {
                  setIsLoadingUpgrade(false);
                });
            } else {
              window.location.href = '/pricing-page';
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

  const handleChatCompletion = async () => {
    if (!input) return;

    try {
      const response = await axios.post('https://healthai-heroku-1a596fab2241.herokuapp.com/api/ask-gpt3', { input });
      const assistantResponse = response.data.answer;

      // Update the conversation with user and assistant messages
      const updatedConversation = [
        ...conversation,
        { role: 'User', content: input },
        { role: 'Chatbot', content: assistantResponse },
      ];

      setConversation(updatedConversation);
      setInput(''); // Clear the input field after submission
    } catch (error) {
      console.error('Error:', error);
      // Update the conversation if needed
    }
  }

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleChatCompletion();
    }
  }

  let content;

  switch (subscriptionStatus) {
    case 'active':
      content = (
        <div>
          <h1>HealthAI Chatbot</h1>
          <div>
            {conversation.map((message, index) => (
              <div key={index} className={message.role}>
                {message.role}: {message.content} 
              </div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleEnterKeyPress} // Call the function on Enter key press
            ref={inputRef} // Assign the input ref
          /><br/>
          <button onClick={handleChatCompletion}>Ask</button>
        </div>
      );
      break;
    case 'upgrade':
      content = (
        <div>
          <h1>Upgrade to Standard</h1>
          <p>You need a Standard subscription to access this feature.</p>
          <button onClick={retrieveCustomerPortalSession} disabled={isLoadingUpgrade}>
            {isLoadingUpgrade ? 'Loading...' : 'Upgrade'}
          </button><br/><br/>
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
