import { sendAdminWsMessage } from "../../scripts/api/admin/websocket-connection.js";
import { showComboModal } from "../modals/open-info-add-modal.js";

const selectGroupNavigation = document.getElementById("main-group-select");

const groupManagementSection = document.getElementById('group-management-section')
const roomsSection = document.getElementById("room-management-section");
const userGroupsSection = document.getElementById("usergroup-management-section")
const groupMemberSection = document.getElementById("member-management-section")


export function displayGroupInNavigation(adminPermissionBool, groupData, index) {
    let storedGroups = JSON.parse(sessionStorage.getItem("groups"));

    if (!storedGroups) {
        storedGroups = {};
    }

    const groupIdFrontendONLY = crypto.randomUUID();

    addRoomgroupToDOM(groupIdFrontendONLY, groupData.name, adminPermissionBool)

    if (adminPermissionBool) {

        // request further invitation data from the server
        if (groupData.invitations && Object.keys(groupData.invitations)) {
            Object.keys(groupData.invitations).forEach(invitation => {
                sendAdminWsMessage({ type: 'invitation-data-request', invitationId: invitation, groupID_frontend: groupIdFrontendONLY, date: new Date()});
            });
        }

        // triggers when a roomgroup gets selected
        document.getElementById(groupIdFrontendONLY + '-group-select').addEventListener('change', () => {


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

            const items = document.querySelectorAll(".group-management .item:is([data-type = 'room'], [data-type = 'user-group'], [data-type = 'member'])")

            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                item.addEventListener("click", () => { showComboModal("details", item.dataset.type, item.id) })
                
            }

            setTimeout(() => { groupManagementSection.classList.remove('loading') }, 800);
        })

    }

    storedGroups[groupIdFrontendONLY] = groupData;
    storedGroups[groupIdFrontendONLY].index = index;

    sessionStorage.setItem("groups", JSON.stringify(storedGroups))

}

function addRoomgroupToDOM(groupID_frontend, groupName, adminPermissionBool) {
    let labelClassList;
    let labelTextContent;

    if (adminPermissionBool) {
        labelClassList = "group-label item"
        labelTextContent = `<p>${groupName}</p>`
    } else {
        labelClassList = "group-label item inactive";
        labelTextContent = `<p>${groupName}</p><p>Adminrechte nicht erteilt</p>`
    }

    selectGroupNavigation.insertAdjacentHTML("afterbegin", `  
         <label class="${labelClassList}" id="${groupID_frontend}-group" for="${groupID_frontend}-group-select">
                    <input type="radio" name="select-room-group" id="${groupID_frontend}-group-select"
                        data-target="group-management-section" data-group-id="${groupID_frontend}">
                    <i class="fa-solid fa-user-group"></i>
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