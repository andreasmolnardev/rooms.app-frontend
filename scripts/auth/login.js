import { root_prefix } from "../../components/root.js";
import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";
import { pingAPIforInternalServerError } from "../api/api-entry.js";
import { savePublicIpV4 } from "../public-ip/get-public-ipv4.js";

if (!root_prefix) {
    localStorage.setItem("root", window.location.href)
}

const apiAuthTokenId = localStorage.getItem('api-authtoken')

pingAPIforInternalServerError(() => {
    if (apiAuthTokenId) {
        location.replace("./app");
    }
});

savePublicIpV4().then(ip => {
    console.info("public IP v4: " + ip + " saved")
});

let apiRoot = localStorage.getItem("apiRoot") 

if(!apiRoot){
    apiRoot = "urban-space-barnacle-v56xj9q7vp7cw95v-3000.app.github.dev"
    localStorage.setItem("apiRoot", apiRoot)
}

console.log(apiRoot)

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (e) => {

    e.preventDefault();
    const timestamp = new Date();

    let email_usernameInputVal = document.getElementById('username-input').value;
    let password = document.getElementById('pw-input').value;

    let loginFormData;
    const publicIpV4 = localStorage.getItem("public-ipv4")


    if (email_usernameInputVal.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) {
        loginFormData = { email: email_usernameInputVal, password: password, timestamp: timestamp, ip: publicIpV4 }
    } else if (email_usernameInputVal != "") {
        loginFormData = { username: email_usernameInputVal, password: password, timestamp: timestamp, ip: publicIpV4 }
    }


    fetch('https://' + apiRoot + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginFormData)
    }).then(response => {

        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => {
                throw new Error(err.error || 'Login failed');
            });
        }
       
    }).then(result => {
        let authTokenId = result.authTokenId;

        if (authTokenId) {
            localStorage.setItem('api-authtoken', authTokenId)

            showNotificationByTemplate("Erfolgreich eingeloggt! Sie werden in Kürze weitergeleitet", "success")
            //redirect to app
            location.replace("./app");
        } else {       
        showNotificationByTemplate("Unbekannter Fehler bei der Anmeldung", "error")
    }

     
    }).catch(error => {
        console.error('Error:', error);
        showNotificationByTemplate(error, "error")
    });

});


let resetPasswordLink = document.getElementById("reset-password");

resetPasswordLink.addEventListener('click', () => {



})
