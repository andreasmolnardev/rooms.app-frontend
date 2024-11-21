import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../config.js"

export const contactRequestRef = ref(database, 'contactRequests/');

export function getContactRequests() {
    return new Promise((resolve, reject) => {
        onValue(contactRequestRef, function (snapshot) {
            const data = snapshot.val();
            if (data) {
                let contactRequests = data;
                resolve(contactRequests);
            } else {
                resolve([]);
            }
        });
    });
}