import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../config.js"



export function getSignatures(userId) {

    const signatureRef = ref(database, 'users/' + userId + '/signatures');


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
