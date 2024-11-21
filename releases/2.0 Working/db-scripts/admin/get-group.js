import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "..//config.js"


export function getGroup(database, userId, groupRef){

        

        return new Promise((resolve, reject) => {
            onValue(groupRef, function (snapshot) {
                
                let data = snapshot.val();
              
                if (data) {
                    resolve(data);
                } else {
                    reject("Keine Raumgruppe gefunden");
                }
            });
        });
}