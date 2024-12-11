import { components } from "../../components/components.js";
import { sendWsClientMessage } from "../../scripts/api/websocket-connection.js";

export function displayGroup(groupId, groupData) {

    const groupSelect = document.getElementById("select-group")
    window.groupSelect = groupSelect;
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


            if (dateInput.value) {
                sendWsClientMessage({ type: "room-schedule-request", data: { groupId: groupId, date: dateInput.value } })
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
                inviteUsersSelect.addOption(member.name, member.memberId, "invite-members")
            });


        })


    }



}