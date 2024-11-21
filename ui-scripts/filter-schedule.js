let totalRooms = document.getElementsByClassName('rooms');


export function filterScheduleByRoom(roomId){

    for (let index = 0; index < totalRooms.length; index++) {
        const room = totalRooms[index];
        
        if (room.dataset.name == roomId) {
            room.style.display = "subgrid";
        } else {
            room.style.display = "none";
            
        }
    }

}

export function resetFilter(type){
    if(type == "room"){
        for (let index = 0; index < totalRooms.length; index++) {
            const room = totalRooms[index];
            
            room.style.display = "subgrid";
        }
    }
}