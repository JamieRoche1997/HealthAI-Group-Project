import React, { useState, useEffect } from "react";
import "../../firebase";
import { db } from "../../firebase"; // Import the Firestore instance
import "./rating.css"; // Import your CSS file for styling

const Rating = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]); // To store retrieved reviews

  // Function to fetch reviews from Firestore
  const fetchReviews = async () => {
    try {
      const reviewsCollection = await db.collection("Rating").get();
      const reviewsData = reviewsCollection.docs.map((doc) => doc.data());
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews(); // Fetch reviews when the component mounts
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save the contact information, rating, and review to the Firestore "Rating" collection
      await db.collection("Rating").add({
        name,
        email,
        subject,
        rating,
        review,
        timestamp: new Date(),
      });

      console.log("Success");

      // Clear the form fields and reset the rating
      setName("");
      setEmail("");
      setSubject("");
      setRating(0);
      setReview("");

      // Refresh the displayed reviews
      fetchReviews();

    } catch (error) {
      console.error("Error saving contact information:", error);
    }
  };

  // Function to handle rating change
  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  // Function to render star icons with highlighting
  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <label key={i} className={`star ${i <= rating ? "highlighted" : ""}`}>
          <input
            type="radio"
            name="rating"
            value={i}
            checked={i === rating}
            onChange={() => handleRatingChange(i)}
          />
          <i className="fas fa-star"></i>
        </label>
      );
    }
    return stars;
  };

  return (
    <div className="auth-form-container">
      <h2>Rate Us</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full Name:</label><br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="John Doe"
            id="name"
            name="name"
          /><br />
          <br />
          <label htmlFor="email">Email Address:</label><br />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="johndoe@gmail.com"
            id="email"
            name="email"
          />
        </div><br />
        <div>
          <label htmlFor="subject">Subject:</label><br />
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            type="subject"
            placeholder="Schedule Appointment"
            id="subject"
            name="subject"
          />
        </div><br />
        {/* Render rating stars */}
        <div>
          <label>Rating:</label><br />
          <div className="rating-stars">{renderRatingStars()}</div>
        </div>
        {/* Add review input field */}
        <div><br />
          <label htmlFor="review">Review:</label>
          <br />
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            id="review"
            name="review"
            rows="6"
            cols="40"
          ></textarea>
        </div><br />
        <button type="submit">Submit</button>
      </form>

      {/* Display reviews */}
      <div className="reviews-container">
        <br />
        <h2>Reviews:</h2>
        <ul>
          {reviews
            .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()) // Sort in descending order
            .map((review, index) => (
              <li key={index}>
                <div>
                  <strong>{review.name}</strong>:
                <br />
                  <span className="highlighted-stars">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </span>
                  <br />
                  {new Date(review.timestamp.toDate()).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </div>
                <div>
                  {review.subject} - <br />
                  <i>"{review.review}"</i>
                </div>
                <br />
              </li>
            ))}
        </ul>
      </div>

    </div>
  );
};

export default Rating;
