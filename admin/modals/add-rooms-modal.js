import { sendAdminWsMessage } from "../../scripts/api/websocket-connection.js";
import { fetchWord } from "../../scripts/syllable-seperation/scraper.js";
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

        const roomNameArray = roomName.value.split(" ");
        let roomNameSeperated = "";

        roomNameArray.forEach(word => {
            let seperationSpace = "";

            if (roomNameArray.indexOf(word) > 0) {
                seperationSpace = " ";
            }

            fetchWord(word).then((seperatedWord) => {
                if (seperatedWord == word) {
                    roomNameSeperated = word;
                } else if (seperatedWord.includes('<span class="hilight">-</span>')){
                roomNameSeperated += seperationSpace + seperatedWord.replaceAll('<span class="hilight">-</span>', '&shy;')
                }
            }).catch((error) => {
               console.error(error);
            })
        });

        console.log(roomNameSeperated)

        fetchWord(roomName.value).then((seperatedWord) => {
            newRoom["name-seperated"] = seperatedWord.replaceAll('<span class="hilight">-</span>', '&shy;');
        }).catch((error) => {
           console.error(error);
        }).finally(() => {
            sendAdminWsMessage({
                type: "create-room",
                sessionTokenId: sessionStorage.getItem("sessionToken"),
                groupIndex: Object.keys(JSON.parse(sessionStorage.getItem("groups"))).indexOf(sessionStorage.getItem("opened-group")),
                data: newRoom
            });
    
            comboModal.close();
            showNotificationByTemplate("Raum wird erstellt", "info");
        });

    })
}

