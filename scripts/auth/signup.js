

let emailInput = document.getElementById('sign-up-email');
let emailInputIcon = document.getElementById('check-sign-up-email-icon');
let validation = {
  name: false, 
  company: false, 
  email: false,
  username: false,
  strong_password: false,
  right_password: false,
  license: false,
  exp_date: false
}

// check whether the email is in a valid format

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


//check whether the username is available

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

requiredBools = {
  1: 5,
  2: 5
}


export { validation, requiredBools };


let errorMessage = document.getElementById("error-message");
let successMessage = document.getElementById("success-message");
const signup = document.getElementById('signup');

let nameInput = document.getElementById('sign-up-name')

nameInput.addEventListener('keyup', () => {
  validation.name = true
})

let tabIndicators = document.getElementsByClassName('tab-indicator');
const increaseTabIndexBtn = document.getElementsByClassName('increase-tab-index');
let tabIndex = 1;

function refreshPartialTabView() {
    for (let i = 0; i < tabs.length; i++) {

        if (tabIndex == tabs[i].dataset.tabIndex) {
            tabs[i].classList.add('active');
            tabIndicators[i].classList.add('active');
        } else {
            tabs[i].classList.remove('active');
            tabIndicators[i].classList.remove('active');
        }

    }

}
  
   
    

function validatePageInput() {
    let trueBoolCounter = 0;

    console.log(validation)
    

    Object.values(validation).forEach(bool => {
        if (bool == true) {
            trueBoolCounter ++;
        }
    });

    if (trueBoolCounter == requiredBools[tabIndex]) {
        tabIndex++;
        refreshPartialTabView();
    } else {
        alert('Bitte alle Felder ausfüllen')
    }

}




[...document.querySelectorAll('.increase-tab-index')].forEach(function (item) {
    item.addEventListener('click', function () {

        
        validatePageInput();

    });
});

[...document.querySelectorAll('.decrease-tab-index')].forEach(function (item) {
    item.addEventListener('click', function () {
        tabIndex--;
        refreshPartialTabView();

    });
});

document.getElementById('sign-up-form').addEventListener('submit', (e) => { e.preventDefault(); })