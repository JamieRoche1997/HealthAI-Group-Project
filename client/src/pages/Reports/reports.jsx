import React, { useState, useEffect } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Reports = () => {
  const { user } = useAuthentication();
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(['name', 'age', 'gender', 'phone', 'postcode', 'insurance_name', 'insurance_number']);
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
        const dataWithAge = selectedFilters.reduce((filteredPatient, filter) => {
          if (filter === 'age') {
            // Calculate and add the age
            filteredPatient['age'] = calculateAge(patient['dob']);
          } else {
            filteredPatient[filter] = patient[filter];
          }
          return filteredPatient;
        }, {});

        return dataWithAge;
      });

      setSelectedData(filteredData);
    };

    updateSelectedData();
  }, [selectedFilters, patients]);

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

  const exportToPDF = () => {
    if (selectedData.length === 0) {
      alert('Please select data to include in the report.');
      return;
    }
  
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: 'landscape',
    });
  
    // Fetch the doctor's information from the Staff database
    if (user && user.email) {
      const staffRef = db.collection('Staff').where('email', '==', user.email);
  
      staffRef.get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const staffData = querySnapshot.docs[0].data();
          // Add doctor's name, work address, and phone number to the PDF letterhead
          doc.setFontSize(8);
          doc.text(`Doctor: ${staffData.name}`, 10, 10);
          doc.text(`Address: ${staffData.workaddressLine1}, ${staffData.workaddressLine2}`, 10, 18);
          doc.text(`Phone Number: ${staffData.phoneNumber}`, 10, 26);
  
          // Define the position for the table below the letterhead
          let tablePosition = 30;
  
          const columns = selectedFilters.map((filter) => formatFieldName(filter));
          const data = selectedData.map((row) => selectedFilters.map((filter) => row[filter] || ''));
  
          // Generate the table
          doc.autoTable({
            head: [columns],
            body: data,
            bodyStyles: { fontSize: 8 }, // Adjust the font size for the table content
            startY: tablePosition,
          });
  
          // Save the PDF
          doc.save('patient_report.pdf');
        } else {
          alert('Doctor information not found.');
        }
      }).catch((error) => {
        console.error('Error getting doctor information:', error);
      });
    } else {
      alert('User information not available.');
    }
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
      setSelectedFilters(['name', 'age', 'gender', 'phone', 'postcode', 'insurance_name', 'insurance_number', ...Object.keys(patients[0])
      .filter((field) => !['name', 'age', 'gender', 'phone', 'postcode', 'insurance_name', 'insurance_number'].includes(field))
      .sort()]);
    } else {
      setSelectedFilters(['name', 'age', 'gender', 'phone', 'postcode', 'insurance_name', 'insurance_number']);
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
      <button onClick={() => setShowModal(true)}>Filter Symptoms</button><br/><br/>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Select Data for Report</h2>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Field</th>
                  <th>Filter</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>Select/Deselect All</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleToggleSelectAll}
                    />
                  </td>
                </tr>
                {Object.keys(patients[0] || {})
                  .filter((field) => !['name', 'age', 'gender', 'phone', 'postcode', 'insurance_name', 'insurance_number'].includes(field))
                  .sort()
                  .map((field) => (
                    <tr key={field}>
                      <td></td>
                      <td>{formatFieldName(field)}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(field)}
                          onChange={() => handleFilterChange(field)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button onClick={() => setShowModal(false)}>Close</button>
            <br />
            <br />
            <button onClick={exportToCSV}>Export CSV</button>
            <button onClick={exportToPDF}>Export PDF</button>
          </div>
        </div>
      )}

      {selectedData.length > 0 && (
        <div className="scrollable-table">
          <h2>Filtered Patient Data</h2>
          <table>
            <thead>
              <tr>
                {selectedFilters.map((filter) => (
                  <th key={filter}>{formatFieldName(filter)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedData.map((data, index) => (
                <tr key={index}>
                  {selectedFilters.map((filter) => (
                    <td key={filter}>{data[filter] || ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}<br/>
      <button onClick={exportToCSV}>Export CSV</button>
      <button onClick={exportToPDF}>Export PDF</button>
    </div>
  );
};

export default Reports;