import React, { useEffect, useState } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { useNavigate } from "react-router-dom";
import { db } from '../../firebase';

const Patients = () => {
  const { user } = useAuthentication();
  const navigate = useNavigate();
  const [originalPatients, setOriginalPatients] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({ age: '', gender: [], risk: [] });
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const addNewPatient = () => {
    navigate('/create-patient'); // Redirect to the createPatient page
  };

  useEffect(() => {
    if (user && user.email) {
      const query = db.collection('Staff').where('email', '==', user.email);

      query
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // Assuming there is only one matching document
          } else {
            console.log('User not found in Firestore');
          }
        })
        .catch((error) => {
          console.error('Error getting user data from Firestore:', error);
        });

      const patientsRef = db.collection('Patient').where('doctor', '==', user.displayName);

      patientsRef
        .get()
        .then((querySnapshot) => {
          const patientData = [];
          querySnapshot.forEach((doc) => {
            const patient = doc.data();
            patientData.push({ ...patient, id: doc.id });
          });
          setOriginalPatients(patientData);
          setPatients(patientData);
        })
        .catch((error) => {
          console.error('Error getting patient data from Firestore:', error);
        });
    }
  }, [user]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const applyFilters = () => {
    setFilterModalOpen(false);

    let filteredPatients = originalPatients;

    if (filterCriteria.age) {
      filteredPatients = filteredPatients.filter((patient) => {
        const age = parseInt(filterCriteria.age);
        if (isNaN(age)) {
          return false;
        }

        if (filterCriteria.ageFilter === 'greaterThan' && age <= parseInt(patient.age)) {
          return true;
        }

        if (filterCriteria.ageFilter === 'lessThan' && age >= parseInt(patient.age)) {
          return true;
        }

        if (filterCriteria.ageFilter === 'between') {
          const ageMin = parseInt(filterCriteria.age);
          const ageMax = parseInt(filterCriteria.age2);
          const patientAge = parseInt(patient.age);
          if (ageMin <= patientAge && patientAge <= ageMax) {
            return true;
          }
        }

        if (filterCriteria.ageFilter === 'equalTo' && age === parseInt(patient.age)) {
          return true;
        }

        return false;
      });
    }

    if (filterCriteria.gender.length > 0) {
      filteredPatients = filteredPatients.filter((patient) => {
        return filterCriteria.gender === patient.gender;
      });
    }

    if (filterCriteria.risk.length > 0) {
      filteredPatients = filteredPatients.filter((patient) => {
        return filterCriteria.risk.includes(patient.risk);
      });
    }

    setPatients(filteredPatients);
  };

  function compareNames(patient1, patient2) {
    const name1 = patient1.name.toLowerCase();
    const name2 = patient2.name.toLowerCase();

    if (name1 < name2) return -1;
    if (name1 > name2) return 1;
    return 0;
  }

  return (
    <div>
      <h1>Patients</h1>
      <input
        type="text"
        placeholder="Search patients..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={() => setFilterModalOpen(true)}>Filter</button>
      <button onClick={addNewPatient}>Add Patient</button>

      {isFilterModalOpen && (
        <div className="filter-modal-overlay">
          <div className="filter-modal">
            <h2>Filter Patients</h2>
            <select
              value={filterCriteria.ageFilter}
              onChange={(e) =>
                setFilterCriteria({ ...filterCriteria, ageFilter: e.target.value })
              }
            >
              <option value="">Select age filter</option>
              <option value="lessThan">Less Than</option>
              <option value="greaterThan">Greater Than</option>
              <option value="between">Between</option>
              <option value="equalTo">Equal To</option>
            </select>
            {filterCriteria.ageFilter === 'between' && (
              <>
                <input
                  type="text"
                  placeholder="Age (Min)"
                  value={filterCriteria.age}
                  onChange={(e) =>
                    setFilterCriteria({ ...filterCriteria, age: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Age (Max)"
                  value={filterCriteria.age2}
                  onChange={(e) =>
                    setFilterCriteria({ ...filterCriteria, age2: e.target.value })
                  }
                />
              </>
            )}
            {filterCriteria.ageFilter !== 'between' && (
              <input
                type="text"
                placeholder="Age"
                value={filterCriteria.age}
                onChange={(e) =>
                  setFilterCriteria({ ...filterCriteria, age: e.target.value })
                }
              />
            )}<br/>
            <label>Gender:</label><br/>
            <select
              value={filterCriteria.gender}
              onChange={(e) =>
                setFilterCriteria({ ...filterCriteria, gender: e.target.value })
              }
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select><br/>
            <label>Risk:</label><br/>
            <select
              value={filterCriteria.risk}
              onChange={(e) =>
                setFilterCriteria({ ...filterCriteria, risk: e.target.value })
              }
            >
              <option value="">Select risk</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select><br/>
            <button onClick={applyFilters}>Apply Filters</button>
            <button onClick={() => setPatients(originalPatients)}>Clear Filters</button>
            <button onClick={() => setFilterModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      <div className="patient-list">
        {patients
          .filter((patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort(compareNames)
          .map((patient) => (
            <div key={patient.id} className="patient-card">
              <a href={`/patient/${patient.id}`}>
                <h3>{patient.name}</h3>
                <p>Age: {patient.age}</p>
                <p>Gender: {patient.gender}</p>
                <p>Risk: {patient.risk}</p>
              </a>
              <br />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Patients;
