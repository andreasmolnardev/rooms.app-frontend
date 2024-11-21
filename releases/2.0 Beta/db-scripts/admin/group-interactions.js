import { showNotification } from "../../ui-scripts/notifications/notifications.js";
import { copyTextToClipboard } from "../../ui-scripts/prepare-copy.js";
import { downloadTextAsTextFile } from "../../ui-scripts/prepare-txt-download.js";
import { get, CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "..//config.js"
import { getAdminLicense } from "./get-license.js";

let databaseRef = ref(database);
let groupRef = ref(database, 'groups/');
let invitationRef = ref(database, 'invitations/')

export function createGroup(groupName, adminId) {
    getAdminLicense(database, adminId, ref(database, 'users/' + adminId + '/license')).then((license) => {
        onValue(groupRef, (snapshot) => {
            let groups = snapshot.val();

            let newGroupId = adminId + '-group'

            Object.assign(groups, {

                [newGroupId]: {
                    "admin": adminId,
                    "contactRequests": 0,
                    "license": license,
                    "members": null,
                    "name": groupName,
                    "plan": "basic",
                    "rooms": null,
                    "admin-firstlogin": true
                }
            })

            update(databaseRef, {
                groups: groups
            })

        })
    }).catch(() => {
        showNotification('license-notification');
    })

}


export function inviteUsers(destination, writeToGroup, expires) {
    //create a new invitation in DB
    return new Promise((resolve, reject) => {
        get(invitationRef).then((snapshot) => {

            let invitations = snapshot.val();

            if (!invitations) {
                invitations = [];
            }

            let letterCode = [];
            let letterCodeCharacters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]



            for (let index = 0; index < 6; index++) {
                letterCode.push(letterCodeCharacters[Math.floor(Math.random() * letterCodeCharacters.length)])

            }


            let pinCode = [];

            for (let index = 0; index < 4; index++) {
                pinCode.push(Math.floor(Math.random() * 10))

            }



            invitations.push(
                {


                    "code": letterCode,
                    "pin": pinCode,
                    "destination": destination,
                    "expirement": {
                        "data": expires.data,
                        "type": expires.type
                    },

                    "rights": {
                        "read": true,
                        "write": writeToGroup
                    },
                    "usersJoinedCounter": 0

                }
            )



            update(databaseRef, {
                invitations: invitations
            }).catch((e) => {
                reject(e.message)
            })

            resolve([letterCode, pinCode])
        })
    })


}

export function retrieveGroupInvitations(groupId) {

    return new Promise((resolve, reject) => {
        onValue(invitationRef, (snapshot) => {

            let invitations = snapshot.val();

            if (!invitations) {
                invitations = [];
            }

            let output = []; // where successfully retrieved datasets for groupId are being stored

            invitations.forEach(invitation => {
                if (invitation.destination == groupId) {
                    output.push(invitation);
                }
            });

            if (output.length == 0) {
                reject("No invitations in database")
            }

            resolve(output);


        })
    })

}

export function retrieveRooms(groupRef){
    return new Promise((resolve, reject) => {
        get(groupRef).then( (snapshot) => {
            let rooms = snapshot.val().rooms;
    
            if (!rooms){
                rooms = [];
            }
    
            
           resolve(rooms)
    
        })
    })
    
}

export function getGroupMembers(groupRef){
    return new Promise((resolve, reject) => {
        get(groupRef).then((snapshot) => {
            let groupMembers = snapshot.val().members;

            if(!groupMembers){
                reject([]);
            } else {
                resolve(groupMembers);
            }

        })
    })
}

export function changeGroupName() {

}

export function addRoom(roomName, groupRef) {
    return new Promise((resolve, reject) => {
        get(groupRef).then( (snapshot) => {
            let rooms = snapshot.val().rooms;
    
            if (!rooms){
                rooms = [];
            }
    
            let newRoomId = crypto.randomUUID();
    
            rooms.push({id: newRoomId, name: roomName});
    
            update(groupRef, {
                rooms: rooms
            }).then(() => {
                resolve(`der Raum ${roomName} wurde erfolgreich erstellt`)
            }).catch(() => {
                reject("Error when trying to create new room")
               
            })
    
        })
    })
    
}

export function outputInvitationResults(invitationData, userInvitationForm) {
    userInvitationForm.style.pointerEvents = 'none';

    document.getElementById('code-output').textContent = invitationData[0].join("");
    document.getElementById('pin-output').textContent = invitationData[1].join("");

    document.getElementById('code-output').style.display = 'flex';
    document.getElementById('pin-output').style.display = 'flex';
    document.getElementById('invitation-output-placeholder').style.display = 'none';

    let downloadInvitationBtn = document.getElementById('download-invitation-text');
    let copyInvitationBtn = document.getElementById('copy-invitation-text');

    let text = invitationData[0].join("") + "|||" + invitationData[1].join("");

    downloadInvitationBtn.addEventListener('click', () => {
        downloadTextAsTextFile(text);
    })

    copyInvitationBtn.addEventListener('click', () => {
        copyTextToClipboard(text);
        showNotification('invitation-copied');
    })

}

// DEPRECATED: (from old version)

function renameRoom(roomId, newName) {
    const roomIndex = roomObjCollection.findIndex(room => room.id === roomId);
    if (roomIndex !== -1) {
        roomObjCollection[roomIndex].name = newName;
        update(ref(database, 'users/' + userId + '/rooms'), {
            rooms: roomObjCollection
        });
        location.reload();
    }
}

function deleteRoom(roomId) {
    roomObjCollection = roomObjCollection.filter(room => room.id !== roomId);
    update(ref(database, 'users/' + userId + '/rooms'), {
        rooms: roomObjCollection
    });
    location.reload();
}