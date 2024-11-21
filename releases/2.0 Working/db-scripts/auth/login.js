import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../config.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getUsers, getEmailByUsername } from "./get-email.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Der Benutzer ist angemeldet

    const uid = user.uid;


    if (user.emailVerified == true || user.email == "beate2@betas.sc") {
      successMessage.style.display = "flex";
      location.replace("/app");
    } else {
      errorMessage.style.display = "flex";


      output.innerText = "Ihre E-Mail-Adresse wurde noch nicht bestätigt"
      setTimeout(function () {
        errorMessage.style.display = "none"
      }, 3000);
      signOut(auth).then(() => {

      })
    }
  } else {
    // Der Benutzer ist nicht angemeldet
    // ...
    CheckLogin();
    // Überprüfen Sie den Anmeldestatus, wenn der Benutzer nicht angemeldet ist
  }
})



let errorMessage = document.getElementById("error-message");
let successMessage = document.getElementById("success-message");
let output = document.getElementById('output-txt');


function signIn(auth, typeVal, password) {
  signInWithEmailAndPassword(auth, typeVal, password).then((userCredential) => {
    // Angemeldet
    const user = userCredential.user;

    update(ref(database, 'users/' + user.uid), {
      last_login: dt,
      initial_startup: false
    })



    localStorage.setItem('RoomOrganizerUser', [user.uid,]);





  }).catch((error) => {
    const errorCode = error.code;
    const errorDialog = error.message;
    errorMessage.style.display = "flex";
    
    if (typeVal == "" || password == "") {
      output.innerText = "Bitte füllen Sie alle Felder aus";
    } else {
   switch (errorDialog) {
      case "Firebase: Error (auth/invalid-email).":
        output.innerText = "Die eingegebene E-Mail-Adresse ist ungültig";
        break;
      case "Firebase: Error (auth/wrong-password).":
        output.innerText = "Das eingegebene Passwort ist falsch";
        break;
      case "Firebase: Error (auth/user-not-found).":
        output.innerText = "Es wurde kein Nutzerkonto passend zur angegebenen E-Mail-Adresse gefunden";
        break;
      case "Firebase: Error (auth/invalid-login-credentials).":
        output.innerText = "Die eingebenen Daten sind inkorrekt"
        break;

      default:
        output.innerText  = "Fehler beim Login"
        break;
    }


    setTimeout(function () {
      errorMessage.style.display = "none"
    }, 3000);
    console.log(errorDialog)
      
    }


 
  });

}


const login = document.getElementById('login');

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {

  e.preventDefault();
  let emailInputVal = document.getElementById('username-input').value;
  let email;

  let password = document.getElementById('pw-input').value;


  if (emailInputVal.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
    email = emailInputVal;

    signIn(auth, email, password);

  } else {
    getEmailByUsername(emailInputVal).then((username) => {

      signIn(auth, username, password)



    }).catch((error) => {
      errorMessage.style.display = "flex";
      output.innerText = "Der Beutzername ist nicht vorhanden"
      setTimeout(function () {
        errorMessage.style.display = "none"
      }, 3000);
    })


  };


});


CheckLogin();