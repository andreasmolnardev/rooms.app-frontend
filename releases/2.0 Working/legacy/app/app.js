import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../db-scripts/config.js"
import { SwitchDesignPreference, ThemeGetter, ThemeSetter } from "../ui-scripts/darkmode.js";
import { DateToOutput } from "../ui-scripts/dates.js";
import { addModal, openAddModal } from "./modals.js";
import { AccentClGetter, AccentClSetter } from "../ui-scripts/accent-cl.js";
import { getUsers } from "../db-scripts/auth/get-email.js";






function checkUserAuthentication() {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // Unsubscribe vom onAuthStateChanged-Ereignis, sobald es ausgelöst wurde
            resolve(user); // Das Promise mit dem user-Wert auflösen
        });
    });
}



checkUserAuthentication().then((user) => {
    if (user) {
        // Benutzer ist angemeldet

        var userAgent = navigator.userAgent;

        if (userAgent.includes("Firefox")) {
            console.log("FF")
        } else {
            console.log("nicht ff")
        }


        ThemeGetter();

        const userId = user.uid;

        const date = new Date();


        //References
        const usernameRef = ref(database, 'users/' + userId + '/username');
        const signatureRef = ref(database, 'users/' + userId + '/signatures');
        const roomRef = ref(database, 'users/' + userId + '/rooms')
        const RoomOccRef = ref(database, 'users/' + userId + '/roomOccupations')




        function ExpandSetting(element) {

            let targetClass = document.getElementById(element).dataset.target;
            let items = document.getElementsByClassName(targetClass);
            for (let i = 0; i < items.length; i++) {
                items.item(i).classList.toggle('expanded')
            }
        }



        DateToOutput(date);




        function getSignatures() {
            return new Promise((resolve, reject) => {
                onValue(signatureRef, function (snapshot) {
                    const data = snapshot.val();
                    if (data && data.signatures) {
                        let signatures = Object.values(data.signatures);
                        resolve(signatures);
                    } else {
                        resolve([]);
                    }
                });
            });
        }

        function getSignatureNameById(signatureId) {
            let signatureName;
            return new Promise((resolve, reject) => {
                getSignatures().then((signatures) => {
                    signatureName = signatures.find(object => object.id === signatureId).name;
                    resolve(signatureName)
                }).catch((error) => {
                    alert('Es ist ein Fehler aufgetreten, die Seite wird jetzt neu geladen');
                    location.reload();
                }
                )

            })


        }



        function getRooms() {
            return new Promise((resolve, reject) => {
                onValue(roomRef, function (snapshot) {
                    const data = snapshot.val();
                    if (data && data.rooms) {
                        let rooms = Object.values(data.rooms);
                        resolve(rooms);
                    } else {
                        resolve([]);
                    }
                });
            });
        }


        function getRoomOccs() {
            return new Promise((resolve, reject) => {
                onValue(ref(database, 'users/' + userId + '/roomOccupations'), function (snapshot) {
                    const data = snapshot.val();
                    resolve(data)
                });
            });
        }


        function addObj(type, newObj) {
            if (newObj && newObj !== "") {
                const objId = crypto.randomUUID(); // Zufällige ID generieren
                const newValLabel = document.getElementById('new-value-label')
                if (type == "signature") {
let signatureNameAlreadyTaken;
                    signatureObjCollection.find((object) => {
                        if (object.name == newObj) {
                           signatureNameAlreadyTaken = true;
                        } else {
                            signatureNameAlreadyTaken = false;
                           
                        }
                        if(signatureNameAlreadyTaken == false){
                           
                             signatureObjCollection.push({ id: objId, name: newObj });
                            update(ref(database, 'users/' + userId + '/signatures'), {
                                signatures: signatureObjCollection
                            });
                            location.reload();

                        } else {
                             alert('Diese Signatur ist bereits vorhanden')
                        }
                    })

                } else if (type == "room") {
                    var roomNameAlreadyTaken;
                     roomObjCollection.find((object) => {
                        if (object.name == newObj) {
                            roomNameAlreadyTaken = true
                        } else {
                            roomNameAlreadyTaken = false
                        }
                    })
                        if (roomNameAlreadyTaken == false) {
                          
                             roomObjCollection.push({ id: objId, name: newObj });
                            update(ref(database, 'users/' + userId + '/rooms'), {
                                rooms: roomObjCollection
                            });
                            location.reload();
                         
                        } else {
                            alert('Dieser Raum ist bereits vorhanden')
                        }
                  
                    


                } else {
                    let signatureSelectVal = document.getElementById('signatures').value;
                    let roomsSelectVal = document.getElementById('rooms').value;
                    let dateInputVal = document.getElementById('pick-date').value
                    let timeFromInputVal = document.getElementById('time-from').value
                    let timeToInputVal = document.getElementById('time-to').value
                    let noteTextareaVal = document.getElementById('notes').value


                    let overlapBool = false; // Initial auf false setzen

                    roomOccCollection.find((object) => {
                        const objectTimeFrom = object.timespan[0];
                        const objectTimeTo = object.timespan[1];

                        const isOverlapping = (
                            (timeFromInputVal >= objectTimeFrom && timeFromInputVal <= objectTimeTo) || // Änderung der Bedingung
                            (timeToInputVal >= objectTimeFrom && timeToInputVal <= objectTimeTo) ||     // Änderung der Bedingung
                            (timeFromInputVal <= objectTimeFrom && timeToInputVal >= objectTimeTo)
                        );

                        if (object.room === roomsSelectVal && object.date === dateInputVal && isOverlapping) {
                            overlapBool = true; // Nur hier auf true setzen, wenn ein überlappendes Objekt gefunden wurde
                        }
                    });

                    if (overlapBool == true) {

                        //Show overlapping message
                        const overlapMsg = document.getElementById('room-occ-overlap');
                        const overlapRoomSpan = document.getElementById('overlap-room-name')

                        overlapMsg.style.display = "flex";
                        overlapRoomSpan.innerText = document.getElementById('opt-' + document.getElementById('rooms').value).innerHTML;


                    } else {
                        roomOccCollection.push({
                            id: objId,
                            room: roomsSelectVal,
                            signature: signatureSelectVal,
                            date: dateInputVal,
                            timespan: [timeFromInputVal, timeToInputVal],
                            notes: noteTextareaVal
                        });

                        update(ref(database, 'users/' + userId + '/roomOccupations'), {
                            roomOccupations: roomOccCollection
                        });

                        location.reload();
                    }



                }



            }
        }



        function deleteExpiredRoomOccupations() {
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // Berechnung von vor 10 Tagen

            getRoomOccs().then((roomOccs) => {
                const roomOccupations = roomOccs.roomOccupations;

                const updatedRoomOccupations = roomOccupations.filter((roomOcc) => {
                    const roomOccDate = new Date(roomOcc.date);
                    return roomOccDate >= tenDaysAgo; // Nur behalten, wenn das Datum >= 10 Tage zurückliegt
                });

                update(ref(database, 'users/' + userId + '/roomOccupations'), {
                    roomOccupations: updatedRoomOccupations
                });
            });
        }

        function renameSignature(signatureId, newName) {
            const signatureIndex = signatureObjCollection.findIndex(sig => sig.id === signatureId);
            if (signatureIndex !== -1) {
                signatureObjCollection[signatureIndex].name = newName;
                update(ref(database, 'users/' + userId + '/signatures'), {
                    signatures: signatureObjCollection
                });
                location.reload();
            }
        }

        function deleteSignature(signatureId) {
            signatureObjCollection = signatureObjCollection.filter(sig => sig.id !== signatureId);
            update(ref(database, 'users/' + userId + '/signatures'), {
                signatures: signatureObjCollection
            });
            location.reload();
        }


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



        let signatureObjCollection = [];
        let roomObjCollection = [];
        let roomOccCollection = [];



        const signatureExpand = document.getElementById("expand-signatures");
        const roomExpand = document.getElementById("expand-rooms");
        const dataExpand = document.getElementById("expand-data");
        const changeUsernameBtn = document.getElementById('change-username-btn');
        const usernameModal = document.getElementById('change-username-modal');


        changeUsernameBtn.addEventListener('click', () => {
            usernameModal.showModal();

        })

        signatureExpand.addEventListener('click', () => {

            ExpandSetting('expand-signatures');
            signatureExpand.classList.toggle('active')
        })

        roomExpand.addEventListener('click', () => {
            ExpandSetting('expand-rooms')
            roomExpand.classList.toggle('active')
        })

        dataExpand.addEventListener('click', () => {
            ExpandSetting('expand-data')
            dataExpand.classList.toggle('active')
        })




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




        document.getElementById('upgrade-username').addEventListener('submit', (e) => {
            e.preventDefault();

            let newUsername = document.getElementById('new-username').value;
            let usernameInUse;

            getUsers().then((users) => {
                usernameInUse = Object.values(users).find(object => object.username === newUsername)
                if (newUsername != "" && !usernameInUse) {
                    update(ref(database, 'users/' + user.uid), {
                        username: newUsername
                    });
                    usernameModal.close();
                } else if (usernameInUse) {
                    document.getElementById('error-message').style.display = "flex";
                    document.getElementById('output-txt').innerText = "der Benutzername ist bereits vergeben";
                }

            })


        })

        getSignatures().then((signatures) => {
            if (signatures) {
                // Überprüfen, ob signatures ein Array ist
                if (Array.isArray(signatures)) {
                    signatureObjCollection = signatures;
                } else {
                    // Wenn signatures kein Array ist, initialisiere signatureObjCollection mit der einzelnen Signatur
                    signatureObjCollection = [signatures];
                }
            } else {
                // Wenn keine Signaturen vorhanden sind, initialisiere signatureObjCollection mit einem Platzhalter
                signatureObjCollection = ["Noch keine Signaturen"];
            }

            signatureObjCollection.forEach(signature => {

                document.getElementsByClassName('signatures')[0].innerHTML += `
                    <div class="item signature-menu" id='${"signatures-" + signature.id}'>
                        <a> <i class=""></i>${signature.name}</a>
                        <i class="fa-solid fa-pen-to-square" id="${signature.id + "-change"}"></i>
                    </div>
                `;

                document.getElementById('signatures').innerHTML += `
                    <option value="${signature.id}">${signature.name}</option>
                `

                const signatureChangeBtn = document.getElementById(signature.id + "-change");
                signatureChangeBtn.addEventListener('click', () => {

                    const newName = prompt("Bitte geben Sie den neuen Namen für die Signatur ein:");
                    if (newName !== null) {
                        renameSignature(signature.id, newName);
                    }
                });
            });



        })




        getRooms().then((rooms) => {
            if (rooms && rooms.length > 0) {


                roomObjCollection = rooms;

                roomObjCollection.forEach(room => {
                    document.getElementsByClassName('rooms')[0].innerHTML += `
                   <div class="item room-menu" id='${"rooms-" + room.id}'>
                     <a> <i class=""></i>${room.name}</a>
                 <i class="fa-solid fa-pen-to-square" id="${room.id + "-change"}"></i>
               </div>`;

                    document.getElementById('rooms-div').innerHTML += `
               <div class="room" data-name="${room.id}">
               <h3 class="room-name" id="${'room-name' + room.id}">${room.name}</h3>
               <p class="room-occ-space" >Keine Besetzungen</p>
                 </div>
               `;

                    document.getElementById('rooms').innerHTML += `
               <option value="${room.id}" id="opt-${room.id}">${room.name}</option>
           `

                    const roomChangeBtn = document.getElementById(room.id + "-change");
                    roomChangeBtn.addEventListener('click', () => {
                        const newName = prompt("Bitte geben Sie den neuen Namen für den Raum ein:");
                        if (newName !== null) {
                            renameRoom(room.id, newName);
                        }
                    });




                })


            } else {
                document.getElementById('rooms-div').style.textAlign = "center";
                document.getElementById('rooms-div').innerHTML = "Noch keine Räume";
            }





        });


        function LoadRoomOccs() {


            getRoomOccs().then((roomOccs) => {
                let roomOccSpaces = document.getElementsByClassName('room-occ-space');


                roomOccCollection = roomOccs.roomOccupations;

                roomOccCollection.sort((a, b) => {
                    const timeA = a.timespan[0];
                    const timeB = b.timespan[0];
                    return timeA.localeCompare(timeB);
                });

                let globalDate = document.getElementById('date-output').dataset.date;

                roomOccCollection.forEach(roomOccupation => {



                    for (let i = 0; i < roomOccSpaces.length; i++) { // for each Room Occ Space


                        if (roomOccSpaces[i].parentElement.dataset.name == roomOccupation.room &&
                            globalDate == roomOccupation.date
                        ) {

                            getSignatureNameById(roomOccupation.signature).then((signatureName) => {
                                if (roomOccSpaces[i].innerHTML == "Keine Besetzungen") {
                                    roomOccSpaces[i].innerHTML = ` <div class="room-occupation">
                                    ${roomOccupation.timespan[0]} bis ${roomOccupation.timespan[1]} : ${signatureName}  <br> ${roomOccupation.notes} </div>
                                    `


                                } else {
                                    roomOccSpaces[i].innerHTML += ` <div class="room-occupation">
                                    ${roomOccupation.timespan[0]} bis ${roomOccupation.timespan[1]} : ${signatureName}  <br> ${roomOccupation.notes} </div>
                                    `;
                                }
                            })

                        }
                    }

                });



            })




        }

        deleteExpiredRoomOccupations();

        LoadRoomOccs();

      
        document.getElementById('add-form').addEventListener('submit', () => {


            const newVal = document.getElementById('new-value').value;
            if (addModal.dataset.purpose == "signature") {
              
                addObj("signature", newVal);
            } else {
               
                addObj("room", newVal);
            }


        });






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

        submitDate.addEventListener('click', () => {
            if (dateInput.value != "") {
                DateToOutput(dateInput.value);
                LoadRoomOccs()
            }
        })


        const addRoomOccButton = document.getElementById('add-room-occ');
        const addRoomOccForm = document.getElementById('new-room-occ-form');

        addRoomOccForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addObj("roomOcc", "newObj");
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
                // Erfolgreich abgemeldet.
                window.location.replace("/index.html");
            }).catch((error) => {
                console.log(error);
                // Ein Fehler ist aufgetreten.
            });
        })


    } else {
        // Benutzer ist nicht angemeldet

        const backToLoginModal = document.getElementById('first-login-modal');
        backToLoginModal.showModal();
        setTimeout(() => {
            location.replace("../");
        }, 2500)

        // Weiterleitung zur Anmeldeseite oder Anzeige einer Fehlermeldung
    }
});


