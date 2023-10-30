import React, { useEffect, useState, useRef } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import io from 'socket.io-client';

const Chat = () => {
  const { user } = useAuthentication();
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = useRef();

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

  useEffect(() => {
    // Replace 'http://your-backend-url' with your Express.js server URL
    socket.current = io('https://healthai-heroku-1a596fab2241.herokuapp.com/chat');

    // Listen for incoming messages
    socket.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Update the sendMessage function to send the user's name along with the message
    const sendMessage = () => {
        if (message) {
        // Emit a 'message' event to the server with the message and the user's name
        socket.current.emit('message', { content: message, role: 'user', name: userData.name });
    
        // Add the sent message to the list
        setMessages((prevMessages) => [
            ...prevMessages,
        ]);
    
        // Clear the input field
        setMessage('');
        }
    };
  

    return (
        <div>
          {loggedIn ? (
            <div>
              <h1>Doctor Chat</h1>
              <p>A place to ask for general advice between fellow doctors</p>
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-message ${
                      msg.name === userData.name ? 'sender-message' : 'receiver-message'
                    }`}
                  >
                    {msg.name !== userData.name && <strong>Dr. {msg.name}:</strong>} {msg.content}
                  </div>
                ))}
              </div>
              <div className="input-container">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field"
                  placeholder="Type your message here..."
                />
                <button onClick={sendMessage} className="send-button">
                  Send
                </button>
              </div>
            </div>
          ) : (
            <p>Please log in to access your profile.</p>
          )}
        </div>
      );
      
};

export default Chat;
