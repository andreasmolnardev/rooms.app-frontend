//used at the signup page

import { validation, requiredBools } from "../db-scripts/auth/sign-up.js";

let tabs = document.getElementsByClassName('tab');
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