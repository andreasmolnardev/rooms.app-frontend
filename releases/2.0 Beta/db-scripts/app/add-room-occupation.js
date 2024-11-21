import { get, ref, database, update } from "../config.js"


export function addRoomOccupation() {


        const objId = crypto.randomUUID();

        let signatureSelectVal = document.getElementById('signatures').value;
        let roomsSelectVal = document.getElementById('rooms').value;
        let dateInputVal = document.getElementById('pick-date').value
        let timeFromInputVal = document.getElementById('time-from').value
        let timeToInputVal = document.getElementById('time-to').value
        let noteTextareaVal = document.getElementById('notes').value


        let overlapBool = false; // Initial auf false setzen

        roomOccCollection.find((object) => {
            const objectTimeFrom = object.timespan[0];
            const objectTimeTo = object.timespan[1];

            const isOverlapping = (
                (timeFromInputVal >= objectTimeFrom && timeFromInputVal <= objectTimeTo) || // Änderung der Bedingung
                (timeToInputVal >= objectTimeFrom && timeToInputVal <= objectTimeTo) ||     // Änderung der Bedingung
                (timeFromInputVal <= objectTimeFrom && timeToInputVal >= objectTimeTo)
            );

            if (object.room === roomsSelectVal && object.date === dateInputVal && isOverlapping) {
                overlapBool = true;
            }
        });

        if (overlapBool == true) {

            //Show overlapping message
            const overlapMsg = document.getElementById('room-occ-overlap');
            const overlapRoomSpan = document.getElementById('overlap-room-name')

            overlapMsg.style.display = "flex";
            overlapRoomSpan.innerText = document.getElementById('opt-' + document.getElementById('rooms').value).innerHTML;


        } else {
            roomOccCollection.push({
                id: objId,
                room: roomsSelectVal,
                signature: signatureSelectVal,
                date: dateInputVal,
                timespan: [timeFromInputVal, timeToInputVal],
                notes: noteTextareaVal
            });

            update(ref(database, 'users/' + userId + '/roomOccupations'), {
                roomOccupations: roomOccCollection
            });

            location.reload();
        }



}