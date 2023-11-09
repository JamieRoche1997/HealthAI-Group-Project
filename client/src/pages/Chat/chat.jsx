//
// Add an option to export the chat transcript to email, etc.
//

import React, { useEffect, useState, useRef } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import io from 'socket.io-client';
import emailjs from 'emailjs-com';

const Chat = () => {
  const { user } = useAuthentication();
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [emailSent, setEmailSent] = useState(null);
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
  
            // Check if user.displayName exists before emitting the event
            if (user.displayName) {
  
              // Emit the 'connect-user' event with the user's name
              socket.current.emit('connect-user', user.displayName);
            }
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
    // livemode: https://healthai-heroku-1a596fab2241.herokuapp.com/chat
    // testmode: http://localhost:4000/chat
    socket.current = io('https://healthai-heroku-1a596fab2241.herokuapp.com/chat');

    // Listen for incoming messages
    socket.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for online user updates
    socket.current.on('online-users', (users) => {
      setOnlineUsers(users);
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

    const [transcript, setTranscript] = useState('');

    // Function to export the chat transcript via email
    const exportChatTranscript = () => {
      // Combine messages into a single string
      const transcriptText = messages.map((msg) => `${msg.name}: ${msg.content}`).join('\n');
      
      // Set the transcript in the state
      setTranscript(transcriptText);

      // IMPLEMENT SENDING TRANSCRIPT
      if (user.email) {
        const templateParams = {
          to_email: user.email,
          subject: 'Chat Transcript',
          message: transcriptText,
          to_name: user.displayName
        };
  
        emailjs.send('service_q4tsv7f', 'template_7042eci', templateParams, 'jIhZ9sBAIsRr6dNnZ')
          .then((response) => {
            console.log('Email sent successfully:', response);
            setEmailSent(true);
          })
          .catch((error) => {
            console.error('Error sending email:', error);
            setEmailSent(false);
          });
      }
    };
  

    return (
        <div>
          {loggedIn ? (
            <div>
              <h1>Doctor Chat</h1>
              <p>A place to ask for general advice between fellow doctors</p>
              <div className="online-users">
                <h2>Online Users</h2>
                <ul className="custom-list">
                  {onlineUsers.map((user) => (
                    <li key={user.socketId}>Dr. {user.name}</li>
                  ))}
                </ul>
              </div>
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

          <div className="export-button-container">
                  <button onClick={exportChatTranscript} className="export-button">
                    Export Transcript via Email
                  </button>
                </div>

                {/* Display the email sent status */}
                {emailSent !== null && (
                  <div className="email-status">
                    {emailSent ? (
                      <p>Email sent successfully!</p>
                    ) : (
                      <p>Error sending email. Please try again later.</p>
                    )}
                  </div>
                )}

                {/* Display the transcript for testing purposes */}
                {transcript && (
                  <div className="transcript-container">
                    <h3>Chat Transcript</h3>
                    <pre>{transcript}</pre>
                  </div>
                )}
        </div>
      );
      
};

export default Chat;
