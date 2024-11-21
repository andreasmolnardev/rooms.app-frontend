import { displayGroupInNavigation } from "../../admin/groups/display-group.js";
import { addInvitationToModal } from "../../admin/modals/show-invitations-modal.js";
import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";
import { showPage } from "../../ui-scripts/page-loading.js";
import { setFrontendInfo } from "../../ui-scripts/set-info.js";

let appWs;
let adminWs;

export function initiateWsInitConnection(data, sessionTokenId, ip, apiRoot) {
    appWs = new WebSocket('wss://' + apiRoot + '/ws/' + data);

    //open the connection

    appWs.onopen = function () {
        console.log('WebSocket connection opened');
        appWs.send(JSON.stringify({ type: "connect-request", clientIp: ip, sessionTokenId: sessionTokenId }));
    };

    appWs.onmessage = function (event) {
        console.log('Message received from server:', event.data);

        const returnedData = JSON.parse(event.data);

        if (returnedData.type == "account-info") {
            // fill out account details
            const accountInfo = returnedData.data;

            console.log(accountInfo)

            setFrontendInfo("username-output", accountInfo.username)
            setFrontendInfo("name-output", accountInfo.name)
            setFrontendInfo("email-output", accountInfo.email)

            showPage("app");

        } else if (returnedData.type == "app-info") {
            // fill out app details
        } else if (returnedData.type == "room-schedule") {
            const roomSchedule = returnedData.data;
        } else if (returnedData.type == "invitations") {

        }
    };
}

export function initiateWsAdminConnection(data, sessionTokenId, ip, apiRoot) {
    adminWs = new WebSocket('wss://' + apiRoot + '/ws/' + data);

    //open the connection

    adminWs.onopen = function () {
        console.log('WebSocket connection opened');
        adminWs.send(JSON.stringify({ type: "connect-request", clientIp: ip, sessionTokenId: sessionTokenId }));
    };

    adminWs.onmessage = function (event) {

        const returnedData = JSON.parse(event.data);

        let groupIndex = 0;

        if (returnedData.type == "account-info") {
            const groups = returnedData.data.groups;

            for (let index = 0; index < Object.keys(groups).length; index++) {
                const groupId = Object.keys(groups)[index];
                adminWs.send(JSON.stringify({type: "get-group-data-request", groupId: groupId, sessionTokenId: sessionTokenId}))
            }

            const ignoreAdminTutorialModalPreference = returnedData.data.preferences.ignoreAdminTutorialModal;

            if (!ignoreAdminTutorialModalPreference) {
                // display the modal 
            }

            showPage("admin");
        } else if (returnedData.type == "group-admin-status" && returnedData.data){
            const group = returnedData.data

            if(returnedData.statuscode == "401"){
                displayGroupInNavigation(false, group, groupIndex)
            } else if (returnedData.statuscode == 200){
                displayGroupInNavigation(true, group, groupIndex )
            }

            groupIndex++;

        } else if (returnedData.type == "invitation-data"){
            addInvitationToModal(returnedData.data, JSON.parse(sessionStorage.getItem("groups"))[returnedData.groupID_frontend]['invitations'][returnedData.data.invitationId].active)
        } else if (returnedData.type == "created-invitation-data"){
            const invitationData = returnedData.data;

            document.body.dispatchEvent(new CustomEvent("invitation-created", { detail: invitationData }))
        } else if (returnedData.type == "user-group-creation-status" && !returnedData.error){
            showNotificationByTemplate("Nutzergruppe wurde erstellt", "info")
            window.location.reload();
        }



    };
}

export function sendAdminWsMessage(msg){
    if (adminWs && adminWs.readyState == WebSocket.OPEN) {
        try {
            adminWs.send(JSON.stringify(msg));
        } catch (error) {
            console.error('Error sending message to admin WebSocket:', error);
        }
    }
}