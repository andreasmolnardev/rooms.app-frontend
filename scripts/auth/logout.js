import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";

export function logOut() {

    showNotificationByTemplate("Sie werden in Kürze ausgeloggt", "info")

    let apiRoot = localStorage.getItem("apiRoot")

    if (!apiRoot) {
        apiRoot = "rooms-app-api.prairiedog-stargazer.ts.net"
        localStorage.setItem("apiRoot", apiRoot)
        location.reload();
    }

    const sessionToken = sessionStorage.getItem("sessionToken")
    console.log(sessionToken)

    fetch('https://' + apiRoot + '/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({sessionToken})
    }).then(response => {

        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(err => {
                throw new Error(err.error || 'Login failed');
            });
        }

    }).then(() => {

        localStorage.removeItem('api-authtoken')

        showNotificationByTemplate("Erfolgreich ausgeloggt! Sie werden in Kürze weitergeleitet", "success")
        //redirect to app
        location.replace("../");

    }).catch(error => {
        showNotificationByTemplate("Unbekannter Fehler beim Logout", "error")
        console.error(error)
    })
}
