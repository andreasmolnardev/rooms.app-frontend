import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../../db-scripts/config.js"



function CheckLicense() {
  return new Promise((resolve, reject) => {
    let licenseCode = document.getElementById('license-code').value;
    let experingDate = document.getElementById('expires-when').value;
    const activationKeys = ref(database, "activationKeys");

    onValue(activationKeys, function (snapshot) {
      let licenseCodeObj = snapshot.val();
      console.log(licenseCodeObj);
      if (licenseCodeObj[licenseCode] == experingDate) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}



let errorMessage = document.getElementById("error-message");
let successMessage = document.getElementById("success-message");
const signup = document.getElementById('signup');
signup.addEventListener('click', (e) => {
  let email = document.getElementById('sign-up-email').value;
  let password = document.getElementById('sign-up-password').value;
  let repeatedPassword = document.getElementById('repeat-password').value;
  let username = document.getElementById('sign-up-username').value;
  let output = document.getElementById('output-txt');
  let licenseCode = document.getElementById('license-code').value;
  let experingDate = document.getElementById('expires-when').value;

  if (licenseCode == "" || experingDate == "" || email == "") {

    PrepareErrorHandling(errorMessage);
    output.innerText = "Bitte füllen Sie alle Felder aus";
  } else if (repeatedPassword == password) {
    CheckLicense()
      .then((isValid) => {
        if (isValid) {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Angemeldet
              const user = userCredential.user;

              successMessage.style.display = "flex";

              set(ref(database, 'users/' + user.uid), {
                username: username,
                email: email,
                last_login: dt,
                initial_startup: true,
                rooms: [],
                signatures: [],
                roomOccupations: []
              })

              location.replace("/app")
              // ...
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorDialog = error.message;
              errorMessage.style.display = "flex";
              let output = document.getElementById('output-txt');
              if (email == "" || password == "") {
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
                }
              }
              console.log(errorDialog)
            });
        }
        else {
          output.innerText = "Die Eingegebene Lizenz ist ungültig";

        }
      });

  } else {
    PrepareErrorHandling(errorMessage);
    output.innerText = "Die eingegebenen Passwörter stimmen nicht überein";
  }



})
CheckLogin();