import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../db-scripts/config.js"
import { SwitchDesignPreference, ThemeGetter, ThemeSetter } from "../ui-scripts/darkmode.js";
import { DateToOutput } from "../ui-scripts/dates.js";
import { AccentClGetter, AccentClSetter } from "../ui-scripts/accent-cl.js";
import { getUsers } from "../db-scripts/auth/get-email.js";
import { ExpandSetting } from "../ui-scripts/expand-setting.js";
import { getSignatures } from "../db-scripts/get-data/get-signatures.js";
import { showPage } from "../ui-scripts/page-loading.js";
import { joinGroup } from "../db-scripts/app/join-group.js";
import { showNotification } from "../ui-scripts/notifications/notifications.js"
import { getRoomSchedule } from "../db-scripts/app/get-room-schedule.js";
import { getGroupFromDbSegmentById, getGroups, returnAdmin } from "../db-scripts/app/get-groups.js";
import { getUser } from "../db-scripts/app/get-username.js";
import { getRooms } from "../db-scripts/app/get-rooms.js";
import { addRoomOccupation } from "../db-scripts/app/add-room-occupation.js";
import { getGroupMembers } from "../db-scripts/app/get-group-members.js";

sessionStorage.setItem("session", "app");

function checkUserAuthentication() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Unsubscribe vom onAuthStateChanged-Ereignis, sobald es ausgelöst wurde
            resolve(user); // Das Promise mit dem user-Wert auflösen
        });
    });
}

checkUserAuthentication().then((user) => {

    showPage();
    if (user) {



        ThemeGetter();

        const userId = user.uid;

        const date = new Date();



        const usernameRef = ref(database, 'users/' + userId + '/username');
        const nameRef = ref(database, 'users/' + userId + '/name');

        const roomRef = ref(database, 'users/' + userId + '/rooms')
        const RoomOccRef = ref(database, 'users/' + userId + '/roomOccupations')







        DateToOutput(date);


        let roomObjCollection = [];
        let roomOccCollection = [];




        //TODO: Migrate to the admin version



        const initialStartupModal = document.getElementById('initial-setup');
        const initialStartupRef = ref(database, 'users/' + userId + '/initial_startup');



        //get username and display it on the settings

        onValue(usernameRef, function (snapshot) {
            const username = snapshot.val();
            if (username) {
                document.getElementById('username-output').innerText = username;

            } else {
                document.getElementById('username-output').innerText = "Kein Nutzername vorhanden";

            }
        });

        //get name and display it in settings >> personal data

        let nameOutput = document.getElementById('name-output');

        onValue(nameRef, (snapshot) => {
            let name = snapshot.val();
            nameOutput.innerText = name;
        })

        //Change username

        let upgradeUsernameBtn = document.getElementById('change-username-btn');

        upgradeUsernameBtn.addEventListener('click', () => {
            let newUsername = promt("Bitte geben Sie den neuen Benutzernamen ein");

            let usernameInUse;

            getUsers().then((users) => {
                usernameInUse = Object.values(users).find(object => object.username === newUsername)
                if (newUsername != "" && !usernameInUse) {
                    update(ref(database, 'users/' + user.uid), {
                        username: newUsername
                    });
                    usernameModal.close();
                } else if (usernameInUse) {
                    showNotification("username-in-use-notification")
                }

            })
        })




        //Join group

        let joinGroupForm = document.getElementById('invitation-details');
        let codeInput = document.getElementById("code-input")
        let pinInput = document.getElementById("pin-code-input")



        joinGroupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (codeInput.value.length == 6 &&
                typeof parseFloat(pinInput.value) == "number" &&
                pinInput.value.length == 4) {

                //Join group

                joinGroup(userId, [codeInput.value, pinInput.value], nameOutput.innerText).then((groupName) => {
                    document.getElementById('group-name-notification-p').innerText = groupName
                    showNotification("group-admission-success");
                }).catch(() => {
                    showNotification("group-admission-failed");
                });


            } else {
                alert("Eingabe ungültig")
                // Show invalid input notification
            }
        })



        //TODO: Get groups

        let groupSelect = document.getElementById('select-group');
        let settingsGroupDiv = document.getElementById('settings-groups');
        let formGroupSelect = document.getElementById('select-group-for-add-form');

        getGroups(userId).then((groupData) => {


            Object.keys(groupData).forEach((groupId) => {
                getGroupFromDbSegmentById(groupId).then(group => {

                    switch (typeof group.admin) {
                        case "string":
                            returnAdmin(group.admin).then(admin => {

                                settingsGroupDiv.innerHTML += `  <div class="group" id="group+${groupId}"><i class="fa-solid fa-group"></i><p class="max">${group.name}</p><p title="Name des Administrators">${admin.name}</p><section class="actions"><span title="${group.name} verlassen"><i class="fa-solid fa-right-from-bracket"></i></span><span></span></section></div>`

                                groupSelect.innerHTML += `<option value="${groupId}">${group.name}<option>`;

                                if(groupData[groupId].write == true){
                                    formGroupSelect.innerHTML += `<option value="${groupId}">${group.name}<option>`;
                                }



                            });
                            break;
                        case "array":
                            throw new Error("feature hasn't been implemented yet")
                            break;
                    }






                }).catch(error => {
                    console.log(error.message)
                })
            })


        })

        groupSelect.addEventListener('change', (e) => {
            document.getElementById('rooms-div').innerHTML = ""
            getRooms(groupSelect.value).then(rooms => {

                if (rooms && rooms.length > 0) {


                    roomObjCollection = rooms;

                    roomObjCollection.forEach(room => {


                        document.getElementById('rooms-div').innerHTML += `
                   <div class="room" data-name="${room.id}">
                   <h3 class="room-name" id="${'room-name' + room.id}">${room.name}</h3>
                   <p class="room-occ-space" >Keine Besetzungen</p>
                     </div>
                   `;

                    })

                    getRoomSchedule(groupSelect.value);


                } else {
                    document.getElementById('rooms-div').style.textAlign = "center";
                    document.getElementById('rooms-div').innerHTML = "Noch keine Räume";
                }

            })
        })

        let formRoomSelect = document.getElementById('select-room-for-add-form');


        formGroupSelect.addEventListener('change', () => {
            getRooms(formGroupSelect.value).then(rooms => {
                if (rooms && rooms.length > 0) {
                    roomObjCollection = rooms;
                    roomObjCollection.forEach(room => {
                        formRoomSelect.innerHTML += `<option value="${room.id}">${room.name}</option>`
                    })
                } else {

                }
            })

            getGroupMembers(formGroupSelect.value).then(members => {

                members.sort(function (a, b) {
                    var nameA = a.name.toLowerCase();
                    var nameB = b.name.toLowerCase();

                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });


                let groupMemberSearchField = document.getElementById('search-group-member');
                let groupMembers = document.getElementsByClassName('group-member')

                let peopleSelectResults = document.getElementById('people-select-results');


                members.forEach(member => {

                    if (member.id != userId) {

                        peopleSelectResults.innerHTML += `<p class="group-member" data-userid="${member.id}"><i class="fa-solid fa-user"></i>${member.name}</p>`


                    }

                })


                groupMemberSearchField.addEventListener('keyup', () => {


                    for (let index = 0; index < groupMembers.length; index++) {
                        const groupMember = groupMembers[index];
                        if (groupMember.innerText.includes(groupMemberSearchField.value)) {
                            groupMember.style.display = "flex";
                        } else {
                            groupMember.style.display = "none";
                        }
                    }
                })


                let invitedUsersDiv = document.getElementById('invited-users');
                let invitedUserRemoveTriggers;




                for (let index = 0; index < groupMembers.length; index++) {
                    const member = groupMembers[index];


                    member.addEventListener('click', (e) => {
                        e.preventDefault();
                        invitedUsersDiv.innerHTML += ` <div class="invited-user center" data-userid="${member.dataset.userid}">${member.textContent}<i class="fa-solid fa-xmark remove-invited-user"></i></div>`
                        member.remove();
                        invitedUserRemoveTriggers = document.getElementsByClassName('remove-invited-user');


                    })

                }


                let mutationObserver = new MutationObserver(entries => {
                    for (let index = 0; index < invitedUserRemoveTriggers.length; index++) {
                        const trigger = invitedUserRemoveTriggers[index];

                        trigger.addEventListener('click', () => {
                            peopleSelectResults.innerHTML += `<p class="group-member" data-userid="${trigger.dataset.userid}"><i class="fa-solid fa-user"></i>${trigger.parentElement.textContent}</p>`
                            trigger.parentElement.remove();
                        })

                    }
                })

                mutationObserver.observe(invitedUsersDiv, { childList: true })

                let memberMutationObserver = new MutationObserver(entries => {
                    groupMembers = document.getElementsByClassName('group-member');
                    for (let index = 0; index < groupMembers.length; index++) {
                        const member = groupMembers[index];
    
    
                        member.addEventListener('click', (e) => {
                            e.preventDefault();
                            invitedUsersDiv.innerHTML += ` <div class="invited-user center" data-userid="${member.dataset.userid}">${member.textContent}<i class="fa-solid fa-xmark remove-invited-user"></i></div>`
                            member.remove();
                            invitedUserRemoveTriggers = document.getElementsByClassName('remove-invited-user');
    
    
                        })
    
                    }
    
                })

                memberMutationObserver.observe(peopleSelectResults, {childList: true})

                const addRoomOccForm = document.getElementById('new-room-occ-form');
        
        
                let addRoomOccInputs = {
                    title: document.getElementById("event-title"),
                    targetGroup: document.getElementById("select-group-for-add-form"),
                    targetRoom: document.getElementById("select-room-for-add-form"),
                    date: document.getElementById("pick-date"),
                    timeFrom: document.getElementById("time-from"),
                    timeTo: document.getElementById("time-to"),
                    notes: document.getElementById("notes")
                }
        
        

                addRoomOccForm.addEventListener('submit', (e) => {
                    e.preventDefault();
        
                    let invitedUsers = [];

                    for (let index = 0; index < invitedUsersDiv.children.length; index++) {
                        const invitedUser = invitedUsersDiv.children[index];
                        
                        invitedUsers.push(invitedUser.dataset.userid);
                    }
        
                    if (addRoomOccInputs.date.value
                        && addRoomOccInputs.timeFrom.value
                        && addRoomOccInputs.timeTo.value 
                        && addRoomOccInputs.targetGroup.value
                        && addRoomOccInputs.date.value 
                        && addRoomOccInputs.targetRoom.value 
                        && addRoomOccInputs.title.value) {
                            addRoomOccupation(userId, addRoomOccInputs.title.value, addRoomOccInputs.targetGroup.value, addRoomOccInputs.targetRoom.value, addRoomOccInputs.date.value, [addRoomOccInputs.timeFrom.value, addRoomOccInputs.timeTo.value], invitedUsers, addRoomOccInputs.notes.value);
        
                    } else {
                        showNotification("form-not-completely-filled-out");
                    }
                })
        

            })

        })







        //deleteExpiredRoomOccupations();









        const selectThemeField = document.getElementById('select-theme');

        selectThemeField.addEventListener('click', () => {
            ThemeSetter()
        })

        const selectAccentCl = document.getElementById("select-accent-color");

        const accentCl = AccentClGetter();

        if (accentCl && accentCl != "") {

            document.querySelector(':root').style.setProperty('--accent-color', accentCl)
            selectAccentCl.value = accentCl;

        }


        selectAccentCl.addEventListener('change', (val) => {
            document.querySelector(':root').style.setProperty('--accent-color', selectAccentCl.value);
            AccentClSetter(selectAccentCl.value);

        })

        const submitDate = document.getElementById('submit-date');
        const dateInput = document.getElementById('date');

        dateInput.addEventListener('change', () => {
            if (dateInput.value != "") {
                DateToOutput(dateInput.value);
                getRoomSchedule(groupSelect.value)
            }
        })




   


        onValue(initialStartupRef, function (snapshot) {
            const initial_startup_bool = snapshot.val();


            if (initial_startup_bool == true) {
                document.getElementById('increase-tab-index')


                initialStartupModal.showModal();


                const tutorialTabsDiv = document.getElementsByClassName('tabs');
                const tutorialNavDots = document.getElementsByClassName('dot');
                const tutorialContinueBtn = document.getElementById('increase-tab-index');

                let tabIndex = 1;
                tutorialTabsDiv[0].style.left = 0 + "px";


                tutorialNavDots[0].classList.add("active");

                function increasePageNumber() {
                    tutorialNavDots[tabIndex].classList.remove("active");
                    tabIndex++;
                    tutorialTabsDiv[0].style.left = (tabIndex - 1) * (-500) + "px";
                    tutorialNavDots[tabIndex - 1].classList.add("active");
                }

                tutorialContinueBtn.addEventListener('click', () => {

                    if (tabIndex < 4) {
                        increasePageNumber();
                    } else {
                        update(ref(database, 'users/' + userId + '/initial_startup'), {
                            initial_startup: false
                        });
                        initialStartupModal.close()
                    }


                })


            }

        });

        const logout = document.getElementById("logout");

        logout.addEventListener('click', (e) => {

            const auth = getAuth();
            signOut(auth).then(() => {
                window.location.replace("/index.html");
            }).catch((error) => {
                alert(error)
            });
        })


    } else {
        const backToLoginModal = document.getElementById('first-login-modal');
        backToLoginModal.showModal();
        setTimeout(() => {
            location.replace("../");
        }, 2500)

    }
});


