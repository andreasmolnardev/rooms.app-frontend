//import { SwitchDesignPreference, ThemeGetter, ThemeSetter } from "../ui-scripts/darkmode.js";
//import { DateToOutput } from "../ui-scripts/dates.js";
//import { AccentClGetter, AccentClSetter } from "../ui-scripts/accent-cl.js";
//import { ExpandSetting } from "../ui-scripts/expand-setting.js";
//import { showPage } from "../ui-scripts/page-loading.js";
//import { showNotification, showNotificationByTemplate } from "../ui-scripts/notifications/notifications.js"
//import { filterScheduleByRoom, resetFilter } from "../ui-scripts/filter-schedule.js";
//import { components } from "../components/components.js";
import { initiateWsInitConnection } from "../scripts/api/websocket-connection.js";
import { savePublicIpV4 } from "../scripts/public-ip/get-public-ipv4.js";

sessionStorage.setItem("session", "app");

const timestamp = new Date();
let authTokenId = localStorage.getItem('api-authtoken')

const apiRoot = localStorage.getItem("apiRoot") ?? "urban-space-barnacle-v56xj9q7vp7cw95v-3000.app.github.dev"

if (!authTokenId) {
    window.location.replace("../")
} else {
    savePublicIpV4().then(ip => {

        fetch('https://' + apiRoot + '/start-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ timestamp: timestamp, authTokenId: authTokenId, ip: ip })
        }).then(response => response.json()).then(result => {
            console.log(result)
            if (result.error == "neuer Login erforderlich") {
                localStorage.removeItem("api-authtoken")
                alert(result.error)
                window.location.replace("../")
            } else if (result.sessionTokenId) {
                //session initiated
                initiateWsInitConnection("start-session", result.sessionTokenId, ip, apiRoot)
            }
        }).catch(error => {
            console.log('Error:', error); alert(error)
            showNotificationByTemplate(error, "error")
        });

    });
}
//The old code has been moved to /more/archive/app/min-app-onlyfrontend.js in order to optimize loading speeds