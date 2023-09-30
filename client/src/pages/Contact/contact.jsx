import React, { useState } from "react";
import "../../firebase";
import { useNavigate } from "react-router-dom";
 
const Contact = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const apiContactURL = "https://healthai-heroku-1a596fab2241.herokuapp.com/api/contact";

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      let apiUrl;
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        // Use localhost URL for development
        apiUrl = "http://localhost:4000/api/contact"; // Replace your-port with the actual port
      } else {
        // Use the remote API URL for production
        apiUrl = apiContactURL;
      }
    
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, phone, subject, message }),
        });
    
        if (response.ok) {
          console.log("Success");
    
          // Redirect to the '/contact' path upon successful login
          navigate("/contact");
        } else {
          const errorMessage = await response.text();
          console.log("Fail", errorMessage);
        }
      } catch (error) {
        console.error(error);
      }
    };
    

    return (
        <div className="auth-form-container">
      <h2>Contact Us</h2>
      <div className="contact-info">
        <label>Address:</label>
        <p>Rossa Ave, <br/>Bishopstown, Cork, <br/>T12 P928</p>
        <label>Email:</label>
        <p>contact@healthai-23.wep.app</p>
        <label>Phone:</label>
        <p>+353 86 220 8215</p>
        <label>Social Media:</label>
            <p>
                <a href="x.com/healthai<">X</a><br/>
                <a href="youtube.com/healthai">YouTube</a><br/>
                <a href="instagram.com/healthai<">Instgram</a><br/>
            </p>
        </div>
      <form className="contact-form" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Full Name:</label><br/>
                <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="name"
                placeholder="John Doe"
                id="name"
                name="name"
                /><br/>
                <label htmlFor="email">Email Address:</label>
                <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="johndoe@gmail.com"
                id="email"
                name="email"
                />
            </div>
            <div>
                <label htmlFor="phone">Phone Number:</label>
                <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="phone"
                placeholder="+353 86 123 456"
                id="phone"
                name="phone"
                />
                <label htmlFor="subject">Subject:</label>
                <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                type="subject"
                placeholder="Schedule Appointment"
                id="subject"
                name="subject"
                />
            </div>
            <div>
                <label htmlFor="message">Message:</label>
                <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="message"
                placeholder="Enter something..."
                id="message"
                name="message"
                />
            </div>
        <button type="submit">Submit</button>
      </form>
    </div>
    );
};
 
export default Contact;