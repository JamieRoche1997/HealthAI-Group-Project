import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';

const PatientDetail = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);

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

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{patient.name}'s Details</h1>
            <p>Name: {patient.name}</p>
            <p>Age: {patient.age}</p>
            <p>Gender: {patient.gender}</p>
            <p>Risk: {patient.risk}</p><br />
        </div>
    );
};

export default PatientDetail;
