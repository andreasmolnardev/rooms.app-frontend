import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../db-scripts/config.js"
import { getContactRequests } from "../db-scripts/contact-requests/get-requests.js";
import { addToVersion } from "../db-scripts/versions/add-to-version.js";
import { getSignatures } from "../db-scripts/get-data/get-signatures.js";
import { getAdminLicense } from "../db-scripts/admin/get-license.js";
import { getGroup } from "../db-scripts/admin/get-group.js";
import { showPage } from "../ui-scripts/page-loading.js";
import { showNotification } from "../ui-scripts/notifications/notifications.js";
import { addRoom, createGroup, inviteUsers, outputInvitationResults, retrieveRooms, getGroupMembers } from "../db-scripts/admin/group-interactions.js";



export function checkUserAuthentication() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Unsubscribe vom onAuthStateChanged-Ereignis, sobald es ausgelöst wurde
            resolve(user); // Das Promise mit dem user-Wert auflösen
        });
    });
}

sessionStorage.setItem("session", "admin");



checkUserAuthentication().then((user) => {
    showPage();
    if (user) {
        const userId = user.uid;

        console.log(userId)

        const groupRef = ref(database, 'groups/' + userId + '-group');

        const licenseTab = document.getElementById('license-tab');

        let startGroupBtn = document.getElementById('start-group')


        getAdminLicense(database, userId, ref(database, 'users/' + userId + '/license')).then((license) => {


            document.getElementById('license-code').innerText = Object.keys(license)

            document.getElementById('license-valid').innerText = "gültig"

            licenseTab.classList.add('license-valid')


            //Find group

            getGroup(database, userId, groupRef).then((groupData) => {


                // fill out data

                document.getElementById('group-name').innerText = groupData.name
                document.getElementById('invite-users-modal-heading').innerText = 'Benutzer zu ' + groupData.name + ' einladen'


                let membersDiv = document.getElementById('members-div');

                getGroupMembers(groupRef).then((members) => {
                    members.forEach(member => {

                        if (member.rights.write == true) {
                            membersDiv.innerHTML += `<div class="item" id="member-${member.id}"> <p>${member.name}</p> <i class="fa-solid fa-eye"></i>  <i class="fa-solid fa-pen-to-square"></i> </div>`;
                        } else {
                            membersDiv.innerHTML += `<div class="item" id="member-${member.id}"> <p>${member.name}</p> <i class="fa-solid fa-eye"></i>  </div>`;

                        }

                    })

                }).catch(() => {
                    membersDiv.innerHTML == `<div class="item "> <p>Diese Raumgruppe verfügt über keine Mitglieder </p> </div>`
                })

                retrieveRooms(groupRef).then((rooms) => {
                    Object.values(rooms).forEach(roomName => {
                        document.getElementById('rooms').innerHTML += `<div class="item"><p>${roomName.name}</p><section class="tools" id="toolbar-${rooms.id}"}><a class="edit-name"><i class="fa-solid fa-pen"></i></a><a class="delete-item"><i class="fa-solid fa-trash"></i></a></section>`
                    })

                })

                let addRoomButton = document.getElementById('add-room');

                addRoomButton.addEventListener('click', () => {
                    addRoom(prompt("Bitte geben Sie den neuen Namen für den Raum ein:"), groupRef).then((successNotification) => {
                        document.getElementById('room-created-message').innerText = successNotification;
                        showNotification('room-created')
                    }).catch((errorMessage) => {
                        document.getElementById('room-created-message').innerText = errorMessage;
                        showNotification('room-created')
                        throw new Error(errorMessage);
                    })
                })




                let userInvitationForm = document.getElementById('create-user-invitation')

                userInvitationForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    let rightWriteCheckbox = document.getElementById('rights-write')

                    let expireCodeByQuantity = document.getElementById('expire-code-times-used')
                    let expireCodeQuantityInput = document.getElementById('expire-quantity-input')

                    let expireCodeByDatetime = document.getElementById('expire-code-date-time')
                    let expireCodeDatetimeInput = document.getElementById('expire-code-date-time-input')



                    if (expireCodeByDatetime.checked == true && expireCodeDatetimeInput.value) {

                        inviteUsers(userId + '-group', rightWriteCheckbox.checked, {
                            "data": expireCodeDatetimeInput.value,
                            "type": "datetime"
                        }).then((invitationData) => {
                            outputInvitationResults(invitationData, userInvitationForm);
                        })




                    } else if (expireCodeByQuantity.checked == true && expireCodeQuantityInput.value) {


                        inviteUsers(userId + '-group', rightWriteCheckbox.checked, {
                            "data": expireCodeQuantityInput.value,
                            "type": "counter"
                        }).then((invitationData) => {
                            outputInvitationResults(invitationData, userInvitationForm);
                        })

                    } else {
                        alert("Bitte alle benötigten Felder ausfüllen")
                    }
                })

            }).catch(() => {

                console.log("Keine Raumgrupppe vorhanden")

                document.getElementsByClassName('group-name')[0].classList.add('change')
                licenseTab.classList.add('startup')

                startGroupBtn.addEventListener('click', () => {

                    licenseTab.classList.remove('startup')
                    licenseTab.classList.add('first-startup')

                })

                //create group when arrow pressed

                let createGroupForm = document.getElementById('create-group-form')

                createGroupForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    requestNewGroup();
                })

                let requestNewGroupIcon = document.getElementById('request-group-icon');

                requestNewGroupIcon.addEventListener('click', () => {
                    requestNewGroup();
                })

                function requestNewGroup() {

                    let groupNameInputVal = document.getElementsByClassName('group-name-input')[0].value;


                    if (groupNameInputVal) {
                        createGroup(groupNameInputVal, userId)
                        alert('Raumgruppe erfolreich erstellt')
                        location.reload();
                    } else {
                        alert('Bitte Feld ausfüllen')
                    }

                }

            })


            getContactRequests().then((contactRequests) => {
                contactRequests.forEach(contactRequest => {
                    contactRequestSection.innerHTML += `
                    <div class="request">

                    <h2>${contactRequest.title}</h2>
                    <div class="space-between">
                        <h3>${contactRequest.email}</h3>
                        <p>${contactRequest.date}</p>
                    </div>
                  
                    <p class="text">${contactRequest.text}
                </div>
                    `
                });
            })

            getSignatures(userId).then((signstures) => {

            })
        }).catch(() => {




            licenseTab.classList.add('startup')

            startGroupBtn.addEventListener('click', () => {
                showNotification('license-notification');
                licenseTab.classList.remove('startup')
                licenseTab.classList.add('license-invalid')

            })
        })


    } else {
        alert('Zugriff verweigert');
        window.location.replace('../');
    }
})