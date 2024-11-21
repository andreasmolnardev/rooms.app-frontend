import { get, ref, database, update } from "../config.js"
import { getRoomOccs } from "./get-room-schedule.js";


export function addRoomOccupation(userId, title, targetGroup, targetRoom, date, timespan, invitedUsers, notes) {


    const objId = crypto.randomUUID();



    let overlapBool = false; // Initial auf false setzen

    getRoomOccs(targetGroup).then(roomOccCollection => {
        if (roomOccCollection) {
            roomOccCollection.find((object) => {
                const objectTimeFrom = object.timespan[0];
                const objectTimeTo = object.timespan[1];

                const isOverlapping = (
                    (timespan[0] >= objectTimeFrom && timespan[0] <= objectTimeTo) || // Änderung der Bedingung
                    (timespan[1] >= objectTimeFrom && timespan[1] <= objectTimeTo) ||     // Änderung der Bedingung
                    (timespan[0] <= objectTimeFrom && timespan[1] >= objectTimeTo)
                );

                if (object.room === targetRoom && object.date === date && isOverlapping) {
                    overlapBool = true;
                }
            });
        } else {
            roomOccCollection = [];
        }

        

        if (overlapBool == true) {

            //Show overlapping message
            const overlapMsg = document.getElementById('room-occ-overlap');
            const overlapRoomSpan = document.getElementById('overlap-room-name')

            overlapMsg.style.display = "flex";
            overlapRoomSpan.innerText = document.getElementById('opt-' + document.getElementById('rooms').value).innerHTML;


        } else {
            roomOccCollection.push({
                id: objId,
                creator: userId,
                title: title,
                targetGroup: targetGroup,
                targetRoom: targetRoom,
                date: date,
                timespan: timespan,
                invitedUsers,
                notes: notes
            });

            update(ref(database, 'groups/' + targetGroup), {
                roomOccupations: roomOccCollection
            });

            location.reload();
        }

    })




}