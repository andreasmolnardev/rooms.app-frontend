import { displayGroup, displayGroupSchedule } from "../../../app/groups/display-group.js";
import { showChangelogModal } from "../../../app/modals/changelog.js";
import { showNotificationByTemplate } from "../../../ui-scripts/notifications/notifications.js";
import { showPage } from "../../../ui-scripts/page-loading.js";
import { setFrontendInfo } from "../../../ui-scripts/set-info.js";



let appWs;


export function initiateWsInitConnection(data, sessionTokenId, ip, apiRoot) {
    appWs = new WebSocket('wss://' + apiRoot + '/ws/' + data);

    //open the connection

    appWs.onopen = function () {
        appWs.send(JSON.stringify({ type: "connect-request", clientIp: ip, sessionTokenId: sessionTokenId }));
    };

    appWs.onclose = function () {
        showNotificationByTemplate("Verbindung verloren", "fa-wifi-exclamation")
    }

    appWs.onmessage = function (event) {

        const returnedData = JSON.parse(event.data);

        if (returnedData.type == "account-info") {
            // fill out account details
            const appInfo = returnedData.appInfo;
            const accountInfo = returnedData.data;

            if (!accountInfo["latestDashboardVersionTag"] || 
                appInfo.version.indexOf(appInfo.version.find(item => item.tag == accountInfo["latestDashboardVersionTag"])) 
                != appInfo.version.length - 1) {
                showChangelogModal(appInfo.version[appInfo.version.length - 1])
            } 

            window.groups = [];

            setFrontendInfo("username-output", accountInfo.username)
            setFrontendInfo("name-output", accountInfo.name)
            setFrontendInfo("email-output", accountInfo.email)

            showPage("app");

            Object.keys(accountInfo.groups).forEach(groupId => {
                const groupId_frontend = crypto.randomUUID()
                window.groups[groupId_frontend] = accountInfo.groups[groupId]
                appWs.send(JSON.stringify({ type: "group-data-request", data: { groupId: groupId, userGroup: accountInfo.groups[groupId]["user-group"], groupId_frontend } }))
                console.log("msg sent")
            });

            const dateInput = document.getElementById("date")
            let date = new Date();
            const today = date.toISOString().substring(0, 10);
            dateInput.value = today;

            window.dateInput = dateInput;

        } else if (returnedData.type == "group-data-response" && !returnedData.error) {
            displayGroup(returnedData.groupId_frontend, returnedData.data)
        } else if (returnedData.type == "group-data-response" && returnedData.error) {
            console.error(returnedData.error)
        } else if (returnedData.type == "room-schedule-response") {
            const roomSchedule = returnedData.data;

            if (roomSchedule) {
                //display room schedule

                displayGroupSchedule(roomSchedule)

            } else {
                document.querySelectorAll('#rooms-div .room').forEach(element => element.classList.add('hidden'));
                document.querySelector("#rooms-div .initial.center p").textContent = "Für das eingegebene Datum wurden noch keine Raumbesetzungen gespeichert"
                document.querySelector("#rooms-div section.initial").style.display = "flex";

            }
        } else if (returnedData.type == "room-occupation-registered") {
            //close add room occupations modal
            // if date equals dateInput.value, add it.
            console.log(returnedData)
        }
    };
}



export function sendWsClientMessage(msg) {
    const sessionTokenId = sessionStorage.getItem("sessionToken");

    if (appWs && appWs.readyState == WebSocket.OPEN && sessionTokenId) {
        msg.sessionTokenId = sessionTokenId;

        try {
            appWs.send(JSON.stringify(msg));
        } catch (error) {
            console.error('Error sending message to admin WebSocket:', error);
        }
    }
}
