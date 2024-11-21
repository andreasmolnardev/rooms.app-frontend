//filter by rooom

export function filterByRoom(roomId) {
    let totalAvailableRooms = document.getElementsByClassName("rooms");

    for (let index = 0; index < totalAvailableRooms.length; index++) {
        const room = totalAvailableRooms[index];
        if (room.dataset.name == roomId) {
            room.style.display = "subgrid";
        } else {
            room.style.display = "none";
        }
    }
}

//filter by timespan

export function resetFilter() {

}