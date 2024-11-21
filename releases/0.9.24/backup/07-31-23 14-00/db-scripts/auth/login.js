import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../config.js"
import { onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
  });
  

const login = document.getElementById('login');
  login.addEventListener('click', (e) => {
    let email = document.getElementById('username-input').value;
    let password = document.getElementById('pw-input').value;
    let errorMessage = document.getElementById("error-message");
    let successMessage = document.getElementById("success-message");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorDialog = error.message;
        errorMessage.style.display = "flex";
        let output = document.getElementById('output-txt');
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
  });
  CheckLogin();