import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebase';

const BreastPredict = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');
  const predictionLevel = queryParams.get('predictionLevel');
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (patientId) {
      // Retrieve patient data from the database using the patientId
      const patientRef = db.collection('Patient').doc(patientId);

      patientRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            setPatientData(doc.data());

            // Calculate age after setting patient data
            const age = calculateAge(doc.data().dob);
            setPatientData({ ...doc.data(), age }); // Include age in patient data
          } else {
            console.log('Patient not found in Firestore');
          }
        })
        .catch((error) => {
          console.error('Error getting patient data from Firestore:', error);
        });
    }
  }, [patientId]);

  function calculateAge(dob) {
    // Split the date string and parse it correctly
    const parts = dob.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
  
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        const dobDate = new Date(year, month - 1, day); // Month is zero-based
        const currentDate = new Date();
        let age = currentDate.getFullYear() - dobDate.getFullYear();
  
        if (
          currentDate.getMonth() < dobDate.getMonth() ||
          (currentDate.getMonth() === dobDate.getMonth() &&
            currentDate.getDate() < dobDate.getDate())
        ) {
          age--;
        }
  
        return age;
      }
    }
    // Return an appropriate value or handle the error as needed
    return 0; // Default value or NaN, depending on your use case
  }

  // Advice and guidance based on prediction level
  const getAdvice = () => {
    switch (predictionLevel) {
      case 'Unlikely':
        return (
          <>
            <p>
              The machine learning prediction for {patientData?.name}'s breast cancer risk is unlikely.
            </p>
            <p>
              While the model suggests a low risk, it's important to interpret this as an initial evaluation.
            </p>
            <p>
              Further discussions with the patient and consideration of additional tests are recommended.
            </p>
          </>
        );
      case 'Likely':
        return (
          <>
            <p>
              The prediction for {patientData?.name}'s breast cancer risk is likely.
            </p>
            <p>
              It's advisable to proceed with additional diagnostic tests and discuss the results thoroughly with the patient.
            </p>
            <p>
              Consider involving a specialist for a more comprehensive evaluation and treatment planning.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Breast Cancer Prediction</h1>
      {patientData ? (
        <>
          <p>Patient Name: {patientData.name}</p>
          <p>Age: {patientData.age}</p>
          <p>Gender: {patientData.gender}</p>
        </>
      ) : (
        <p>Loading patient information...</p>
      )}
      <p>Prediction Level: {predictionLevel}</p>
      {getAdvice()}
      {/* Add your content here */}
    </div>
  );
};

export default BreastPredict;
