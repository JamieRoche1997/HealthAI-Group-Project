import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';

const PatientDetail = () => {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
  
      // Prepare the updated patient data
      const updatedPatientData = {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        risk: patient.risk,
      };
  
      // Update the patient data in Firestore
      patientRef
        .update(updatedPatientData)
        .then(() => {
          console.log('Patient information updated successfully in Firestore.');
        })
        .catch((error) => {
          console.error('Error updating patient information in Firestore:', error);
        });
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{patient.name}'s Details</h1>
      {isEditing ? (
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>
                <input
                  type="text"
                  name="name"
                  value={patient.name}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Age:</td>
              <td>
                <input
                  type="text"
                  name="age"
                  value={patient.age}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>
                <input
                  type="text"
                  name="gender"
                  value={patient.gender}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>Risk:</td>
              <td>
                <input
                  type="text"
                  name="risk"
                  value={patient.risk}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{patient.name}</td>
            </tr>
            <tr>
              <td>Age:</td>
              <td>{patient.age}</td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>{patient.gender}</td>
            </tr>
            <tr>
              <td>Risk:</td>
              <td>{patient.risk}</td>
            </tr>
          </tbody>
        </table>
      )}
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
