import { sendAdminWsMessage } from "../../scripts/api/admin/websocket-connection.js";
import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";

const comboModal = document.getElementById("main-info-edit-modal");

export function addRoomaddFormSubmit() {
    const addRoomForm = document.getElementById('new-room-form');

    addRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const roomName = document.getElementById("room-name");
        const roomCapacity = document.getElementById("room-capacity");

        if (!roomName.value || !roomCapacity.value) {
            showNotificationByTemplate("Bitte alle benötigtne Felder ausfüllen", "error")
        }

        let newRoom = {
            "name": roomName.value,
        }

        sendAdminWsMessage({
            type: "create-room",
            sessionTokenId: sessionStorage.getItem("sessionToken"),
            groupIndex: Object.keys(JSON.parse(sessionStorage.getItem("groups"))).indexOf(sessionStorage.getItem("opened-group")),
            data: newRoom
        });

        comboModal.close();
        showNotificationByTemplate("Raum wird erstellt", "info");
    });


}

