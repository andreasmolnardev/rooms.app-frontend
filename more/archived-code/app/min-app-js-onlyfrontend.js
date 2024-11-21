
checkUserAuthentication().then((user) => {

    showPage("app");
    if (user) {
        ThemeGetter();

        const userId = user.uid;

        const date = new Date();

        DateToOutput(date);


        let roomObjCollection = [];

        const initialStartupModal = document.getElementById('initial-setup');
        const initialStartupRef = ref(database, 'users/' + userId + '/initial_startup');

        getUser(userId).then(userData => {
            //get username and display it on the settings

            let username = userData.username;

            if (username) {
                document.getElementById('username-output').innerText = username;

            } else {
                document.getElementById('username-output').innerText = "Kein Nutzername vorhanden";
            }

            //get name and display it in settings >> personal data

            let nameOutput = document.getElementById('name-output');
            nameOutput.innerText = userData.name;


            let emailOutput = document.getElementById('email-output');
            emailOutput.innerText = userData.email;

            //preferences


            let messengerInfo = document.getElementById('dismiss-messenger-information-form');

            if (userData.preferences.showMessengerInfo == false) {
                messengerInfo.style.display = "none";
            }


            //change preferences if clicked away

            let preferencesRef = ref(database, 'users/' + userId + '/preferences');

            let dismissMessengerInfoForm = document.getElementById("dismiss-messenger-information-form")
            let dismissMessengerInfoCheckbox = document.getElementById("dismiss-messenger-information");

            dismissMessengerInfoForm.addEventListener("submit", (event) => {
                event.preventDefault();

                if (dismissMessengerInfoCheckbox.checked == true) {
                    set(preferencesRef, {
                        showMessengerInfo: false
                    }).then(() => {
                        showNotificationByTemplate("Einstellung erfolgreich übernommen", "success")
                        messengerInfo.style.display = "none";
                    })
                }
            })

        }).catch(error => {
            console.error(error)
        })



        //Change username

        let upgradeUsernameBtn = document.getElementById('change-username-btn');

        upgradeUsernameBtn.addEventListener('click', () => {
            let newUsername = prompt("Bitte geben Sie den neuen Benutzernamen ein");

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

        let roomFilterSelect = document.getElementById("select-room-chip");


        let groupSelect = document.getElementById('select-group');
        let settingsGroupDiv = document.getElementById('settings-groups');
        let formGroupSelect = document.getElementById('select-group-for-add-form');

        getGroups(userId).then((groupData) => {


            Object.keys(groupData).forEach((groupId) => {
                getGroupFromDbSegmentById(groupId).then(group => {

                    switch (typeof group.admin) {
                        case "string":
                            returnAdmin(group.admin).then(admin => {

                                let standardGroupBadge;
                                let markGroupAsStandard = `
                                <span title="Als Standart festlegen" class="standardize-group">
                                            <i class="fa-solid fa-award"></i>
                                       </span>
                                `;

                                getStandardGroup(userId).then(standardGroupData => {
                                    if (standardGroupData == groupId) {
                                        standardGroupBadge = `<span title='Standard-Gruppe' class='is-standardized-group'>
                                    <i class='fa-solid fa-award'></i>
                               </span>`;

                                        markGroupAsStandard = `
                                        <span title="Standardstatus entfernen" class="destandardized-group">
                                            <i class="fa-solid fa-award"></i>
                                       </span>
                                        `;
                                    }

                                    settingsGroupDiv.innerHTML += ` 
                                    <div class="group" id="group+${groupId}">
                                        <i class="fa-solid fa-group">
                                        </i>
                                        <p class="max">${group.name}
                                        ${standardGroupBadge}
                                        </p>
                                       <p title="Name des Administrators">${admin.name}</p>
                                       <section class="actions">
                                          ${markGroupAsStandard}
                                          <span title="${group.name} verlassen" class="leave-group">
                                               <i class="fa-solid fa-right-from-bracket"></i>
                                           </span>
                                        </section>
                                    </div>`;


                                })








                                groupSelect.innerHTML += `<option value="${groupId}">${group.name}<option>`;

                                if (groupData[groupId].write == true) {
                                    formGroupSelect.innerHTML += `<option value="${groupId}">${group.name}<option>`;
                                }



                            });
                            break;
                        case "array":
                            throw new Error("feature hasn't been implemented yet")
                            break;
                    }

                    getStandardGroup(userId).then(standardGroup => {

                        if (standardGroup) {
                            groupSelect.value = standardGroup;
                            groupSelect.dispatchEvent(new Event('change'));
                        }

                    })





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


                        roomFilterSelect.innerHTML += `<option value="${room.id}">${room.name}</option>`;


                    })



                    getRoomSchedule(groupSelect.value, userId).then(() => {

                        let roomFilter = document.getElementById("rooms-filter");

                        let timespanFilter = document.getElementById("timespan-filter");

                        roomFilterSelect.value = "null";


                        roomFilterSelect.addEventListener('change', () => {

                            filterScheduleByRoom(roomFilterSelect.value);
                            let resetRoomSpan = document.getElementById('reset-room-filter');
                            if (!resetRoomSpan && roomFilterSelect.value != "null") {

                                roomFilter.innerHTML += "<span id='reset-room-filter'><i class='fa-solid fa-xmark'></i></span>"
                                resetRoomSpan = document.getElementById('reset-room-filter');


                            }

                            resetRoomSpan.addEventListener('click', () => {
                                resetFilter("room");
                                roomFilterSelect.value = "null";
                                roomFilterSelect.dispatchEvent(new Event('change'))
                                resetRoomSpan.remove();

                            })

                        })




                        roomFilter.classList.remove('inactive');


                    })




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
                        formRoomSelect.innerHTML += `<option value="${room.id}">${room.name}</option>`;

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

                mutationObserver.observe(invitedUsersDiv, {
                    childList: true
                })

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

                memberMutationObserver.observe(peopleSelectResults, {
                    childList: true
                })

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

                    if (addRoomOccInputs.date.value &&
                        addRoomOccInputs.timeFrom.value &&
                        addRoomOccInputs.timeTo.value &&
                        addRoomOccInputs.targetGroup.value &&
                        addRoomOccInputs.date.value &&
                        addRoomOccInputs.targetRoom.value &&
                        addRoomOccInputs.title.value) {
                        addRoomOccupation(userId, addRoomOccInputs.title.value, addRoomOccInputs.targetGroup.value, addRoomOccInputs.targetRoom.value, addRoomOccInputs.date.value, [addRoomOccInputs.timeFrom.value, addRoomOccInputs.timeTo.value], invitedUsers, addRoomOccInputs.notes.value);

                    } else {
                        showNotification("form-not-completely-filled-out");
                    }
                })


            })

        })







        //deleteExpiredRoomOccupations();





        setGroupsAvailableAsStandard(settingsGroupDiv, document.getElementsByClassName("standardize-group"), userId).catch(error => console.log(error));
        setGroupsAvailableAsDestandadized(settingsGroupDiv, document.getElementsByClassName("destandardized-group"), userId).catch(error => console.log(error));


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
                clearRoomOccSpaces();
                getRoomSchedule(groupSelect.value, userId)
            }
        })



        let messengerConversationTabs = document.getElementById('messenger-tabs');
        let conversationsSection = document.getElementsByClassName('conversations')[0];

        getMessages(userId, messengerConversationTabs, conversationsSection)

        // send Message


        const addSendMessageEventListener = function (mutationsList, observer) {
            for (const mutation of mutationsList) {

                for (let index = 0; index < mutation.addedNodes.length; index++) {
                    let node = mutation.addedNodes[index];

                    if (node.classList && node.classList.contains("conversation")) {

                        let messageRecipientId = node.id.split("-")[1];
                        let sendMessageField = node.querySelector(".send-new-message")

                        sendMessageField.addEventListener("submit", (event) => {
                            event.preventDefault();

                            sendMessageField.classList.add("disabled")

                            setTimeout(() => {
                                sendMessage(userId, messageRecipientId, node.querySelector('textarea').value, new Date())
                                console.log("message sent");
                            }, 300)


                        })

                    }
                }

            }
        };

        const config = {
            childList: true
        };

        const observer = new MutationObserver(addSendMessageEventListener);

        observer.observe(conversationsSection, config)

        //get contacts

        getContacts(userId)


        let newConversationForm = document.getElementById('new-conversation-form');


        newConversationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let text = document.getElementById('message-text').value;
            let selectRecepientEl = components["custom-select"].find(selectEl => (selectEl.id == "select-receiver"))

            let messageRecipientId

            if (selectRecepientEl.selectedOption) {
                messageRecipientId = selectRecepientEl.selectedOption.option_id;
            }

            if (messageRecipientId && text && (!newConversationForm.classList.contains('disabled'))) {
                newConversationForm.classList.add('disabled');

                // Send the message after the delay
                setTimeout(() => {

                    alert("message sent")
                    sendMessage(userId, messageRecipientId, text, new Date())
                    document.getElementById('message-text').value = "";
                    //switch to the element of the newly sent message

                    // Re-enable the form after the delay
                    newConversationForm.classList.remove('disabled');


                }, 300);
            } else if (!messageRecipientId || !text) {
                alert('bitte alle Felder ausfüllen');
            }



        });


        let filterMenuToggle = document.getElementById('filter-menu-toggle');

        let filterMenuModal = document.getElementById("filter-menu");

        filterMenuToggle.addEventListener('change', () => {
            if (filterMenuToggle.checked) {
                filterMenuModal.show();
            } else {
                filterMenuModal.close();
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

        //this does not work
        setTimeout(document.querySelectorAll(".menu-chip").forEach(toggle => {
            console.log("Hello")
            toggle.addEventListener('click', () => {
                showNotificationByTemplate("Dieses Feature ist leider noch nicht verfügbar", "info")
            })
        }), 5000)

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