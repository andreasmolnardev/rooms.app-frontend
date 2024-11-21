
function deleteExpiredRoomOccupations() {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); // Berechnung von vor 10 Tagen

    getRoomOccs().then((roomOccs) => {
        const roomOccupations = roomOccs.roomOccupations;

        const updatedRoomOccupations = roomOccupations.filter((roomOcc) => {
            const roomOccDate = new Date(roomOcc.date);
            return roomOccDate >= tenDaysAgo; // Nur behalten, wenn das Datum >= 10 Tage zurückliegt
        });

        update(ref(database, 'users/' + userId + '/roomOccupations'), {
            roomOccupations: updatedRoomOccupations
        });
    });
}
