const express = require('express');
const stripe = require('stripe')('sk_test_51NpIJeF4O3GGcqFnEmcNA5md0oDd48yBeLBOgKVyiQ4ySRuYCseF9LMRu4kagkXxr2AHIItB805ZdsQ43lCTB9cN00NjpZQaO4');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(cors());

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

// Implement server-side rate limiting middleware
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per minute
  message: "Too many requests from this IP, please try again later."
});

app.use("/api/ask-gpt3", limiter);

app.post('/api/ask-gpt3', async (req, res) => {
  const { input } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        prompt: input,
        max_tokens: 50, // Adjust the number of tokens as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.json({ answer: response.data.choices[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/webhooks/stripe', async (req, res) => {
  const event = req.body;

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const clientReferenceId = session.client_reference_id;
      const subscriptionId = session.subscription;

      // Retrieve the price ID associated with the subscription
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      // Update the user's collection in Firestore
      const userRef = firestore.collection('Staff').doc(clientReferenceId);
      await userRef.update({
        activeSubscription: true,
        priceID: priceId,
      });

      console.log(`Payment completed for user with UID: ${clientReferenceId}`);
    }

    res.status(200).end();
  } catch (err) {
    console.error('Error handling Stripe webhook:', err);
    res.status(500).end();
  }
});

app.listen(port, () => {
  console.log("Server started on port", port);
});
