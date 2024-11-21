import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";

const apiURL = 'https://' + localStorage.getItem('apiRoot') ?? 'https://urban-space-barnacle-v56xj9q7vp7cw95v-3000.app.github.dev';


export function pingAPIforInternalServerError(callback) {
    fetch(apiURL).then(success => {
        console.log("server available")
        callback();
    }).catch(error => {
        console.log("Error details should have been logged here:", error);
        showNotificationByTemplate("Die Server sind zur Zeit nicht erreichbar", "error")
    });
}


export { apiURL };
