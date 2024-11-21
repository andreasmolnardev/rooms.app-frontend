import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js"
import { getDatabase, set, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {

  apiKey: "AIzaSyCxNLjKyPtHowcWjou7klWIcYVCUUG2JKg",

  authDomain: "firebasics-d7bac.firebaseapp.com",

  databaseURL: "https://firebasics-d7bac-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "firebasics-d7bac",

  storageBucket: "firebasics-d7bac.appspot.com",

  messagingSenderId: "185680528394",

  appId: "1:185680528394:web:11d346a1869e15d3424bf3",

  measurementId: "G-QXNMNY598E"

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

  export {app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut}