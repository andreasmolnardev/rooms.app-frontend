import { get, ref, database, update } from "../config.js"



export function getUser(userId){
    return new Promise((resolve, reject) => {
        get(ref(database, 'users/' + userId)).then((snapshot) => {
            let user = snapshot.val();
            resolve(user);
        }).catch((error) => {
            console.log(error)
            reject("Error: User not found");
        })
    })
}