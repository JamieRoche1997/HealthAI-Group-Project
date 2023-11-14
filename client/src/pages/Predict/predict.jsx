import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Predict = () => {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading');
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (user && user.uid) {
      // Query the Firestore database for the user's subscription status
      const query = db.collection('Staff').doc(user.uid);

      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            // Assuming the document structure includes an 'activeSubscription' field and a 'price' field
            const activeSubscription = doc.data().activeSubscription;
            const priceID = doc.data().priceID;

            // Check if the user has an active subscription with the required price ID
            if (activeSubscription === true && priceID === 'price_1NxvKuF4O3GGcqFnHupONSSa') {
              setSubscriptionStatus('active');
            } else {
              setSubscriptionStatus('upgrade');
            }
          } else {
            console.log('User not found in Firestore');
            setSubscriptionStatus('notfound');
          }
        })
        .catch((error) => {
          console.error('Error getting user data from Firestore:', error);
          setSubscriptionStatus('error');
        });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.uid) {
      // Retrieve the list of patients for the logged-in user
      const patientsRef = db.collection('Patient').where('doctor', '==', user.displayName);

      patientsRef
        .get()
        .then((querySnapshot) => {
          const patientData = [];
          querySnapshot.forEach((doc) => {
            const patient = doc.data();
            // Calculate the age and add it to the patient data
            const age = calculateAge(patient.dob);
            patientData.push({ ...patient, id: doc.id, age });
          });
          setPatients(patientData);
        })
        .catch((error) => {
          console.error('Error getting patient data from Firestore:', error);
        });
    }
  }, [user]);

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
  

  const retrieveCustomerPortalSession = () => {
    if (user && user.uid) {
      // Set loading state to true
      setIsLoadingUpgrade(true);

      // Query the Firestore database for the user's data based on their uid
      const query = db.collection('Staff').doc(user.uid);

      query
        .get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            if (userData.activeSubscription) {
              // User has an active subscription, create a customer portal session
              axios
                .post('https://healthai-heroku-1a596fab2241.herokuapp.com/api/retrieve-customer-portal-session', {
                  user: user, // Send the user object
                })
                .then((response) => {
                  const { customerPortalSessionUrl } = response.data;
                  window.location.href = customerPortalSessionUrl;
                  console.log(customerPortalSessionUrl);
                })
                .catch((error) => {
                  console.error('Error retrieving customer portal session:', error);
                })
                .finally(() => {
                  // Set loading state back to false when the request is completed
                  setIsLoadingUpgrade(false);
                });
            } else {
              // User does not have an active subscription, redirect to pricing page
              window.location.href = '/pricing-page'; // Change this URL to your pricing page path
            }
          } else {
            console.log('User not found in Firestore');
          }
        })
        .catch((error) => {
          console.error('Error getting user data from Firestore:', error);
        });
    } else {
      console.error('User not authenticated');
    }
  };

  const openPredictionModal = (patient) => {
    setSelectedPatient(patient);
  };

  const closePatientPredictions = () => {
    setSelectedPatient(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  function compareNames(patient1, patient2) {
    const name1 = patient1.name.toLowerCase();
    const name2 = patient2.name.toLowerCase();

    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  }

  const lungPrediction = async () => {
    if (selectedPatient) {
      const lungAttributes = [
        selectedPatient.age,
        selectedPatient.gender,
        selectedPatient.air_pollution,
        selectedPatient.alcohol_consumption,
        selectedPatient.dust_exposure,
        selectedPatient.genetic_risk,
        selectedPatient.balanced_diet,
        selectedPatient.obesity,
        selectedPatient.smoker,
        selectedPatient.passive_smoker,
        selectedPatient.chest_pain,
        selectedPatient.coughing_blood,
        selectedPatient.fatigue,
        selectedPatient.weight_loss,
        selectedPatient.shortness_breath,
        selectedPatient.wheezing,
        selectedPatient.swallow_difficulty,
        selectedPatient.clubbing_nails,
        selectedPatient.snore,
      ];

      console.log('Lung Attributes:', lungAttributes);
    
      // Send lungAttributes to the server
      axios.post('https://healthiai-predict.onrender.com/predict_lung', { data: lungAttributes })
      .then(response => {
        // Handle the response if needed
        console.log(response.data);
      })
      .catch(error => {
        // Handle errors if any
        console.error('Error sending data to server:', error);
      });
  }
  };

  const heartPrediction = () => {
    if (selectedPatient) {
      const heartAttributes = {
        chest_pain_type: selectedPatient.chest_pain_type,
        resting_blood_pressure: selectedPatient.resting_blood_pressure,
        serum_cholesterol: selectedPatient.serum_cholesterol,
        fasting_blood_sugar: selectedPatient.fasting_blood_sugar,
        resting_electrocardiographic_results: selectedPatient.resting_electrocardiographic_results,
        max_heart_rate_achieved: selectedPatient.max_heart_rate_achieved,
        exercise_induced_angina: selectedPatient.exercise_induced_angina,
        oldpeak: selectedPatient.oldpeak,
        slope_of_peak_exercise_ST_segment: selectedPatient.slope_of_peak_exercise_ST_segment,
        num_major_vessels: selectedPatient.num_major_vessels,
        thal: selectedPatient.thal,
      };

      // You can use the heartAttributes array for your prediction
      console.log('Heart Attributes:', heartAttributes);
    }

    navigate('/heart-predict');
  };

  const breastPrediction = () => {
    if (selectedPatient) {
      const breastAttributes = {
        radius_mean: selectedPatient.radius_mean,
        texture_mean: selectedPatient.texture_mean,
        perimeter_mean: selectedPatient.perimeter_mean,
        area_mean: selectedPatient.area_mean,
        smoothness_mean: selectedPatient.smoothness_mean,
        compactness_mean: selectedPatient.compactness_mean,
        concavity_mean: selectedPatient.concavity_mean,
        concave_points: selectedPatient.concave_points,
      };

      // You can use the breastAttributes array for your prediction
      console.log('Breast Attributes:', breastAttributes);
    }

    navigate('/breast-predict');
  };

  let content;

  switch (subscriptionStatus) {
    case 'active':
      content = (
        <div>
          <h1>Predict</h1>
          <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={handleSearch}
            />
          <div className="patient-list">
            {patients
              .filter((patient) =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort(compareNames)
              .map((patient) => (
                <div key={patient.id} className="patient-card">
                  <button onClick={() => openPredictionModal(patient)}>
                    <h3>{patient.name}</h3>
                    <p>Age: {patient.age}</p>
                    <p>Gender: {patient.gender}</p>
                    <p>Risk: {patient.risk}</p>
                  </button>
                  <br />
                </div>
              ))}
          </div>
        </div>
      );
      break;
    case 'upgrade':
      content = (
        <div>
          <h1>Upgrade to Premium</h1>
          <p>You need a Premium subscription to access this page.</p>
          <button onClick={retrieveCustomerPortalSession} disabled={isLoadingUpgrade}>
            {isLoadingUpgrade ? 'Loading...' : 'Upgrade'}
          </button>
        </div>
      );
      break;
    case 'notfound':
      content = <p>User not found in Firestore.</p>;
      break;
    case 'error':
      content = <p>Error getting user data from Firestore.</p>;
      break;
    default:
      content = <p>Loading...</p>;
  }

  return (
    <div>
      {content}
      {selectedPatient && (
        <div className="filter-modal-overlay">
          <div className="filter-modal">
            <h3>Prediction for {selectedPatient.name}</h3>
            <button onClick={lungPrediction}>Lung Cancer Prediction</button><br/><br/>
            <button onClick={heartPrediction}>Heart Disease Prediction</button><br/><br/>
            <button onClick={breastPrediction}>Breast Cancer Prediction</button><br/><br/>
            <button onClick={closePatientPredictions}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predict;