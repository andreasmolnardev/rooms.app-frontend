import { get, ref, database, update } from "../config.js"


export function getRoomOccs(groupId) {
    return new Promise((resolve, reject) => {

        get(ref(database, 'groups/' + groupId + '/roomOccupations')).then(snapshot => {
            const data = snapshot.val();
            resolve(data)
        })
    });
}

export function getRoomSchedule(groupId) {


    getRoomOccs(groupId).then((roomOccs) => {
        let roomOccSpaces = document.getElementsByClassName('room-occ-space');


        roomOccCollection = roomOccs.roomOccupations;

        roomOccCollection.sort((a, b) => {
            const timeA = a.timespan[0];
            const timeB = b.timespan[0];
            return timeA.localeCompare(timeB);
        });

        let globalDate = document.getElementById('date-output').dataset.date;

        roomOccCollection.forEach(roomOccupation => {



            for (let i = 0; i < roomOccSpaces.length; i++) { // for each Room Occ Space


                if (roomOccSpaces[i].parentElement.dataset.name == roomOccupation.room &&
                    globalDate == roomOccupation.date
                ) {

                    getSignatureNameById(roomOccupation.signature).then((signatureName) => {
                        if (roomOccSpaces[i].innerHTML == "Keine Besetzungen") {
                            roomOccSpaces[i].innerHTML = ` <div class="room-occupation">
                            ${roomOccupation.timespan[0]} bis ${roomOccupation.timespan[1]} : ${signatureName}  <br> ${roomOccupation.notes} </div>
                            `


                        } else {
                            roomOccSpaces[i].innerHTML += ` <div class="room-occupation">
                            ${roomOccupation.timespan[0]} bis ${roomOccupation.timespan[1]} : ${signatureName}  <br> ${roomOccupation.notes} </div>
                            `;
                        }
                    })

                }
            }

        });



    })




}