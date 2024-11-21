import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "../../db-scripts/config.js"
import { validateEmail } from "/ui-scripts/validate-email.js"
import { getUsers } from "/db-scripts/auth/get-email.js";
//three sections 




let emailInput = document.getElementById('sign-up-email');
let emailInputIcon = document.getElementById('check-sign-up-email-icon');
let validation = {
  email: false,
  username: false,
  name: false,
  strong_password: false,
  right_password: false,
  license: false,
  exp_date: false
}


emailInput.addEventListener('keyup', () => {

  if (validateEmail(emailInput.value) == true) {
    validation.email = true;

    emailInputIcon.classList.remove('fa-xmark')
    emailInputIcon.classList.add('fa-check')

  } else {
    validation.email = false;
    emailInputIcon.classList.remove('fa-check')
    emailInputIcon.classList.add('fa-xmark')

  }
})

let usernameInput = document.getElementById('sign-up-username')
let usernameInputIcon = document.getElementById('check-username-icon')




usernameInput.addEventListener('keyup', () => {



  getUsers().then((users) => {


    let usernameInUse = Object.values(users).find(object => object.username === usernameInput.value)
    if (usernameInput.value.length > 5 && !usernameInUse) {
      usernameInputIcon.classList.add("fa-check")
      usernameInputIcon.classList.remove("fa-xmark")
      validation.username = true;
    } else if (usernameInUse) {
      usernameInputIcon.classList.add("fa-xmark")
      usernameInputIcon.classList.remove("fa-check")
      validation.username = false;

    }

  })



})



let password = document.getElementById('sign-up-password');
let passwordIcon = document.getElementById('check-password-strenght-icon');

password.addEventListener('keyup', () => {
  if (password.value.length >= 8) {
    passwordIcon.classList.remove("fa-xmark");
    passwordIcon.classList.add("fa-check");
    validation.strong_password = true;
  } else {
    passwordIcon.classList.add("fa-xmark");
    passwordIcon.classList.remove("fa-check")
    validation.strong_password = false;
  }

})


let repeatedPassword = document.getElementById('repeat-password');
let repeatPasswordIcon = document.getElementById('repeat-password-icon');

repeatedPassword.addEventListener('keyup', () => {

  if (repeatedPassword.value == password.value) {
    repeatPasswordIcon.classList.add("fa-check");
    repeatPasswordIcon.classList.remove("fa-xmark");
    validation.right_password = true;

  } else {
    repeatPasswordIcon.classList.add("fa-xmark");
    repeatPasswordIcon.classList.remove("fa-check")
    validation.right_password = false;
  }

})

let licenseRadioDiv = document.getElementsByClassName('license-radio-div')[0];
let licenseYesRadio = document.getElementById('license-yes')

let licenseInput = document.getElementsByClassName('license'); // Input field for licenses

let requiredBools = {
  1: 4,
  2: 4
}

let license = false;

licenseRadioDiv.addEventListener('change', () => {

  if (licenseYesRadio.checked == true) {
    for (let child of licenseInput) {
      child.classList.remove('inactive');
      requiredBools[2] = 6;
      license = true;
    }
  } else {
    for (let child of licenseInput) {
      child.classList.add('inactive');
      requiredBools[2] = 4;
      license = false;
    }
  }

});



let licenseCode = document.getElementById('license-code');
let licenseExpDate = document.getElementById('expires-when');

licenseCode.addEventListener('keyup', () => {
  if (licenseCode.value) {
    validation.license = true;
  } else {
    validate.license = false;
  }
})

licenseExpDate.addEventListener('keyup', () => {
  if (licenseExpDate) {
    validation.exp_date = true;
  } else {
    validation.exp_date = false;
  }
})

export { validation, requiredBools };





function CheckLicense() {
  return new Promise((resolve, reject) => {

    let licenseCodeVal = document.getElementById('license-code').value;
    let experingDateVal = document.getElementById('expires-when').value;
    const activationKeys = ref(database, "activationKeys");

    if (license == true) {
      onValue(activationKeys, function (snapshot) {
        let licenseCodeObj = snapshot.val();
        //console.log(licenseCodeObj); Auskommentiert, da sonst die LicenseKeys dem Nutzer zur Verfügung gestellt werden
        if (licenseCodeObj[licenseCodeVal] == experingDateVal) {
          resolve({ licenseCodeVal: experingDateVal });
        } else {
          resolve(false);
        }
      });
    } else {
      resolve(false);
    }


  });
}


let errorMessage = document.getElementById("error-message");
let successMessage = document.getElementById("success-message");
const signup = document.getElementById('signup');

let nameInput = document.getElementById('sign-up-name')

nameInput.addEventListener('keyup', () => {
  validate.name = true
})

signup.addEventListener('click', (e) => {

  let username = document.getElementById('sign-up-username').value;
  let output = document.getElementById('output-txt');

  let termsOfService = document.getElementById('terms-of-service-checkbox')

  if (termsOfService.checked == false) {
    alert('um sich registrieren zu können, müssen sie die Nutzungsbedingungen akzeptieren')
    PrepareErrorHandling(errorMessage);
  } else {
    CheckLicense()
      .then((isValid) => {

        createUserWithEmailAndPassword(auth, emailInput.value, password.value)
          .then((userCredential) => {
            // Angemeldet
            const user = userCredential.user;

            successMessage.style.display = "flex";

            set(ref(database, 'users/' + user.uid), {
              username: username,
              name: nameInput.value,
              email: emailInput.value,
              last_login: dt,
              initial_startup: true,
              groups: [],
              license: isValid
            })

            sendEmailVerification(auth.currentUser).then(() => {
              if (isValid == false && license == true) {

              } else {
                document.getElementById('success-message').style.display = "flex"

              }
            }).catch((error) => {
              console.log(error)
            })



          })
          .catch((error) => {
            alert(error.message)
            const errorCode = error.code;
            const errorDialog = error.message;
            errorMessage.style.display = "flex";
            let output = document.getElementById('output-txt');

            switch (errorDialog) {
              case "Firebase: Error (auth/invalid-email).":
                output.innerText = "Die eingegebene E-Mail-Adresse ist ungültig";
                break;
              case "Firebase: Error (auth/email-already-in-use).":
                output.innerText = "Es wurde ein Nutzerkonto passend zur angegebenen E-Mail-Adresse gefunden";
             
              break;
            }
            console.log(errorDialog)
          });




      }

      )

  }



})
CheckLogin();