import Firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA-MiE18y7f2oKTxAJEpU44R5jm_kn_Xoo",
    authDomain: "healthai-23.firebaseapp.com",
    databaseURL: "https://healthai-23-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "healthai-23",
    storageBucket: "healthai-23.appspot.com",
    messagingSenderId: "560880281833",
    appId: "1:560880281833:web:0d23f0091d6962bf32e878",
    measurementId: "G-MY3C2QN6QC"
};

const firebase = Firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const auth = firebase.auth();

export {firebase, db, auth};