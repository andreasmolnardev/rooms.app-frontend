import { addRoomToDOM, displayGroupInNavigation } from "../../admin/groups/display-group.js";
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

            Object.keys(accountInfo.groups).forEach(groupId => {
                appWs.send(JSON.stringify({ type: "group-data-request", data: {groupId: groupId}}))
            });

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
                adminWs.send(JSON.stringify({ type: "get-group-data-request", groupId: groupId, sessionTokenId: sessionTokenId }))
            }

            const ignoreAdminTutorialModalPreference = returnedData.data.preferences.ignoreAdminTutorialModal;

            if (!ignoreAdminTutorialModalPreference) {
                // display the modal 
            }

            showPage("admin");
        } else if (returnedData.type == "group-admin-status" && returnedData.data) {
            const group = returnedData.data

            if (returnedData.statuscode == "401") {
                displayGroupInNavigation(false, group, groupIndex)
            } else if (returnedData.statuscode == 200) {
                displayGroupInNavigation(true, group, groupIndex)
            }

            groupIndex++;

        } else if (returnedData.type == "invitation-data") {
            console.log(returnedData)
            addInvitationToModal(returnedData.data, returnedData.data.active)
        } else if (returnedData.type == "created-invitation-data") {
            const invitationData = returnedData.data;

            document.body.dispatchEvent(new CustomEvent("invitation-created", { detail: invitationData }))
        } else if (returnedData.type == "user-group-creation-status" && !returnedData.error) {
            showNotificationByTemplate("Nutzergruppe wurde erstellt", "info")
            window.location.reload();
        } else if (returnedData.type == "room-creation-status" && !returnedData.error) {
            showNotificationByTemplate(`Neuer Raum ${returnedData.data["name"]} wurde erstellt`, "info")
            addRoomToDOM(returnedData.data.id)
        } else if (returnedData.type == "room-creation-status" && returnedData.error) {
            console.error(error)
        } else if (returnedData.type == "invitation-lookup") {
            if (returnedData.invitation) {
                window.joinGroupName = returnedData.invitation.data.groupName
                proceedBtn.innerHTML = `Zu "${window.joinGroupName}" beitreten`

                document.getElementById("join-existing-group").addEventListener('submit', (e) => {
                    e.preventDefault();
                    sendAdminWsMessage({ data: { invitationId: returnedData.invitation.id }, type: "join-group-request" })
                })
            } else {
                alert(returnedData.error)
            }
        } else if (returnedData.type == "room-group-joined" && returnedData.status == "success") {
            adminWs.send(JSON.stringify({ type: "get-group-data-request", groupId: returnedData.groupId, sessionTokenId: sessionTokenId }))
        } else if (returnedData.type == "room-group-joined" && returnedData.error) {
            switch (returnedData.error) {
                case "user is already part of this group":
                    showNotificationByTemplate(`Ein Beitritt zu "${window.joinGroupName}" ist nicht erforderlich, da du bereits Mitglied bist.`, 'error')
                    break;
            
                default:
                    break;
            }
        } else {
            console.log(returnedData)
        }



    };
}

export function sendAdminWsMessage(msg) {
    const sessionTokenId = sessionStorage.getItem("sessionToken");

    if (adminWs && adminWs.readyState == WebSocket.OPEN && sessionTokenId) {
        msg.sessionTokenId = sessionTokenId;

        try {
            adminWs.send(JSON.stringify(msg));
        } catch (error) {
            console.error('Error sending message to admin WebSocket:', error);
        }
    }
}