import React, { useState } from "react";
import "../../firebase";
import { db } from "../../firebase"; // Import the Firestore instance
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save the contact information to the Firestore "Contact-Form" collection
      await db.collection("Contact-Form").add({
        name,
        email,
        phone,
        subject,
        message,
        timestamp: new Date(),
      });

      // Set submission status to true
      setIsSubmitted(true);

      // Clear the form fields
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");

      // Redirect to the '/contact' path upon successful submission
      navigate("/contact");
    } catch (error) {
      console.error("Error saving contact information:", error);
    }
  };

  // Function to display the confirmation message
  const renderConfirmation = () => {
    if (isSubmitted) {
      return <div className="confirmation">We'll be in touch!</div>;
    }
    return null;
  };

  return (
    <div className="auth-form-container">
      <h2>Contact Us</h2>
      <div className="contact-info">
        <label>Address:</label>
        <p><strong>Rossa Ave, <br />Bishopstown, Cork, <br />T12 P928</strong></p><br />
        <label>Email:</label>
        <p><strong>contact@healthai-23.web.app</strong></p><br />
        <label>Phone:</label>
        <p><strong>+353 86 220 8215</strong></p><br />
        <label>Social Media:</label>
        <p>
          <a href="x.com/healthai<"><strong>X</strong></a><br />
          <a href="youtube.com/healthai"><strong>YouTube</strong></a><br />
          <a href="instagram.com/healthai<"><strong>Instgram</strong></a>
        </p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <h2>Write to us!</h2>
          <label htmlFor="name">Full Name:</label><br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="John Doe"
            id="name"
            name="name"
          /><br /><br />
          <label htmlFor="email">Email Address:</label><br />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="johndoe@gmail.com"
            id="email"
            name="email"
          /><br /><br />
        </div>
        <div>
          <label htmlFor="phone">Phone Number:</label><br />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="phone"
            placeholder="+353 86 123 456"
            id="phone"
            name="phone"
          /><br /><br />
          <label htmlFor="subject">Subject:</label><br />
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            type="subject"
            placeholder="Schedule Appointment"
            id="subject"
            name="subject"
          /><br /><br />
        </div>
        <div>
          <label htmlFor="message">Message:</label><br />
          <br />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="message"
            name="message"
            placeholder="Leave a comment..."
            rows="6"
            cols="40"
          ></textarea>
          <br />
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
      {/* Display confirmation message */}
      <br />
      {renderConfirmation()}
    </div>
  );
};

export default Contact;
