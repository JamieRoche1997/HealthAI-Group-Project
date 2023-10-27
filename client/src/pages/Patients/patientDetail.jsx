import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';

const PatientDetail = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const numericFields = [
    "air_pollution",
    "alcohol_consumption",
    "dust_exposure",
    "genetic_risk",
    "balanced_diet",
    "obesity",
    "smoker",
    "passive_smoker",
    "chest_pain",
    "coughing_blood",
    "fatigue",
    "weight_loss",
    "shortness_breath",
    "wheezing",
    "swallow_difficulty",
    "clubbing_nails",
    "snore",
  ];

  useEffect(() => {
    const patientRef = db.collection('Patient').doc(patientId);

    patientRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const patientData = doc.data();
          setPatient(patientData);
        } else {
          console.log('Patient not found in Firestore');
        }
      })
      .catch((error) => {
        console.error('Error getting patient data from Firestore:', error);
      });
  }, [patientId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  
    if (patient) {
      const patientRef = db.collection('Patient').doc(patientId);
  
      // Create a copy of the patient object and convert numeric fields to numbers
      const updatedPatient = { ...patient };
  
      for (const field of numericFields) {
        updatedPatient[field] = parseInt(updatedPatient[field]);
      }
  
      // Update the patient data in Firestore with the converted values
      patientRef
        .update(updatedPatient)
        .then(() => {
          console.log('Patient information updated successfully in Firestore.');
        })
        .catch((error) => {
          console.error('Error updating patient information in Firestore:', error);
        });
    }
  
  

    if (patient) {
      const patientRef = db.collection('Patient').doc(patientId);

      for (const field of numericFields) {
        patient[field] = parseInt(patient[field]);
      }

      // Update the patient data in Firestore
      patientRef
        .update(patient)
        .then(() => {
          console.log('Patient information updated successfully in Firestore.');
        })
        .catch((error) => {
          console.error('Error updating patient information in Firestore:', error);
        });
    }
  };

  function capitalizeWords(str) {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = numericFields.includes(name) ? parseInt(value, 10) : value;
    setPatient((prevPatient) => ({
      ...prevPatient,
      [name]: newValue,
    }));
  };
  

  if (!patient) {
    return <div>Loading...</div>;
  }

  // Sort fields alphabetically for display
  const sortedFields = Object.keys(patient).sort();

  return (
    <div>
      <h1>{patient.name}'s Details</h1>
      <table>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={patient.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{patient.name}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Age:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="age"
                  value={patient.age}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{patient.age}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>
              {isEditing ? (
                <div>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={patient.gender === 'Male'}
                  onChange={handleInputChange}
                />
                <label>Male</label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={patient.gender === 'Female'}
                  onChange={handleInputChange}
                />
                <label>Female</label>
              </div>
              ) : (
                <span>{patient.gender}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Risk:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="risk"
                  value={patient.risk}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{patient.risk}</span>
              )}
            </td>
          </tr>
          {sortedFields
            .filter(
              (key) =>
                key !== 'doctor' &&
                key !== 'id' &&
                !['name', 'age', 'gender', 'risk'].includes(key)
            )
            .map((key) => (
              <tr key={key}>
                <td>{capitalizeWords(key)}:</td>
                <td>
                  {isEditing ? (
                    <div>
                      <input
                        type="range"
                        name={key}
                        min="1"
                        max="8"
                        step="1"
                        value={patient[key]}
                        onChange={handleInputChange}
                      />
                      <span>{patient[key]}</span>
                    </div>
                  ) : (
                    <span>{patient[key]}</span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <br />
      {isEditing ? (
        <button onClick={handleSaveClick}>Save</button>
      ) : (
        <button onClick={handleEditClick}>Edit</button>
      )}
    </div>
  );
};

export default PatientDetail;
