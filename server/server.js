const express = require('express');
const cors = require('cors');
const { db, firebase } = require('./firebase');
const app = express();
app.use(express.json());
app.use(cors());

// Define a route for user registration
app.post("/api/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
  
      // Create a new user using Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
  
      // Add additional user data to your database (Firestore, for example)
      const userData = {
        name: name,
        email: email,
        // Add other user data here as needed
      };
  
      // Store user data in your database
      await db.collection("Users").doc(userCredential.user.uid).set(userData);
  
      // If registration is successful, respond with a success message or user data
      res.status(200).json({ message: "Registration successful", user: userCredential.user.toJSON() });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Registration failed" });
    }
});

// Define a route for user login
app.post("/api/login", async (req, res) => {
try {
const { email, password } = req.body;


// Authenticate the user using Firebase Authentication
const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);


// If authentication is successful, respond with a success message or user data
res.status(200).json({ message: "Login successful", user: userCredential.user.toJSON() });
} catch (error) {
console.error(error);
return res.status(500).json({ error: "Login failed" });
}
});


// Define a route for password reset
app.post("/api/reset-password", async (req, res) => {
try {
const { email } = req.body;


// Send a password reset email using Firebase Authentication
await firebase.auth().sendPasswordResetEmail(email);


// If the password reset email is sent successfully, respond with a success message
res.status(200).json({ message: "Password reset email sent" });
} catch (error) {
console.error(error);
return res.status(500).json({ error: "Password reset failed" });
}
});


// ... (other routes and configurations)


const port = process.env.PORT || 4000;


app.listen(port, () => {
console.log("Server started on port", port);
});
