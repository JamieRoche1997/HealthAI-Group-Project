import React, { useEffect, useState, useRef } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import Chart from 'chart.js/auto';


const Dashboard = () => {
  const { user } = useAuthentication();
  const [patients, setPatients] = useState([]);
  const canvasRef = useRef(null);
  const lifestyleFactorsChartRef = useRef(null);
  const respiratorySymptomsChartRef = useRef(null);
  const environmentalFactorsChartRef = useRef(null);
  const snoringChartRef = useRef(null);
  const dietDonutChartRef = useRef(null);
  const ageChartRef = useRef(null);
  const genderChartRef = useRef(null);


  const [summary1, setSummary1] = useState({
    patientCount: 0,
    averageAge: 0,
    mostCommonCondition: '',
  });

  const [summary, setSummary] = useState({
    airPollutionCount: 0,
    dustExposureCount: 0,
    geneticRiskCount: 0,
    alcoholConsumptionCount: 0,
    smokerCount: 0,
    dietComplianceCount: 0,
    coughingBloodCount: 0,
    fatigueCount: 0,
    wheezingCount: 0,
    obesityCount: 0,
    clubbingNailsCount: 0,
    snoringCount: 0,
  });


  useEffect(() => {
    if (user && user.uid) {
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

      // Fetch patient data
      const patientsRef = db.collection('Patient').where('doctor', '==', user.displayName);

      patientsRef
        .get()
        .then((querySnapshot) => {
          const patientData = [];
          querySnapshot.forEach((doc) => {
            const patient = doc.data();
            // Calculate the age and add it to the patient data
            patient.age = calculateAge(patient.dob);
            patientData.push(patient);
          });
          setPatients(patientData);


          // Calculate key metrics
          const patientCount = patientData.length;
          const totalAge = patientData.reduce((sum, patient) => sum + patient.age, 0);
          const averageAge = Math.round(totalAge / patientCount);

          const conditions = patientData.map((patient) => patient.condition);
          const conditionCounts = {};
          let mostCommonCondition = '';


          conditions.forEach((condition) => {
            if (condition in conditionCounts) {
              conditionCounts[condition]++;
            } else {
              conditionCounts[condition] = 1;
            }


            if (conditionCounts[condition] > conditionCounts[mostCommonCondition]) {
              mostCommonCondition = condition;
            }
          });


          setSummary1({
            patientCount,
            averageAge,
            mostCommonCondition,
          });
        })
        .catch((error) => {
          console.error('Error getting patient data:', error);
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
  

  useEffect(() => {
    if (patients.length > 0) {

      // Environmental Factors Summary
      const airPollutionCount = patients.filter((patient) => patient.air_pollution >= 4).length;
      const dustExposureCount = patients.filter((patient) => patient.dust_exposure >= 4).length;
      const geneticRiskCount = patients.filter((patient) => patient.genetic_risk >= 4).length;

      // Lifestyle Factors Summary
      const alcoholConsumptionCount = patients.filter((patient) => patient.alcohol_consumption >= 4).length;
      const smokerCount = patients.filter((patient) => patient.smoker >= 1).length;
      const dietComplianceCount = patients.filter((patient) => patient.balanced_diet >= 4).length;

      // Respiratory Symptoms Summary
      const coughingBloodCount = patients.filter((patient) => patient.coughing_blood >= 4).length;
      const fatigueCount = patients.filter((patient) => patient.fatigue >= 4).length;
      const wheezingCount = patients.filter((patient) => patient.wheezing >= 4).length;

      // Chronic Conditions Overview
      const obesityCount = patients.filter((patient) => patient.obesity >= 4).length;
      const clubbingNailsCount = patients.filter((patient) => patient.clubbing_nails >= 4).length;

      // Sleep Patterns
      const snoringCount = patients.filter((patient) => patient.snore >= 1).length;

      setSummary({
        airPollutionCount,
        dustExposureCount,
        geneticRiskCount,
        alcoholConsumptionCount,
        smokerCount,
        dietComplianceCount,
        coughingBloodCount,
        fatigueCount,
        wheezingCount,
        obesityCount,
        clubbingNailsCount,
        snoringCount,
      });
    }
  }, [patients]);

  useEffect(() => {
    if (patients.length > 0) {
      const patientLabels = patients.map((patient) => patient.name);
      const alcoholConsumptionData = patients.map((patient) => patient.alcohol_consumption);
      const smokerData = patients.map((patient) => patient.smoker);
      const passiveSmokerData = patients.map((patient) => patient.passive_smoker);
      const balancedDietData = patients.map((patient) => patient.balanced_diet);
  
      const lifestyleFactorsChartData = {
        labels: patientLabels,
        datasets: [
          {
            label: 'Alcohol Consumption',
            data: alcoholConsumptionData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Smoker',
            data: smokerData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Passive Smoker',
            data: passiveSmokerData,
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 1,
          },
          {
            label: 'Balanced Diet',
            data: balancedDietData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
  
      if (lifestyleFactorsChartRef.current && lifestyleFactorsChartData) {
        const lifestyleFactorsCtx = lifestyleFactorsChartRef.current.getContext('2d');
        new Chart(lifestyleFactorsCtx, {
          type: 'bar',
          data: lifestyleFactorsChartData,
        });
      }
    }
  }, [patients]);
  
  useEffect(() => {
    if (patients.length > 0) {
      const patientLabels = patients.map((patient) => patient.name);
      const coughingBloodData = patients.map((patient) => patient.coughing_blood);
      const fatigueData = patients.map((patient) => patient.fatigue);
      const wheezingData = patients.map((patient) => patient.wheezing);
  
      const respiratorySymptomsChartData = {
        labels: patientLabels,
        datasets: [
          {
            label: 'Coughing Blood',
            data: coughingBloodData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Fatigue',
            data: fatigueData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: 'Wheezing',
            data: wheezingData,
            borderColor: 'rgba(255, 205, 86, 1)',
            backgroundColor: 'rgba(255, 205, 86, 0.2)',
          },
        ],
      };
  
      if (respiratorySymptomsChartRef.current && respiratorySymptomsChartData) {
        const respiratorySymptomsCtx = respiratorySymptomsChartRef.current.getContext('2d');
        new Chart(respiratorySymptomsCtx, {
          type: 'radar',
          data: respiratorySymptomsChartData,
          options: {
            scales: {
              r: {
                beginAtZero: true,
                max: 8,
                stepSize: 1,
              },
            },
          },
        });
      }
    }
  }, [patients]);

  useEffect(() => {
    if (patients.length > 0) {
      const patientLabels = patients.map((patient) => patient.name);
      const airPollutionData = patients.map((patient) => patient.air_pollution);
      const dustExposureData = patients.map((patient) => patient.dust_exposure);
  
      const environmentalFactorsChartData = {
        labels: patientLabels,
        datasets: [
          {
            label: 'Air Pollution',
            data: airPollutionData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Dust Exposure',
            data: dustExposureData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      };
  
      if (environmentalFactorsChartRef.current && environmentalFactorsChartData) {
        const environmentalFactorsCtx = environmentalFactorsChartRef.current.getContext('2d');
        new Chart(environmentalFactorsCtx, {
          type: 'radar',
          data: environmentalFactorsChartData,
          options: {
            scales: {
              r: {
                beginAtZero: true,
                max: 8, // Adjust the max value as needed
                stepSize: 1, // Adjust the step size as needed
              },
            },
          },
        });
      }
    }
  }, [patients]);
  
  useEffect(() => {
    if (patients.length > 0) {
      const snoringData = patients.map((patient) => patient.snore);
      const snoringCount = snoringData.filter((snore) => snore === 1).length;
      const nonSnoringCount = snoringData.filter((snore) => snore !== 1).length;

      const snoringChartData = {
        labels: ['Snoring', 'Not Snoring'],
        datasets: [
          {
            label: 'Sleep Patterns',
            data: [snoringCount, nonSnoringCount],
            backgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      };

      if (snoringChartRef.current && snoringChartData) {
        const snoringCtx = snoringChartRef.current.getContext('2d');
        new Chart(snoringCtx, {
          type: 'bar',
          data: snoringChartData,
        });
      }

      
    }
  }, [patients]);

  useEffect(() => {
    if (patients.length > 0) {
      const adheringToDiet = patients.filter((patient) => patient.balanced_diet <= 3).length;
      const notAdheringToDiet = patients.length - adheringToDiet;
  
      const dietDonutData = {
        labels: ['Adhering to Diet', 'Not Adhering to Diet'],
        datasets: [
          {
            data: [adheringToDiet, notAdheringToDiet],
            backgroundColor: ['#36A2EB', '#FFCE56'],
          },
        ],
      };
  
      if (dietDonutChartRef.current && dietDonutData) {
        const dietDonutCtx = dietDonutChartRef.current.getContext('2d');
        
        new Chart(dietDonutCtx, {
          type: 'doughnut',
          data: dietDonutData,
          options: {
            cutout: '80%',
            // You can customize other options like tooltips, legend, etc.
          },
        });
      }
    }
  }, [patients]);
  

  useEffect(() => {
    if (patients.length > 0) {
      // Calculate chart data
      const lowRiskCount = patients.filter((patient) => patient.risk === 'Low').length;
      const mediumRiskCount = patients.filter((patient) => patient.risk === 'Medium').length;
      const highRiskCount = patients.filter((patient) => patient.risk === 'High').length;


      const ageData = patients.map((patient) => patient.age);
      const genderData = patients.map((patient) => patient.gender);


      // Create bins for age groups
      const ageGroups = Array.from({ length: 10 }, (_, i) => `${i * 10 + 1}-${(i + 1) * 10}`);


      const ageCounts = ageGroups.map((group) =>
        ageData.filter((age) => {
          const [start, end] = group.split('-').map(Number);
          return age >= start && age <= end;
        }).length
      );


      // Count the number of male and female patients
      const maleCount = genderData.filter((gender) => gender === 'Male').length;
      const femaleCount = genderData.filter((gender) => gender === 'Female').length;


      // Update risk chart data
      const riskChartData = {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [
          {
            label: 'Risk Assessment',
            data: [lowRiskCount, mediumRiskCount, highRiskCount],
            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
          },
        ],
      };


      // Create or update the risk chart
      if (canvasRef.current && riskChartData) {
        const riskCtx = canvasRef.current.getContext('2d');
        new Chart(riskCtx, {
          type: 'bar',
          data: riskChartData,
        });
      }


      // Create data for the age chart
      if (ageChartRef.current) {
        const ageCtx = ageChartRef.current.getContext('2d');
        const ageChartData = {
          labels: ageGroups,
          datasets: [
            {
              label: 'Age Distribution',
              data: ageCounts,
              backgroundColor: [
                '#F39D63',
                '#E5A56C',
                '#D7AE75',
                '#C9B77E',
                '#BBC087',
                '#ADB990',
                '#9FC299',
                '#91CAC2',
                '#83D2CB',
                '#BA6FC7',
              ],
            },
          ],
        };
        new Chart(ageCtx, {
          type: 'bar',
          data: ageChartData,
        });
      }


      // Update gender chart data
      const genderChartData = {
        labels: ['Male', 'Female'],
        datasets: [
          {
            label: 'Gender Distribution',
            data: [maleCount, femaleCount],
            backgroundColor: ['#36A2EB', '#FF6384'],
          },
        ]
      }


      if (genderChartRef.current) {
        const genderCtx = genderChartRef.current.getContext('2d');
        new Chart(genderCtx, {
          type: 'bar',
          data: genderChartData,
        });
      }
    }
  }, [patients]);


  return (
    <div>
      <h1>{user?.displayName}'s Dashboard</h1>

      <div>
        <h2>Key Metrics</h2>
        <table>
          <tbody>
            <tr>
              <td>Patients:</td>
              <td>{summary1.patientCount}</td>
            </tr>
            <tr>
              <td>Average Age:</td>
              <td>{summary1.averageAge}</td>
            </tr>
            <tr>
              <td>Air Pollution Exposure:</td>
              <td>{summary.airPollutionCount}</td>
            </tr>
            <tr>
              <td>Dust Exposure:</td>
              <td>{summary.dustExposureCount}</td>
            </tr>
            <tr>
              <td>Genetic Risks:</td>
              <td>{summary.geneticRiskCount}</td>
            </tr>
            <tr>
              <td>High Alcohol Consumption:</td>
              <td>{summary.alcoholConsumptionCount}</td>
            </tr>
            <tr>
              <td>Smokers:</td>
              <td>{summary.smokerCount}</td>
            </tr>
            <tr>
              <td>Unhealthy Diets:</td>
              <td>{summary.dietComplianceCount}</td>
            </tr>
            <tr>
              <td>Coughing Blood:</td>
              <td>{summary.coughingBloodCount}</td>
            </tr>
            <tr>
              <td>High Fatigue:</td>
              <td>{summary.fatigueCount}</td>
            </tr>
            <tr>
              <td>Wheezing:</td>
              <td>{summary.wheezingCount}</td>
            </tr>
            <tr>
              <td>Obese:</td>
              <td>{summary.obesityCount}</td>
            </tr>
            <tr>
              <td>Clubbing Nails:</td>
              <td>{summary.clubbingNailsCount}</td>
            </tr>
            <tr>
              <td>Snorer:</td>
              <td>{summary.snoringCount}</td>
            </tr>
          </tbody>
        </table>
      </div>



      <div>
        <h2>Risk Assessment</h2>
        <canvas ref={canvasRef} id="riskChart"></canvas>
      </div>


      <div>
        <h2>Age Distribution</h2>
        <canvas ref={ageChartRef} id="ageChart"></canvas>
      </div>


      <div>
        <h2>Gender Distribution</h2>
        <canvas ref={genderChartRef} id="genderChart"></canvas>
      </div>

      <div>
        <h2>Lifestyle Factors</h2>
        <canvas ref={lifestyleFactorsChartRef} id="lifestyleFactorsChart"></canvas>
      </div>

      <div>
        <h2>Respiratory Symptoms</h2>
        <canvas ref={respiratorySymptomsChartRef} id="respiratorySymptomsChart"></canvas>
      </div>

      <div>
        <h2>Environmental Factors</h2>
        <canvas ref={environmentalFactorsChartRef} id="environmentalFactorsChart"></canvas>
      </div>

      <div>
        <h2>Sleep Patterns</h2>
        <canvas ref={snoringChartRef} id="snoringChart"></canvas>
      </div>

      <div>
        <h2>Diet Compliance Donut Chart</h2>
        <canvas ref={dietDonutChartRef} id="dietDonutChart"></canvas>
      </div>


    </div>
  );
}


export default Dashboard;
