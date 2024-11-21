import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../config.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getUsers, getEmailByUsername } from "./get-email.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Der Benutzer ist angemeldet

    const uid = user.uid;
    location.replace('/app')
  } else {
    // Der Benutzer ist nicht angemeldet
    // ...
    CheckLogin();
    // Überprüfen Sie den Anmeldestatus, wenn der Benutzer nicht angemeldet ist
  }
})






const login = document.getElementById('login');

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {

  e.preventDefault();
  let emailInputVal = document.getElementById('username-input').value;
  let email;

  let password = document.getElementById('pw-input').value;
  let errorMessage = document.getElementById("error-message");
  let successMessage = document.getElementById("success-message");


  let output = document.getElementById('output-txt');
     

  if (emailInputVal.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
    email = emailInputVal;


    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Angemeldet
      const user = userCredential.user;
  
      update(ref(database, 'users/' + user.uid), {
        last_login: dt,
        initial_startup: false
      })
  
  
      successMessage.style.display = "flex";
      localStorage.setItem('RoomOrganizerUser', [user.uid,]);
      CheckLogin();
      location.replace("/app");
    }).catch((error) => {
      const errorCode = error.code;
      const errorDialog = error.message;
      errorMessage.style.display = "flex";
     if (email == "" || password == "") {
        output.innerText = "Bitte füllen Sie alle Felder aus";
      }
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
      }
      console.log(errorDialog)
    });

  } else {
  getEmailByUsername(emailInputVal).then((username) =>{


    signInWithEmailAndPassword(auth, username, password).then((userCredential) => {
      // Angemeldet
      const user = userCredential.user;
  
      update(ref(database, 'users/' + user.uid), {
        last_login: dt,
        initial_startup: false
      })
  
  
      successMessage.style.display = "flex";
      localStorage.setItem('RoomOrganizerUser', [user.uid,]);
      CheckLogin();
      location.replace("/app");
    }).catch((error) => {
      const errorCode = error.code;
      const errorDialog = error.message;
      errorMessage.style.display = "flex";
      if (email == "" || password == "") {
        output.innerText = "Bitte füllen Sie alle Felder aus";
      }
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
      }
      console.log(errorDialog)
    });



  }).catch((error) => {
      errorMessage.style.display = "flex";
      output.innerText = "Der Beutzername ist nicht vorhanden"   
  
  })


  };

  
});


CheckLogin();