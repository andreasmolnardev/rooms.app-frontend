import { get, ref, database, update } from "../config.js"
import { getUser } from "./get-username.js";

export function getGroups(userId) {
    return new Promise((resolve, reject) => {
        get(ref(database, 'users/' + userId + '/groups')).then((snapshot) => {
            let groupData = snapshot.val();

            resolve(groupData);
        }).catch((error) => {
          reject(error.message);
        })
    })

    
}


export function getGroupFromDbSegmentById (groupId){
    return new Promise ((resolve, reject) => {
        get(ref(database, 'groups/' + groupId)).then(snapshot => {
            let group = snapshot.val();
            resolve(group);
        })
    })
}

export async function returnAdmin(adminId){
    let user = await getUser(adminId);
        return(user)
        
    
   
}