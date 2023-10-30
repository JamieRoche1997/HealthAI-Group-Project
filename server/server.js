const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const stripe = require('stripe')('sk_test_51NpIJeF4O3GGcqFnEmcNA5md0oDd48yBeLBOgKVyiQ4ySRuYCseF9LMRu4kagkXxr2AHIItB805ZdsQ43lCTB9cN00NjpZQaO4');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const server = http.createServer(app);

// Backend Server URL - https://healthai-heroku-1a596fab2241.herokuapp.com/

const port = process.env.PORT || 4000;

app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./healthai-23-firebase-adminsdk-f0xjo-5102c0582e.json'); // Replace with your service account key path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://healthai-23-default-rtdb.europe-west1.firebasedatabase.app', // Replace with your Firebase project URL
});

const firestore = admin.firestore();


const OPENAI_API_KEY = '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';


// Previous conversation history, if any
const conversationHistory = [];

app.post('/api/ask-gpt3', async (req, res) => {
  const { input } = req.body;

  // Add user message to the conversation
  conversationHistory.push({ role: 'user', content: input });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        max_tokens: 50,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...conversationHistory, // Include the entire conversation history
        ],
        model: 'ft:gpt-3.5-turbo-0613:personal::89fUliBi',
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the content from the response and send it to the client
    const assistantResponse = response.data.choices[0].message.content;

    console.log('OpenAI Response:', assistantResponse);

    res.json({ answer: assistantResponse });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.post('/webhooks/stripe', async (req, res) => {
  const event = req.body;
  try {
    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted' ||
      event.type === 'charge.succeeded'
    ) {
      const session = event.data.object;
      const clientReferenceId = session.client_reference_id;
      if (event.type === 'checkout.session.completed') {
        // Retrieve the price ID associated with the subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0].price.id;
        const customerId = subscription.customer;
        // Update the user's collection in Firestore
        const userRef = firestore.collection('Staff').doc(clientReferenceId);
        await userRef.update({
          subscription: session.subscription, // Save the subscription ID
          customer: customerId, // Save the customer ID
          activeSubscription: true,
          priceID: priceId,
        });
        console.log(`Subscription created for user with UID: ${clientReferenceId}`);
      }
      if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
        // Retrieve the UID from the Firestore database
        const userRef = firestore.collection('Staff').where('subscription', '==', session.id);

        const querySnapshot = await userRef.get();

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userRef = firestore.collection('Staff').doc(userData.uid);

            if (event.type === 'customer.subscription.updated') {
              // Subscription updated event, update the priceID
              const priceId = session.items.data[0].price.id;
              userRef.update({
                priceID: priceId,
              });
              console.log(`Subscription updated for user with UID: ${userData.uid}`);
            } else if (event.type === 'customer.subscription.deleted') {
              // Subscription canceled event, set activeSubscription to false and priceID to null
              userRef.update({
                activeSubscription: false,
                priceID: null,
              });
              console.log(`Subscription canceled for user with UID: ${userData.uid}`);
            }
          });
        } else {
          console.error('User not found in Firestore.');
        }
      }
      if (event.type === 'charge.succeeded') {
        const userRef = firestore.collection('Staff').where('email', '==', session.receipt_email);

        const querySnapshot = await userRef.get();

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            const userRef = firestore.collection('Staff').doc(userData.uid);
            // Retrieve the last 4 digits of the card from the payment method details
            const paymentMethodDetails = event.data.object.payment_method_details;

            if (paymentMethodDetails && paymentMethodDetails.card) {
              const last4 = paymentMethodDetails.card.last4;
              const expiry = paymentMethodDetails.card.exp_month + "/" + paymentMethodDetails.card.exp_year;
              const brand = paymentMethodDetails.card.brand;

              // Update the user's collection in Firestore with the last 4 digits
              userRef.update({
                last4: last4,
                cardexpiry: expiry,
                cardbrand: brand,
              });

              console.log(`Last 4 digits updated successfully for user with UID: ${clientReferenceId}`);
            } else {
              console.error('No payment method details found in the event.');
            }
          })
        }
      }
    }
    res.status(200).end();
  } catch (err) {
    console.error('Error handling Stripe webhook:', err);
    res.status(500).end();
  }
});

app.post('/api/retrieve-customer-portal-session', async (req, res) => {
  try {
    const { user } = req.body; // Assuming you send user information from the frontend

    if (!user || !user.uid) {
      return res.status(400).json({ error: 'User information is required' });
    }

    // Query Firestore to retrieve the user's data
    const userDoc = await firestore.collection('Staff').doc(user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found in Firestore' });
    }

    const userData = userDoc.data();

    if (!userData.customer) {
      return res.status(400).json({ error: 'Customer ID not found in user data' });
    }

    // Create a customer portal session using the customerId from Firestore
    const session = await stripe.billingPortal.sessions.create({
      customer: userData.customer, // Use the customerId from Firestore
      return_url: 'https://healthai-23.web.app/profile',
    });

    res.json({ customerPortalSessionUrl: session.url });
  } catch (error) {
    console.error('Error retrieving customer portal session:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// socket.io and then i added cors for cross origin to localhost only
const io = require('socket.io')(server, {
  cors: {
   origin: "https://healthai-23.web.app/", //specific origin you want to give access to,
},
});

const chatNamespace = io.of('/chat'); // Create a namespace for /chat

chatNamespace.on('connection', (socket) => {
  console.log(`A doctor with socket id ${socket.id} has connected.`);

  // When a user sends a message
  socket.on('message', (message) => {
    console.log(`Received message from socket id ${socket.id}: ${message.content}`);
    
    // Broadcast the message to all connected doctors, including the user's name
    chatNamespace.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Doctor with socket id ${socket.id} has disconnected.`);
  });
});

server.listen(port, () => {
  console.log("Server started on port", port);
});
