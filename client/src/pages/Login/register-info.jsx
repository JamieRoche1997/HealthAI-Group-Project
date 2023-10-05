import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase"; // Import the Firestore instance

const RegisterInfo = () => {
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [town, setTown] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [workaddressLine1, setWorkAddressLine1] = useState("");
  const [workaddressLine2, setWorkAddressLine2] = useState("");
  const [worktown, setWorkTown] = useState("");
  const [workcity, setWorkCity] = useState("");
  const [workcountry, setWorkCountry] = useState("");
  const [workpostcode, setWorkPostcode] = useState("");  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Get the UID of the currently signed-in user
      const user = getAuth().currentUser;
      const uid = user ? user.uid : null;

      // Append the additional information to the Staff collection in Firestore
      if (uid) {
        const staffRef = db.collection("Staff").doc(uid);
        await staffRef.set({
          addressLine1,
          addressLine2,
          town,
          city,
          country,
          postcode,
          phoneNumber,
          licenseNumber,
          workplace,
          workaddressLine1,
          workaddressLine2,
          worktown,
          workcity,
          workcountry,
          workpostcode,
          // Add more fields as needed
        }, { merge: true }); // Use merge to update the existing document if it exists
      }

      // Redirect to the desired page upon successful submission
      navigate("/pricing-page"); // You can change the route as needed
    } catch (error) {
      console.error("Error saving additional information:", error);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Additional Information</h2>
      <form className="additional-info-form" onSubmit={handleSubmit}>
        <label htmlFor="addressLine1">Address Line 1:</label><br/>
        <input
          value={addressLine1}
          onChange={(e) => setAddressLine1(e.target.value)}
          type="text"
          placeholder="123 Main St"
          id="addressLine1"
          name="addressLine1"
        /><br/>
        <label htmlFor="addressLine2">Address Line 2:</label><br/>
        <input
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          type="text"
          placeholder="Apt 4B"
          id="addressLine2"
          name="addressLine2"
        /><br/>
        <label htmlFor="town">Town:</label><br/>
        <input
          value={town}
          onChange={(e) => setTown(e.target.value)}
          type="text"
          placeholder="Town"
          id="town"
          name="town"
        /><br/>
        <label htmlFor="city">City:</label><br/>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          type="text"
          placeholder="City"
          id="city"
          name="city"
        /><br/>
        <label htmlFor="country">Country:</label><br/>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          type="text"
          placeholder="Country"
          id="country"
          name="country"
        /><br/>
        <label htmlFor="postcode">Postcode:</label><br/>
        <input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          type="text"
          placeholder="12345"
          id="postcode"
          name="postcode"
        /><br/>
        <label htmlFor="phoneNumber">Phone Number:</label><br/>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="text"
          placeholder="+1234567890"
          id="phoneNumber"
          name="phoneNumber"
        /><br/>
        <label htmlFor="licenseNumber">Medical License Number:</label><br/>
        <input
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          type="text"
          placeholder="Medical License Number"
          id="licenseNumber"
          name="licenseNumber"
        /><br/>
        <label htmlFor="workplace">Work Place:</label><br/>
        <input
          value={workplace}
          onChange={(e) => setWorkplace(e.target.value)}
          type="text"
          placeholder="123 Main St"
          id="workplace"
          name="workplace"
        /><br/>
        <label htmlFor="workaddressLine1">Work Address Line 1:</label><br/>
        <input
          value={workaddressLine1}
          onChange={(e) => setWorkAddressLine1(e.target.value)}
          type="text"
          placeholder="123 Main St"
          id="workaddressLine1"
          name="workaddressLine1"
        /><br/>
        <label htmlFor="workaddressLine2">Work Address Line 2:</label><br/>
        <input
          value={workaddressLine2}
          onChange={(e) => setWorkAddressLine2(e.target.value)}
          type="text"
          placeholder="Apt 4B"
          id="workaddressLine2"
          name="workaddressLine2"
        /><br/>
        <label htmlFor="worktown">Work Town:</label><br/>
        <input
          value={worktown}
          onChange={(e) => setWorkTown(e.target.value)}
          type="text"
          placeholder="Town"
          id="worktown"
          name="worktown"
        /><br/>
        <label htmlFor="workcity">Work City:</label><br/>
        <input
          value={workcity}
          onChange={(e) => setWorkCity(e.target.value)}
          type="text"
          placeholder="City"
          id="workcity"
          name="workcity"
        /><br/>
        <label htmlFor="workcountry">Work Country:</label><br/>
        <input
          value={workcountry}
          onChange={(e) => setWorkCountry(e.target.value)}
          type="text"
          placeholder="Country"
          id="workcountry"
          name="workcountry"
        /><br/>
        <label htmlFor="workpostcode">Work Postcode:</label><br/>
        <input
          value={workpostcode}
          onChange={(e) => setWorkPostcode(e.target.value)}
          type="text"
          placeholder="12345"
          id="workpostcode"
          name="workpostcode"
        /><br/>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default RegisterInfo;
