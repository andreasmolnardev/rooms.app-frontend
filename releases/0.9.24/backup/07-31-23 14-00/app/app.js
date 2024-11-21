import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../db-scripts/config.js"
import { SwitchDesignPreference, ThemeGetter, ThemeSetter } from "../ui-scripts/darkmode.js";
import { DateToOutput, SetDate } from "../ui-scripts/dates.js";


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
                        resolve(["Noch keine Räume"]);
                    }
                })
            });
        }







        function addSignature(newSignature) {
            if (newSignature && newSignature !== "") {
                if (signatureArr && signatureArr[0] !== "Noch keine Signaturen") {
                    signatureArr.push(newSignature);
                } else {
                    signatureArr = [newSignature];
                }

                update(ref(database, 'users/' + userId + '/signatures'), {
                    signatures: signatureArr
                });
                location.reload();
            }
        }

        function addRoom(newRoom) {
            if (newRoom && newRoom !== "") {
                if (roomArr && roomArr[0] !== "Noch keine Räume") {
                    roomArr.push(newRoom);
                } else {
                    roomArr = [newRoom];
                }

                update(ref(database, 'users/' + userId + '/rooms'), {
                    rooms: roomArr
                });

                location.reload();
            }
        }

        let signatureArr = [];
        let roomArr = [];


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
                    signatureArr = signatures;
                } else {
                    // Wenn signatures kein Array ist, initialisiere signatureArr mit der einzelnen Signatur
                    signatureArr = [signatures];
                }
            } else {
                // Wenn keine Signaturen vorhanden sind, initialisiere signatureArr mit einem Platzhalter
                signatureArr = ["Noch keine Signaturen"];
            }
            signatureArr.forEach(signature => {
                document.getElementsByClassName('signatures')[0].innerHTML += `
                <div class="item signature-menu" id='${"signauters-" + signature}'>
                <a> <i class=""></i>${signature}</a>
                <i class="fa-solid fa-pen-to-square" id="${signature + "-change"}"></i>
            </div>
                `
            });
        })




        getRooms().then((rooms) => {
            if (rooms) {
                // Überprüfen, ob rooms ein Array ist
                if (Array.isArray(rooms)) {
                    roomArr = rooms;
                } else {
                    // Wenn rooms kein Array ist, initialisiere signatureArr mit der einzelnen Signatur
                    roomArr = [rooms];
                }
            }


            roomArr.forEach(room => {
                document.getElementsByClassName('rooms')[0].innerHTML += `
                <div class="item room-menu" id='${"rooms-" + room}'>
                <a> <i class=""></i>${room}</a>
                <i class="fa-solid fa-pen-to-square" id="${room + "-change"}"></i>
            </div>
                `

                console.log(room)
                document.getElementById('rooms-div').innerHTML += `
                <div class="room">
                <h3 class="room-name">${room}</h3>
                <p class="room-occ">Keine Besetzungen</p>
            </div>
                `
            });
        })

        document.getElementById('submit-signature').addEventListener('click', () => {
            const newSignature = document.getElementById('new-signature').value;
            addSignature(newSignature);
        });

        document.getElementById('submit-room').addEventListener('click', () => {
            const newRoom = document.getElementById('new-room').value;
            addRoom(newRoom);
        });

        const selectThemeField = document.getElementById('select-theme');

        selectThemeField.addEventListener('click', () => {
            ThemeSetter()
        })

        const selectAccentCl = document.getElementById("select-accent-color");

        selectAccentCl.addEventListener('change', (val) => {
            document.querySelector(':root').style.setProperty('--accent-color', selectAccentCl.value)

        })

        onValue(initialStartupRef, function (snapshot) {
            const initial_startup_bool = snapshot.val();


            if (initial_startup_bool == true) {
                document.getElementById('increase-tab-index')
                const closeTutorialBtn = document.getElementsByClassName('close-tutorial')[0];


                initialStartupModal.showModal();
                closeTutorialBtn.addEventListener('click', () => {
                    initialStartupModal.close();
                })

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


