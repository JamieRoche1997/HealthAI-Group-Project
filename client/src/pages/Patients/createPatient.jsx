import React, { useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { useNavigate } from "react-router-dom";
import { db } from '../../firebase';

const CreatePatient = () => {
  const { user } = useAuthentication();
  const navigate = useNavigate();

  const [newPatient, setNewPatient] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    postcode: '',
    insurance_name: '',
    insurance_number: '',
    risk: '',
    air_pollution: 0,
    alcohol_consumption: 0,
    dust_exposure: 0,
    genetic_risk: 0,
    balanced_diet: 0,
    obesity: 0,
    smoker: 0,
    passive_smoker: 0,
    chest_pain: 0,
    coughing_blood: 0,
    fatigue: 0,
    weight_loss: 0,
    shortness_breath: 0,
    wheezing: 1,
    swallow_difficulty: 0,
    clubbing_nails: 0,
    snore: 0,
    breast_tissue: "",
    radius_mean: 0,
    texture_mean: 0,
    perimeter_mean: 0,
    area_mean: 0,
    smoothness_mean: 0,
    compactness_mean: 0,
    concavity_mean: 0,
    concave_points: 0,
  });

  const fieldRanges = {
    radius_mean: { min: 6.98, max: 28.1 },
    texture_mean: { min: 9.71, max: 39.3 },
    perimeter_mean: { min: 43.8, max: 189 },
    area_mean: { min: 144, max: 2500 },
    smoothness_mean: { min: 0.05, max: 0.16 },
    compactness_mean: { min: 0.02, max: 0.35 },
    concavity_mean: { min: 0, max: 0.43 },
    concave_points: { min: 0, max: 0.2 },
  };

  const saveNewPatient = () => {
    if (user) {
      // Replace underscores with spaces in the name
      const displayName = newPatient.name.replace(/_/g, ' ');

      // Convert the input date string to the desired format
      const inputDate = newPatient.dob; // Assume it's in 'YYYY-MM-DD' format
      const [year, month, day] = inputDate.split('-');
      const formattedDOB = `${day}-${month}-${year}`;

      const patientRef = db.collection('Patient');
      const newPatientData = {
        name: displayName,
        dob: formattedDOB,
        gender: newPatient.gender,
        phone: newPatient.phone,
        postcode: newPatient.postcode,
        insurance_name: newPatient.insurance_name,
        insurance_number: newPatient.insurance_number,
        risk: newPatient.risk,
        air_pollution: newPatient.air_pollution,
        alcohol_consumption: newPatient.alcohol_consumption,
        dust_exposure: newPatient.dust_exposure,
        genetic_risk: newPatient.genetic_risk,
        balanced_diet: newPatient.balanced_diet,
        obesity: newPatient.obesity,
        smoker: newPatient.smoker,
        passive_smoker: newPatient.passive_smoker,
        chest_pain: newPatient.chest_pain,
        coughing_blood: newPatient.coughing_blood,
        fatigue: newPatient.fatigue,
        weight_loss: newPatient.weight_loss,
        shortness_breath: newPatient.shortness_breath,
        wheezing: newPatient.wheezing,
        swallow_difficulty: newPatient.swallow_difficulty,
        clubbing_nails: newPatient.clubbing_nails,
        snore: newPatient.snore,
        breast_tissue: newPatient.breast_tissue,
        radius_mean: newPatient.radius_mean,
        texture_mean: newPatient.texture_mean,
        perimeter_mean: newPatient.perimeter_mean,
        area_mean: newPatient.area_mean,
        smoothness_mean: newPatient.smoothness_mean,
        compactness_mean: newPatient.compactness_mean,
        concavity_mean: newPatient.concavity_mean,
        concave_points: newPatient.concave_points,
        doctor: user.displayName,
      };

      patientRef
        .add(newPatientData)
        .then((docRef) => {
          console.log('New patient added with ID: ', docRef.id);
          navigate('/patients'); // Redirect back to the Patients page
        })
        .catch((error) => {
          console.error('Error adding new patient: ', error);
        });
    }
  };

  function capitalizeWords(str) {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div>
      <h1>Create New Patient</h1>
      <table>
        <tbody>
          <tr>
            <td>Name:</td>
            <td>
              <input
                type="text"
                placeholder="Name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>Date Of Birth:</td>
            <td>
              <input
                type="date"
                placeholder="DD-MM-YYY"
                value={newPatient.dob}
                onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>
            <div>
                <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={newPatient.gender === 'Male'}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: 'Male' })}
                />
                <label>Male</label>
                <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={newPatient.gender === 'Female'}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: 'Female' })}
                />
                <label>Female</label>
            </div>

            </td>
          </tr>
          <tr>
            <td>Phone:</td>
            <td>
              <input
                type="text"
                placeholder="Phone"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>Postcode:</td>
            <td>
              <input
                type="text"
                placeholder="Postcode"
                value={newPatient.postcode}
                onChange={(e) => setNewPatient({ ...newPatient, postcode: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>Insurance Name:</td>
            <td>
              <input
                type="text"
                placeholder="Insurance Name"
                value={newPatient.insurance_name}
                onChange={(e) => setNewPatient({ ...newPatient, insurance_name: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td>Insurance Number:</td>
            <td>
              <input
                type="text"
                placeholder="Insurance Number"
                value={newPatient.insurance_number}
                onChange={(e) => setNewPatient({ ...newPatient, insurance_number: e.target.value })}
              />
            </td>
          </tr>

          {Object.keys(newPatient)
  .filter(
    (field) =>
      field !== 'name' &&
      field !== 'dob' &&
      field !== 'gender' &&
      field !== 'risk' &&
      field !== 'phone' &&
      field !== 'postcode' &&
      field !== 'insurance_name' &&
      field !== 'insurance_number'
  )
  .map((field) => (
    <tr key={field}>
      <td>{capitalizeWords(field)}:</td>
      <td>
        {field === 'breast_tissue' ? (
          <div>
            <input
              type="radio"
              name="breast_tissue"
              value="Malignant"
              checked={newPatient.breast_tissue === 'Malignant'}
              onChange={(e) =>
                setNewPatient({ ...newPatient, breast_tissue: 'Malignant' })
              }
            />
            <label>Malignant</label>
            <input
              type="radio"
              name="breast_tissue"
              value="Benign"
              checked={newPatient.breast_tissue === 'Benign'}
              onChange={(e) =>
                setNewPatient({ ...newPatient, breast_tissue: 'Benign' })
              }
            />
            <label>Benign</label>
          </div>
        ) : field in fieldRanges ? (
          <div>
            <input
              type="range"
              min={fieldRanges[field].min}
              max={fieldRanges[field].max}
              step="0.001"
              value={newPatient[field]}
              onChange={(e) =>
                setNewPatient({ ...newPatient, [field]: e.target.value })
              }
            />
            <span>{newPatient[field]}</span>
          </div>
        ) : (
          <div>
            <input
              type="range"
              min="0"
              max="8"
              step="1"
              value={newPatient[field]}
              onChange={(e) =>
                setNewPatient({ ...newPatient, [field]: e.target.value })
              }
            />
            <span>{newPatient[field]}</span>
          </div>
        )}
      </td>
    </tr>
  ))}



          <tr>
            <td></td>
            <td>
              <button onClick={saveNewPatient}>Save Patient</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CreatePatient