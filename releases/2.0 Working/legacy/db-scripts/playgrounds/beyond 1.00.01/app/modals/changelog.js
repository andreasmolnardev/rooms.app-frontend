import {app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "../../db-scripts/config.js"
import { compareVersion } from "../../db-scripts/versions/compare-versions.js";

//Modal and children
const changelogModal = document.getElementById('changelog-modal');
const changesList = document.getElementById('changes-ul');
const localVersionDiv = document.getElementById('version-local');
const databaseVersionDiv = document.getElementById('version-database');


//Stored elements
let localVersion = localStorage.getItem('room-organizer-version');

const databaseVersionRef = ref(database, 'appInfo/version');



onValue(databaseVersionRef, function (snapshot) {
    let versionData = snapshot.val();
    let latestVersionData =  versionData[versionData.length -1]
    let version = latestVersionData.versionNumber
    console.log(version)
    if (compareVersion(version, localVersion) == -1) {
        if (localVersion) {
            localVersionDiv.innerText = localVersion;
        }

        console.log(latestVersionData.features)
        latestVersionData.features.forEach(change => {
            changesList.innerHTML += `<li>${change}</li>`
        });
        databaseVersionDiv.innerText = version;
        
        changelogModal.showModal();
        localStorage.setItem('room-organizer-version', version)
        
    }
});

