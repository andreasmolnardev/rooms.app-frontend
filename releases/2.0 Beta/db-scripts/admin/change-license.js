import { database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "../config.js"
import { checkUserAuthentication } from "../../admin/app.js";




function CheckLicense(licenseCodeVal, experingDateVal) {

  let activationKeys = ref(database, 'licenses/')

  return new Promise((resolve, reject) => {


    onValue(activationKeys, function (snapshot) {
      let licenseCodeObj = snapshot.val();

      if (licenseCodeObj[licenseCodeVal] == experingDateVal) {
        resolve({ [licenseCodeVal]: experingDateVal });
      } else {

        reject(false);
      }
    });



  });
}


let form = document.getElementById('change-license-form');
let licenseInput = document.getElementById('license-inputfield');
let dateInput = document.getElementById('expireing-date');
let overwriteCheckbox = document.getElementById('overwrite-checkbox');



form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (licenseInput.value && dateInput.value && overwriteCheckbox.checked == true) {
    //check format
    let seperatedLicense = licenseInput.value.split("-")
    let seperatedDate = dateInput.value.split("-")
    if (
      seperatedLicense.length == 2
      && seperatedLicense[0].length == 3
      && seperatedLicense[1].length == 3
      && seperatedDate.length == 2
      && seperatedDate[0].length == 2
      && seperatedDate[1].length == 2
      && seperatedDate[0] <= 12
      && typeof parseFloat(seperatedDate[0]) == "number"
      && typeof parseFloat(seperatedDate[1]) == "number"
    ) {

      let loadingEllipsis = document.getElementsByClassName('lds-ellipsis')[0]
      let checkIcon = document.getElementById('progress-check')
      let stateOutput = document.getElementById('state-output')
      
      document.getElementsByClassName('progress-bar')[0].style.display = "grid"


      CheckLicense(licenseInput.value, dateInput.value).then((newUserLicense) => {

        
        loadingEllipsis.style.display = "none"
        checkIcon.style.display = "flex"
        stateOutput.innerText = "Die Lizenz wurde erfolgreich geändert"

        checkUserAuthentication().then((user) => {

          update(ref(database, 'users/' + user.uid), {
            license: newUserLicense
          })



        }
        )




      }).catch((error) => {
        loadingEllipsis.style.display = "none"
        checkIcon.classList.remove('fa-check')
        checkIcon.classList.add('fa-xmark')
        checkIcon.style.display = "flex"
        stateOutput.innerText = "Die eingegebenen Daten sind ungültig"


        console.log(error)
      })
    } else {
      document.getElementById('error-output').innerText = "Bitte aller Felder mit gültigen Werten ausfüllen"


    }
  } else {

    const errorOutput = document.getElementById('error-output')
    errorOutput.style.color = "var(--surface-color-error)"  
    errorOutput.innerText = "Bitte aller Felder mit gültigen Werten ausfüllen"
    
    setTimeout(() => {
      errorOutput.innerText = ""
  }, 3000);
  }
})