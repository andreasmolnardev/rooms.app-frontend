import { components } from "../../components/components.js";
import { sendWsClientMessage } from "../../scripts/api/app/websocket-connection.js";
import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";
import { showComboModal } from "../modals/open-add-info-modal.js";
import { emptyRoomOccSpaces } from "../sidescroll-roomsdiv.js";

const groupScheduleNavHeader = document.getElementById('group-schedule-nav-header')
const adminDashboardNavHeader = document.getElementById('group-admin-nav-header')

window.groupScheduleNavHeader = groupScheduleNavHeader;

const groupSelect = document.getElementById('select-group')
window.groupSelect = groupSelect

const groupManagementSection = document.getElementById('group-admin-management-section')
const roomsSection = document.getElementById("room-management-section");
const userGroupsSection = document.getElementById("usergroup-management-section")
const groupMemberSection = document.getElementById("member-management-section")

export function displayGroup(groupId, groupData) {
    // verify whether the group with id groupId is set as standard
    // display it accordingly
    // add it to the overview in settigs

    console.log(groupData)

    addGroupToSessionStorage(groupId, groupData)

    const addRoomOccupationGroupSelect = document.getElementById("select-group-for-add-form");
    const addRoomOccupationRoomSelect = document.getElementById("select-room-for-add-form");
    addRoomOccupationGroupSelect.innerHTML += `<option value="${groupId}">${groupData.name}<option>`;

    //retrieve group schedule
    groupScheduleNavHeader.insertAdjacentHTML('afterend', `
        <label class="nav-el" for="nav-group-${groupId}">
                <input type="radio" name="nav" data-group-id="${groupId}" id="nav-group-${groupId}" class="schedule-nav nav-tab-radio" data-target="schedule-dashboard">
                <i class="fa-solid fa-user-group"></i>
                <p>${groupData.name}</p>
            </label>
        `)

    groupSelect.innerHTML += `<option value="${groupId}">${groupData.name}<option>`;
    groupSelect.parentElement.style.display = 'none';

    addRoomgroupToAdminNav(groupId, groupData.name, groupData.permissions.admin)

    if (groupData.permissions.admin === true || Object.values(groupData.permissions.admin).indexOf(true)) {

        if (groupData.invitations && Object.keys(groupData.invitations)) {
            Object.keys(groupData.invitations).forEach(invitation => {
                sendWsClientMessage({ type: 'invitation-data-request', invitationId: invitation, groupID_frontend: groupId, date: new Date() });
            });
        }

        // triggers when a roomgroup gets selected (admin)

        document.getElementById('nav-group-' + groupId + '-admin').addEventListener('change', () => {
            sessionStorage.setItem("opened-group", groupId)

            emptyRoomgroupDataDOM();

            groupData.rooms.forEach(room => {
                if (room["name-seperated"]) {
                    addRoomToDOM(room.id, room["name-seperated"])
                } else {
                    addRoomToDOM(room.id, room.name)
                }
            });

            let userGroupKeys = Object.keys(groupData["user-groups"]);

            userGroupKeys.forEach(usergroup => {
                addUsergroupToDOM(usergroup);
            })


            groupData.members.forEach(member => {
                delete Object.assign(member, { ["id"]: member["memberId"] })["memberId"];

                groupMemberSection.querySelector(".content").insertAdjacentHTML("beforeend", `
                    <div class="item center" data-type="member" id="${'member-' + member.id}">
                                    <div class="toolbar">
                                        <span class="center" title="Bentuzer bearbeiten">
                                            <i class="fa-solid fa-pen"></i>
                                        </span>
                                    </div>
                                    <i class="fa-solid fa-circle-user"></i>
                                    <p class="title">${member.name}</p>
                                </div>
                    `)
            })

            //add Event listener for items

            const items = document.querySelectorAll(".group-admin-management .item:is([data-type = 'room'], [data-type = 'user-group'], [data-type = 'member'])")

            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                console.log(item)
                item.addEventListener("click", () => { showComboModal("details", item.dataset.type, item.id) })

            }

            //Add open roomsadd modal
            const addRoomBtn = document.getElementById("add-room-button");
            //Add open new room group modal

            setTimeout(() => { groupManagementSection.classList.remove('loading') }, 800);
        })
    }

    //add group select change and date change event listener   
    if (groups.indexOf(groupId) == groups.length - 1) {

        groupSelect.addEventListener('change', () => {

            let groupsStorage = JSON.parse(sessionStorage.getItem("groups"));

            if (groupsStorage[groupSelect.value].permissions.writeAll || groupsStorage[groupSelect.value].permissions.write.exceptions) {
                document.querySelector(".add-btn").classList.add("active")
            }

            const roomsDivDOM = document.getElementById("rooms-div")

            if (roomsDivDOM.querySelector) {
                
            } else {
                
            }

            groupsStorage[groupSelect.value].rooms.forEach(room => {
                roomsDivDOM.insertAdjacentHTML(`beforeend`, /*html*/ `
                    <div class="room" data-name="${room.id}">
                     <h3 class="room-name" id="room-name-${room.id}">${room.name}</h3>
                        <p class="room-occ-space">Keine Besetzungen</p>
                      </div>
                `)
            })


            if (dateInput.value) {
                sendWsClientMessage({ type: "room-schedule-request", data: {groupIndex: Object.keys(groups).indexOf(groupSelect.value), date: dateInput.value } })
            }

        })

        dateInput.addEventListener('change', () => {
            if (groupSelect.value) {
                emptyRoomOccSpaces();
                sendWsClientMessage({ type: "room-schedule-request", data: {groupIndex: Object.keys(groups).indexOf(groupSelect.value), date: dateInput.value } })
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

function addGroupToSessionStorage(groupId, groupData) {
    let groupsStorage = sessionStorage.getItem("groups")

    if (!groupsStorage) {
        groupsStorage = {}
    } else {
        groupsStorage = JSON.parse(groupsStorage)
    }

    groupsStorage[groupId] = groupData;

    sessionStorage.setItem("groups", JSON.stringify(groupsStorage))
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

function addRoomgroupToAdminNav(groupId, groupName, adminPermissions) {
    let labelClassList;
    let labelTextContent = "";

    if (adminPermissions === true || Object.values(adminPermissions).indexOf(true)) {
        labelClassList = "group-label item"

    } else {
        labelClassList = "group-label item inactive";
        labelTextContent = `<p>Adminrechte nicht erteilt</p>`
    }


    adminDashboardNavHeader.insertAdjacentHTML("afterend", `  
            <label class="nav-el" for="nav-group-${groupId}-admin" id="nav-group-${groupId}-admin-label" class="nav-tab-radio ${labelClassList}">
                <input type="radio" name="nav" id="nav-group-${groupId}-admin" data-target="group-admin-management-section" class="admin-nav nav-tab-radio">
                <i class="fa-solid fa-user-group"></i>
                <p>${groupName}</p>
                  <div class="text">
                        ${labelTextContent}
                    </div>
            </label>
        `
    )
}


function emptyRoomgroupDataDOM() {
    groupManagementSection.classList.add('loading')

    roomsSection.querySelector(".content").textContent = ""
    userGroupsSection.querySelector(".content").textContent = ""
    groupMemberSection.querySelector(".content").textContent = ""
}

export function addRoomToDOM(roomId, roomName) {
    roomsSection.querySelector(".content").insertAdjacentHTML('beforeend', `
        <div class="item center" data-type="room" id="room-${roomId}">
        <div class="toolbar">
                            <span class="center" title="Raum bearbeiten">
                                <i class="fa-solid fa-pen"></i>
                            </span>
                        </div>
                        <i class="fa-solid fa-cube"></i>
                        <p class="title">${roomName}</p>
                        </div>`)
}

export function addUsergroupToDOM(usergroupName) {
    userGroupsSection.querySelector(".content").insertAdjacentHTML('beforeend', `      <div class="item center" data-type="user-group" id="user-group-${usergroupName}">
        <div class="toolbar">
            <span class="center" title="Nutzergruppe bearbeiten">
                <i class="fa-solid fa-pen"></i>
            </span>
        </div>
        <i class="fa-solid fa-user-group"></i>
        <p class="title">${usergroupName}</p>
    </div>`)
}