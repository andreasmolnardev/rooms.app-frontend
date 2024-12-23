import { displayGroup, displayGroupSchedule } from "../../../app/groups/display-group.js";
import { showPage } from "../../../ui-scripts/page-loading.js";
import { setFrontendInfo } from "../../../ui-scripts/set-info.js";



let appWs;


export function initiateWsInitConnection(data, sessionTokenId, ip, apiRoot) {
    appWs = new WebSocket('wss://' + apiRoot + '/ws/' + data);

    //open the connection

    appWs.onopen = function () {
        appWs.send(JSON.stringify({ type: "connect-request", clientIp: ip, sessionTokenId: sessionTokenId }));
    };

    appWs.onmessage = function (event) {

        const returnedData = JSON.parse(event.data);

        if (returnedData.type == "account-info") {
            // fill out account details
            const accountInfo = returnedData.data;

            window.groups = [];

            setFrontendInfo("username-output", accountInfo.username)
            setFrontendInfo("name-output", accountInfo.name)
            setFrontendInfo("email-output", accountInfo.email)

            showPage("app");

            Object.keys(accountInfo.groups).forEach(groupId => {
                window.groups[groupId] = accountInfo.groups[groupId]
                appWs.send(JSON.stringify({ type: "group-data-request", data: { groupId: groupId, userGroup: accountInfo.groups[groupId]["user-group"] } }))
            });

            const dateInput = document.getElementById("date")
            let date = new Date();
            const today = date.toISOString().substring(0, 10);
            dateInput.value = today;

            window.dateInput = dateInput;

        } else if (returnedData.type == "app-info") {
            // fill out app details
        } else if (returnedData.type == "group-data-response" && !returnedData.error) {
            displayGroup(returnedData.groupId, returnedData.data)

        } else if (returnedData.type == "group-data-response" && returnedData.error) {

        } else if (returnedData.type == "room-schedule-response") {
            const roomSchedule = returnedData.data;

            console.log(roomSchedule)

            if (roomSchedule) {
                //display room schedule

                displayGroupSchedule(roomSchedule)

            } else {
               
                document.querySelector("#rooms-div .initial.center p").textContent = "Für das eingegebene Datum wurden noch keine Raumbesetzungen gespeichert"
               
                const rooms = document.querySelectorAll('#rooms-div .room');
               
                for (let index = 0; index < rooms.length; index++) {
                    const element = rooms[index];
                    element.style.display = "none";
                }

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
    console.log("sending msg " + msg)

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
