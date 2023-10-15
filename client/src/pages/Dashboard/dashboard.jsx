import React, { useEffect, useState, useRef } from 'react';
import { useAuthentication } from '../../Components/authObserver';
import { db } from '../../firebase';
import Chart from 'chart.js/auto';


const Dashboard = () => {
const { user } = useAuthentication();
const [patients, setPatients] = useState([]);
const canvasRef = useRef(null);
const ageChartRef = useRef(null);
const genderChartRef = useRef(null);


const [summary, setSummary] = useState({
patientCount: 0,
averageAge: 0,
mostCommonCondition: '',
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
// Convert the 'age' property to an integer
patient.age = parseInt(patient.age, 10);
if (!isNaN(patient.age)) { // Check if age is a valid number
patientData.push(patient);
}
});
setPatients(patientData);


// Calculate key metrics
const patientCount = patientData.length;
const totalAge = patientData.reduce((sum, patient) => sum + patient.age, 0);
console.log(totalAge);
console.log(patientCount);
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


setSummary({
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
const maleCount = genderData.filter((gender) => gender === 'male').length;
const femaleCount = genderData.filter((gender) => gender === 'female').length;


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
<p>Number of Patients: {summary.patientCount}</p>
<p>Average Age: {summary.averageAge}</p>
<p>Most Common Health Condition: {summary.mostCommonCondition}</p>
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


<h2>Patients</h2>
<div className="patient-cards">
{patients.map((patient, index) => (
<div key={index} className="patient-card">
<h3>{patient.name}</h3>
<p>Age: {patient.age}</p>
<p>Gender: {patient.gender}</p>
<p>Risk: {patient.risk}</p><br/>
</div>
))}
</div>


</div>
);
}


export default Dashboard;
