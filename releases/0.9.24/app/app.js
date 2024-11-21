import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../db-scripts/config.js"
import { SwitchDesignPreference, ThemeGetter, ThemeSetter } from "../ui-scripts/darkmode.js";
import { DateToOutput, SetDate } from "../ui-scripts/dates.js";
import { addModal, openAddModal } from "./modals.js";
import { AccentClGetter, AccentClSetter } from "../ui-scripts/accent-cl.js";


let RoomOccupationArr = [];





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

        ThemeGetter();

        const userId = user.uid;

        const date = new Date();


        //References
        const usernameRef = ref(database, 'users/' + userId + '/username');
        const signatureRef = ref(database, 'users/' + userId + '/signatures');
        const roomRef = ref(database, 'users/' + userId + '/rooms')





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




        function addObj(type, newObj) {
            if (newObj && newObj !== "") {
                const objId = crypto.randomUUID(); // Zufällige ID generieren
                if (type == "signature") {
                    signatureObjCollection.push({ id: objId, name: newObj });
                    update(ref(database, 'users/' + userId + '/signatures'), {
                        signatures: signatureObjCollection
                    });
                } else {
                    roomObjCollection.push({ id: objId, name: newObj });
                    update(ref(database, 'users/' + userId + '/rooms'), {
                        rooms: roomObjCollection
                    });
                }

                location.reload();
            }
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

        function addRoom(newRoom) {
            if (newRoom && newRoom !== "") {
                const roomId = crypto.randomUUID(); // Zufällige ID generieren
                roomObjCollection.push({ id: roomId, name: newRoom });
                update(ref(database, 'users/' + userId + '/rooms'), {
                    rooms: roomObjCollection
                });
                location.reload();
            }
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


        const signatureExpand = document.getElementById("expand-signatures");
        const roomExpand = document.getElementById("expand-rooms");
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

        document.getElementById('upgrade-username').addEventListener('click', () => {
            let newUsername = document.getElementById('new-username').value;
            if (newUsername != "") {
                update(ref(database, 'users/' + user.uid), {
                    username: newUsername
                });
                usernameModal.close();
            }
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
               <div class="room">
               <h3 class="room-name" id="${'room-name' + room.id}">${room.name}</h3>
               <p class="room-occ-space" >Keine Besetzungen</p>
                 </div>
               `;

               document.getElementById('rooms').innerHTML += `
               <option value="${room.id}">${room.name}</option>
           `
                })


            } else {
                document.getElementById('rooms-div').style.textAlign = "center";
                document.getElementById('rooms-div').innerHTML = "Noch keine Räume";
            }





        });

        document.getElementById('submit-value').addEventListener('click', () => {


            const newVal = document.getElementById('new-value').value;
            if (addModal.dataset.purpose == "signature") {
                addObj("signature", newVal);
            } else {
                 addObj("room", newVal);
            }
            
           
        });

       
        // Event Listener für Signaturen
        signatureObjCollection.forEach(signature => {
            const signatureChangeBtn = document.getElementById(signature.id + "-change");
            signatureChangeBtn.addEventListener('click', () => {
               
                const newName = prompt("Bitte geben Sie den neuen Namen für die Signatur ein:");
                if (newName !== null) {
                    renameSignature(signature.id, newName);
                }
            });
        });

        // Event Listener für Räume
        roomObjCollection.forEach(room => {
            const roomChangeBtn = document.getElementById(room.id + "-change");
            roomChangeBtn.addEventListener('click', () => {
                const newName = prompt("Bitte geben Sie den neuen Namen für den Raum ein:");
                if (newName !== null) {
                    renameRoom(room.id, newName);
                }
            });
        });

        const selectThemeField = document.getElementById('select-theme');

        selectThemeField.addEventListener('click', () => {
            ThemeSetter()
        })

        const selectAccentCl = document.getElementById("select-accent-color");

        const accentCl = AccentClGetter();

        if (accentCl && accentCl != ""){

            document.querySelector(':root').style.setProperty('--accent-color', accentCl)
            selectAccentCl.value = accentCl;

        }

   
        selectAccentCl.addEventListener('change', (val) => {
            document.querySelector(':root').style.setProperty('--accent-color', selectAccentCl.value);
            AccentClSetter(selectAccentCl.value);
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


