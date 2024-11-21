import { sendAdminWsMessage } from "../../scripts/api/websocket-connection.js";
import { fetchWord } from "../../scripts/syllable-seperation/scraper.js";

const selectGroupNavigation = document.getElementById("main-group-select");

export function displayGroupInNavigation(adminPermissionBool, groupData, index) {
    let storedGroups = JSON.parse(sessionStorage.getItem("groups"));

    if (!storedGroups) {
        storedGroups = {};
    }

    const groupIdFrontendONLY = crypto.randomUUID();

    let labelClassList;
    let labelTextContent;

    if (adminPermissionBool) {
        labelClassList = "group-label item"
        labelTextContent = `<p>${groupData.name}</p>`
    } else {
        labelClassList = "group-label item inactive";
        labelTextContent = `<p>${groupData.name}</p><p>Adminrechte nicht erteilt</p>`
    }

    selectGroupNavigation.insertAdjacentHTML("afterbegin", `  
         <label class="${labelClassList}" id="${groupIdFrontendONLY}-group" for="${groupIdFrontendONLY}-group-select">
                    <input type="radio" name="select-room-group" id="${groupIdFrontendONLY}-group-select"
                        data-target="group-management-section" data-group-id="${groupIdFrontendONLY}">
                    <i class="fa-solid fa-user-group"></i>
                    <div class="text">
                        ${labelTextContent}
                    </div>
                </label>
        `
    )

    const groupManagementSection = document.getElementById('group-management-section')
    const roomsSection = document.getElementById("room-management-section");
    const userGroupsSection = document.getElementById("usergroup-management-section")
    const groupMemberSection = document.getElementById("member-management-section")

   
    if (adminPermissionBool) {

        if (groupData.invitations && Object.keys(groupData.invitations)) {
            Object.keys(groupData.invitations).forEach(invitation => {
                sendAdminWsMessage({ type: 'invitation-data-request', invitationId: invitation, groupID_frontend: groupIdFrontendONLY });
            });
        }


        document.getElementById(groupIdFrontendONLY + '-group-select').addEventListener('change', () => {

            groupManagementSection.classList.add('loading')

            roomsSection.querySelector(".content").textContent = ""
            userGroupsSection.querySelector(".content").textContent = ""
            groupMemberSection.querySelector(".content").textContent = ""
        

            groupData.rooms.forEach(room => {
                console.log(room)

                if (room["name-seperated"]) {
                    roomsSection.querySelector(".content").insertAdjacentHTML('beforeend', `
                        <div class="item center" data-type="room" id="room-${room.id}">
                        <div class="toolbar">
                                            <span class="center" title="Raum bearbeiten">
                                                <i class="fa-solid fa-pen"></i>
                                            </span>
                                        </div>
                                        <i class="fa-solid fa-cube"></i>
                                        <p class="title">${room["name-seperated"]}</p>
                                        </div>`)
                } else {
                    fetchWord(room.name).then(result => {
                        const roomNameSeperated = result.replaceAll('<span class="hilight">-</span>', '&shy;')
    
                        roomsSection.querySelector(".content").insertAdjacentHTML('beforeend', `
                    <div class="item center" data-type="room" id="room-${room.id}">
                    <div class="toolbar">
                                        <span class="center" title="Raum bearbeiten">
                                            <i class="fa-solid fa-pen"></i>
                                        </span>
                                    </div>
                                    <i class="fa-solid fa-cube"></i>
                                    <p class="title">${roomNameSeperated}</p>
                                    </div>
                    `)
    
                    }).catch(error => {
                        roomsSection.querySelector(".content").insertAdjacentHTML('beforeend', `
                    <div class="item center" data-type="room" id="room-${room.id}">
                    <div class="toolbar">
                                        <span class="center" title="Raum bearbeiten">
                                            <i class="fa-solid fa-pen"></i>
                                        </span>
                                    </div>
                                    <i class="fa-solid fa-cube"></i>
                                    <p class="title">${room.name}</p>
                                    </div>
                    `)
                    })
                }

               
            });

            let userGroupKeys = Object.keys(groupData["user-groups"]);

            userGroupKeys.forEach(usergroup => {
                fetchWord(usergroup).then(result => {
                    const userGroupNameSeperated = result.replaceAll('<span class="hilight">-</span>', '&shy;')

                    if (result.replaceAll('<span class="hilight">-</span>', '' != usergroup)) {
                        userGroupsSection.querySelector(".content").insertAdjacentHTML('beforeend', `      <div class="item center" data-type="user-group" id="user-group-${usergroup}">
                    <div class="toolbar">
                        <span class="center" title="Nutzergruppe bearbeiten">
                            <i class="fa-solid fa-pen"></i>
                        </span>
                    </div>
                    <i class="fa-solid fa-user-group"></i>
                    <p class="title">${usergroup}</p>
                </div>`)
                    } else {
                        userGroupsSection.querySelector(".content").insertAdjacentHTML('beforeend', `      <div class="item center" data-type="user-group" id="user-group-${usergroup}">
                            <div>
                                <span class="center" title="Nutzergruppe bearbeiten">
                                    <i class="fa-solid fa-pen"></i>
                                </span>
                            </div>
                            <i class="fa-solid fa-user-group"></i>
                            <p class="title">${userGroupNameSeperated}</p>
                        </div>`)
                    }
                })
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

            setTimeout(() => { groupManagementSection.classList.remove('loading') }, 800);


        })

    }

    storedGroups[groupIdFrontendONLY] = groupData;
    storedGroups[groupIdFrontendONLY].index = index;

    sessionStorage.setItem("groups", JSON.stringify(storedGroups))

}