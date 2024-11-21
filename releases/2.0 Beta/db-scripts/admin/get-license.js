import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "..//config.js"


export function getAdminLicense(database, userId, licenseRef){

        

        return new Promise((resolve, reject) => {
            onValue(licenseRef, function (snapshot) {
                
                let data = snapshot.val();
              
                if (data != false) {
                    resolve(data);
                } else {
                    reject("Keine gültige Lizenz");
                }
            });
        });
}