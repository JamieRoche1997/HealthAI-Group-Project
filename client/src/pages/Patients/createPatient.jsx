import React, { useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { useNavigate } from "react-router-dom";
import { db } from '../../firebase';

const CreatePatient = () => {
  const { user } = useAuthentication();
  const navigate = useNavigate();

  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    risk: '',
    air_pollution: 1,
    alcohol_consumption: 1,
    dust_exposure: 1,
    genetic_risk: 1,
    balanced_diet: 1,
    obesity: 1,
    smoker: 1,
    passive_smoker: 1,
    chest_pain: 1,
    coughing_blood: 1,
    fatigue: 1,
    weight_loss: 1,
    shortness_breath: 1,
    wheezing: 1,
    swallow_difficulty: 1,
    clubbing_nails: 1,
    snore: 1,
  });

  const saveNewPatient = () => {
    if (user) {
      // Replace underscores with spaces in the name
      const displayName = newPatient.name.replace(/_/g, ' ');

      const patientRef = db.collection('Patient');
      const newPatientData = {
        name: displayName,
        age: newPatient.age,
        gender: newPatient.gender,
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
            <td>Age:</td>
            <td>
              <input
                type="text"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
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
          {Object.keys(newPatient)
            .filter((field) => field !== 'name' && field !== 'age' && field !== 'gender' && field !== 'risk')
            .map((field) => (
              <tr key={field}>
                <td>{capitalizeWords(field)}:</td>
                <td>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={newPatient[field]}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, [field]: e.target.value })
                    }
                  />
                  {newPatient[field]}
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