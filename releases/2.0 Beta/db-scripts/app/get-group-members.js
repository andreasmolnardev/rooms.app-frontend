import { database, ref, get } from "../config.js";

export function getGroupMembers(groupId){

    return new Promise ((resolve, reject) => {
        let groupRef = ref(database, 'groups/' + groupId);

        get(groupRef).then((snapshot) => {
            let group = snapshot.val();
            resolve(group.members);
        })
    })

    
}