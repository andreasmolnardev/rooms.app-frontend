import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"
import { get, getDatabase, set, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyDYry51qtWadnR9NOqkUNp0CmMoj_L_uvk",

    authDomain: "andreasmolnardev-rooms-app.firebaseapp.com",

    projectId: "andreasmolnardev-rooms-app",

    storageBucket: "andreasmolnardev-rooms-app.appspot.com",

    messagingSenderId: "602848084168",

    appId: "1:602848084168:web:1feff19d8826e9bf8325fd",

    measurementId: "G-NRYGVM6F0G",

databaseURL: " https://andreasmolnardev-rooms-app-default-rtdb.europe-west1.firebasedatabase.app"

  };



const dt = new Date();

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();


onAuthStateChanged(auth, (user) => {
  if (user) {
    // Der Benutzer ist angemeldet

    const uid = user.uid;

  } else {
    // Der Benutzer ist nicht angemeldet
    // ...
    CheckLogin();
    // Überprüfen Sie den Anmeldestatus, wenn der Benutzer nicht angemeldet ist
  }
});

export function CheckLogin() {

  const user = auth.currentUser;
  if (user) {
    // Der Benutzer ist angemeldet
    const uid = user.uid;

    console.log(user)
    location.replace("/app");
    return true;
  } else {

    // Der Benutzer ist nicht angemeldet
    // ...
    return false;
  }
}

export function PrepareErrorHandling(errorMessage) {
    errorMessage.style.display = "flex";
    let output = document.getElementById('output-txt');
  }

  export {app, get, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification}