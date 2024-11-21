import { get, ref, database, update } from "../config.js"

export function getRooms(groupId) {

    const roomRef = ref(database, 'groups/' + groupId + '/rooms')
    

    return new Promise((resolve, reject) => {

        get(roomRef).then(snapshot => {
            const rooms = snapshot.val();


            if (rooms) {
                resolve(rooms);
            } else {
                resolve([]);
            }
        })

     
    });
}