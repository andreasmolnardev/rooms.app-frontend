import { components } from "../../components/components.js";
import { sendWsClientMessage } from "../../scripts/api/app/websocket-connection.js";
import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";
import { emptyRoomOccSpaces } from "../sidescroll-roomsdiv.js";

const groupSelect = document.getElementById("select-group")
window.groupSelect = groupSelect;

export function displayGroup(groupId, groupData) {

    groupSelect.innerHTML += `<option value="${groupId}">${groupData.name}<option>`;

    // verify whether the group with id groupId is set as standard
    // display it accordingly
    // add it to the overview in settigs

    let groupsStorage = sessionStorage.getItem("groups")

    if (!groupsStorage) {
        groupsStorage = {}
    } else {
        groupsStorage = JSON.parse(groupsStorage)
    }

    groupsStorage[groupId] = groupData;

    sessionStorage.setItem("groups", JSON.stringify(groupsStorage))

    const addRoomOccupationGroupSelect = document.getElementById("select-group-for-add-form");
    const addRoomOccupationRoomSelect = document.getElementById("select-room-for-add-form");
    addRoomOccupationGroupSelect.innerHTML += `<option value="${groupId}">${groupData.name}<option>`;


    if (groups.indexOf(groupId) == groups.length - 1) {

        groupSelect.addEventListener('change', () => {

            if (groupsStorage[groupSelect.value].permissions.writeAll || groupsStorage[groupSelect.value].permissions.write.exceptions) {
                document.querySelector(".add-btn").classList.add("active")
            }

            const roomsDivDOM = document.getElementById("rooms-div")

            groupsStorage[groupSelect.value].rooms.forEach(room => {
                roomsDivDOM.insertAdjacentHTML(`beforeend`, /*html*/ `
                    <div class="room" data-name="${room.id}">
                     <h3 class="room-name" id="room-name-${room.id}">${room.name}</h3>
                        <p class="room-occ-space">Keine Besetzungen</p>
                      </div>
                `)
            })


            if (dateInput.value) {
                sendWsClientMessage({ type: "room-schedule-request", data: { groupId: groupId, date: dateInput.value } })
            }

        })

        dateInput.addEventListener('change', () => {
            if (groupSelect.value) {
                emptyRoomOccSpaces();
                sendWsClientMessage({ type: "room-schedule-request", data: { groupId: groupId, date: dateInput.value } })
            } else {
                showNotificationByTemplate('bitte eine Raumgruppe auswählen', 'warning')
            }
        })

        addRoomOccupationGroupSelect.addEventListener('change', () => {
            const selectedGroup = JSON.parse(sessionStorage.getItem("groups"))[addRoomOccupationGroupSelect.value];


            addRoomOccupationRoomSelect.innerHTML = '<option disabled selected>Raum</option>';

            if (selectedGroup.permissions.writeAll) {
                //add every room
                console.log(selectedGroup)

                selectedGroup.rooms.forEach(room => {
                    addRoomOccupationRoomSelect.insertAdjacentHTML(`beforeend`, `<option value="${room.id}">${room["name-seperated"]}</option>`)
                });
            } else if (selectedGroup.permissions.write.type == "exclude-items-from-read-access") {
                // add every room except those as defined in selectedGroup.permissions.write.exceptions 
                const roomsWithWriteAccess = selectedGroup.rooms.filter(room => (selectedGroup.permissions.write.exceptions.indexOf(room) == -1))
                roomsWithWriteAccess.forEach(room => {
                    addRoomOccupationRoomSelect.insertAdjacentHTML(`beforeend`, `<option value="${room.id}">${room["name-seperated"]}</option>`)
                });
            } else if (selectedGroup.permissions.write.type == "limited-read-access") {
                // add every room defined in selectedGroup.permissions.write.exceptions 
                const roomsWithWriteAccess = selectedGroup.rooms.filter(room => (selectedGroup.permissions.write.exceptions.indexOf(room) > -1))
                roomsWithWriteAccess.forEach(room => {
                    addRoomOccupationRoomSelect.insertAdjacentHTML(`beforeend`, `<option value="${room.id}">${room["name-seperated"]}</option>`)
                });
            }

            const inviteUsersSelect = components["custom-multi-select"].find(element => element.id == "invited-members-select")

            selectedGroup.members.forEach(member => {
                console.log([member.memberId, window.groups[groupId].memberId])
                if (member.memberId != window.groups[groupId].memberId) {
                    inviteUsersSelect.addOption(member.name, member.memberId, "invite-members")
                }
            });


        })


    }



}

export function displayGroupSchedule(schedule) {
    document.querySelector("#rooms-div section.initial").style.display = "none";

    schedule.sort((a, b) => {
        const timeA = a.timespan[0];
        const timeB = b.timespan[0];
        return timeA.localeCompare(timeB);
    });

    schedule.forEach(occupation => {

        console.log(occupation)

        const targetRoom = document.querySelector(`.room[data-name="${occupation.targetRoom}"]`)

        targetRoom.style.display = 'flex';

        if (targetRoom.querySelector("p.room-occ-space").textContent == "Keine Besetzungen") {
            targetRoom.querySelector("p.room-occ-space").textContent = ""
        }

        const creatorName = JSON.parse(sessionStorage.getItem('groups'))[groupSelect.value]["members"].find(member => (member.memberId == occupation.creatorId)).name

        targetRoom.querySelector("p.room-occ-space").insertAdjacentHTML(`beforeend`, /*html*/`
            <div class="room-occupation" data-title="${occupation.title}" data-room-id="${occupation.targetRoom}" data-date="${occupation.date}" data-time-from="${occupation.timespan[0]}" data-time-to="${occupation.timespan[1]}" data-notes="${occupation.notes}" data-creator="${occupation.creatorId}"> 
            ${occupation.timespan[0]} bis ${occupation.timespan[1]} : ${creatorName} <span class="invited-users-scheduled center" title="Eingeladene Nutzer: ${"invited user names"}"><p class="center">+${"invitedUsersCount"}</p>
            <span class="center"> <i class="fa-solid fa-user"></i></span></span>  ${occupation.title} </div>
        `)
    })
}