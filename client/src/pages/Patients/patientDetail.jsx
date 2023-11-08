import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

import HealthMetricsChart from '../Charts/HealthMetricsChart';
import RespiratorySymptomsChart from '../Charts/RespiratorySymptomsChart';

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
    "radius_mean",
    "texture_mean",
    "perimeter_mean",
    "area_mean",
    "smoothness_mean",
    "compactness_mean",
    "concavity_mean",
    "concave_points",
  ];

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
  

  useEffect(() => {
    const patientRef = db.collection('Patient').doc(patientId);

    patientRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const patientData = doc.data();
          // Calculate the age and add it to the patient data
          const age = calculateAge(patientData.dob);
          setPatient({ ...patientData, age });
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
  
  const exportToCSV = () => {
    // Create headers excluding "Name," "Age," and "Gender"
    const headers = sortedFields
      .filter((key) => !['name', 'age', 'gender', 'phone', 'postcode', 'insurance_name', 'insurance_number'].includes(key))
      .map((key) => capitalizeWords(key));
  
    // Prepare the CSV data using the patient object, excluding "Name," "Age," and "Gender"
    const values = sortedFields
      .filter((key) => !['name', 'age', 'gender' , 'phone', 'postcode', 'insurance_name', 'insurance_number'].includes(key))
      .map((key) => patient[key] || '');
  
    // Combine "Name," "Age," and "Gender" with headers
    const csvHeaders = ['Name', 'Age', 'Gender' , 'Phone', 'Postcode', 'Insurance Name', 'Insurance Number', ...headers];
    
    // Prepare the CSV data for "Name," "Age," and "Gender" followed by values
    const csvValues = [patient.name, patient.age, patient.gender, patient.phone, patient.postcode, patient.insurance_name,
      patient.insurance_number, ...values];
  
    // Combine headers and values into a single array
    const csvData = [csvHeaders, csvValues];
  
    // Convert the CSV data to CSV format
    const csvContent = csvData.map((row) => row.join(',')).join('\n');
  
    // Create a Blob and save it as a CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${patient.name}_patient_details.csv`);
  };
  
  
  
  const exportToPDF = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(12); // Set font size
    doc.text(`${patient.name}'s Details`, 10, 10);
  
    // Create an array to hold the data in the format you want
    const data = [
      ['Name', patient.name],
      ['Age', patient.age],
      ['Gender', patient.gender],
      ['Phone', patient.phone],
      ['Postcode', patient.postcode],
      ['Insurance Name', patient.insurance_name],
      ['Insurance Number', patient.insurance_number],
    ];
  
    // Iterate over the sorted fields and add them to the data array
    sortedFields.forEach((key) => {
      if (!['doctor', 'id', 'name', 'age', 'gender', 'phone', 'postcode', 'insurance_name', 'insurance_number'].includes(key)) {
        data.push([capitalizeWords(key), patient[key]]);
      }
    });
  
    doc.autoTable({
      head: [['Field', 'Value']],
      body: data,
    });
  
    doc.save(`${patient.name}_patient_details.pdf`);
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
            <td>Phone:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={patient.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{patient.phone}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Postcode:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="postcode"
                  value={patient.postcode}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{patient.postcode}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Insurance Name:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="insurance_name"
                  value={patient.insurance_name}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{patient.insurance_name}</span>
              )}
            </td>
          </tr>
          <tr>
            <td>Insurance Number:</td>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  name="insurance_number"
                  value={patient.insurance_number}
                  onChange={handleInputChange}
                />
              ) : (
                <span>{patient.insurance_number}</span>
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
                !['name', 'age', 'gender', 'phone', 'postcode', 'insurance_name', 'insurance_number', 'dob', 'risk'].includes(key)
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
        <>
          <button onClick={handleEditClick}>Edit</button>
          <button onClick={() => exportToCSV()}>Export as CSV</button>
          <button onClick={() => exportToPDF()}>Export as PDF</button>
        </>
      )}
      <div>
        {/* Render the HealthMetricsChart */}
        <HealthMetricsChart data={patient} />
        {/* Render the RespiratorySymptomsChart */}
        <RespiratorySymptomsChart data={patient} />
      </div>
    </div>
  );
};

export default PatientDetail;