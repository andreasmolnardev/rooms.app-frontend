import { CheckLogin, PrepareErrorHandling, app, database, auth, dt, onAuthStateChanged, initializeApp, getDatabase, set, ref, update, onValue, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "../config.js"
import { getContactRequests, contactRequestRef } from "./get-requests.js";



export function newContactRequest(name, email,title,  text, date, allowsPublish) {
    getContactRequests().then((requests)=>{
        requests.push(
            {
                "name": name,
                "email": email,
                "title": title,
                "text": text,
                "date": date,
                "allowsPublish": allowsPublish
            }
        )
        update(ref(database), {
            contactRequests: requests
        })
    }) 
}