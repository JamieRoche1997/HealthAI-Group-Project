import React, { useState, useEffect } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import { saveAs } from 'file-saver';

const Reports = () => {
  const { user } = useAuthentication();
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(['name', 'age', 'gender']);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      const query = db.collection('Patient').where('doctor', '==', user.displayName);

      query
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const patientData = [];
            querySnapshot.forEach((doc) => {
              patientData.push(doc.data());
            });
            setPatients(patientData);
          } else {
            console.log('No patients found in Firestore for this user');
          }
        })
        .catch((error) => {
          console.error('Error getting patient data from Firestore:', error);
        });
    }
  }, [user]);

  // Function to update selected data based on filters
  useEffect(() => {
    const updateSelectedData = () => {
      const filteredData = patients.map((patient) => {
        return selectedFilters.reduce((filteredPatient, filter) => {
          filteredPatient[filter] = patient[filter];
          return filteredPatient;
        }, {});
      });
  
      setSelectedData(filteredData);
    };
  
    updateSelectedData();
  }, [selectedFilters, patients]);
  

  // Function to export data as CSV
  const exportToCSV = () => {
    if (selectedData.length === 0) {
      alert('Please select data to include in the report.');
      return;
    }

    const headers = selectedFilters;
    const csvRows = [headers];

    for (const data of selectedData) {
      const values = headers.map((header) => data[header] || '');
      csvRows.push(values);
    }

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'patient_report.csv');
  };

  function formatFieldName(fieldName) {
    // Split the field name into words using underscores as separators
    const words = fieldName.split('_');
  
    // Capitalize the first letter of each word
    const formattedWords = words.map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1)
    );
  
    // Join the formatted words with spaces
    return formattedWords.join(' ');
  }
  

  const handleToggleSelectAll = () => {
    setSelectAll(!selectAll);

    if (!selectAll) {
      setSelectedFilters(['name', 'age', 'gender', ...Object.keys(patients[0])
      .filter((field) => !['name', 'age', 'gender'].includes(field))
      .sort()]);
    } else {
      setSelectedFilters(['name', 'age', 'gender']);
    }
  };

  const handleFilterChange = (filter) => {
    const updatedFilters = [...selectedFilters];
    const filterIndex = updatedFilters.indexOf(filter);

    if (filterIndex === -1) {
      updatedFilters.push(filter);
    } else {
      updatedFilters.splice(filterIndex, 1);
    }

    setSelectedFilters(updatedFilters);
  };

  return (
    <div>
      <h1>Reports</h1>
      <button onClick={() => setShowModal(true)}>Generate Report</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Data for Report</h2>
            <ul>
              <li>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleToggleSelectAll}
                />
                Select/Deselect All
              </li>
              {Object.keys(patients[0] || {})
              .filter((field) => !['name', 'age', 'gender'].includes(field))
              .sort()
              .map((field) => (
                <li key={field}>
                  {formatFieldName(field)}
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(field)}
                    onChange={() => handleFilterChange(field)}
                  />
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      <button onClick={exportToCSV}>Export CSV</button>
    </div>
  );
};

export default Reports;

