import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../config.js"

const usersRef = ref(database, 'users/')

export function  getUsers() {
    return  new Promise((resolve, reject) => {
        onValue(usersRef, function (snapshot) {


            resolve(snapshot.val())

        }, (error) => {
            resolve("");
        })
    })
}

export function getEmailByUsername(username) {
    return new Promise((resolve, reject) => {
        getUsers().then((users) => {

            let findEmail = Object.values(users).find(object => object.username === username);
            if (findEmail) {
                resolve(findEmail.email);
            } else {
                reject("Benutzername nicht vorhanden");
            }

        })
    });

}