import { showComboModal } from "./open-info-add-modal.js";

export function openModal(modal, callback) {
    if (modal) {
        modal.showModal();
        callback();
    }
}

const closeModalSpan = document.getElementsByClassName('close-modal');

for(let i = 0; i < closeModalSpan.length; i++){
   
    closeModalSpan[i].addEventListener('click', () => {
        document.getElementById(closeModalSpan[i].dataset.target).close();
    })
}

const topBarCheckboxes = document.getElementsByName('top-bar');

for (let index = 0; index < topBarCheckboxes.length; index++) {
    const checkbox = topBarCheckboxes[index];
    
    checkbox.addEventListener('change', () => {
        if(checkbox.checked == true){
            document.getElementById(checkbox.dataset.target).showModal();
        } else if(checkbox.checked == false){
            document.getElementById(checkbox.dataset.target).close();
        }
    })
}


const addMembersButton = document.getElementById("add-members-button");
const addRoomButton = document.getElementById("add-room-button")
const createUsergroupButton = document.getElementById("create-usergroup-button")

addMembersButton.addEventListener("click", () => {showComboModal("add", "member")})
addRoomButton.addEventListener("click", () => {showComboModal("add", "room")});
createUsergroupButton.addEventListener("click", () => {showComboModal("add", "user-group")});
