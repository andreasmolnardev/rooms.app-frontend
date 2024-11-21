const addModal = document.getElementById('add-modal');
let addModalTitle = document.getElementById('add-modal-title');
const closeAddModalBtn = document.getElementById('close-value-dialog');
const newValLabel = document.getElementById('new-value-label');

const addSignatureBtn = document.getElementById('add-signature')

const addRoomBtn = document.getElementById('add-room');

 





const contactModal = document.getElementById('feedback-modal')

const addRoomOccModalBtn = document.getElementsByClassName('add-btn')[0];
const addRoomOccModal = document.getElementById('new-room-occ');

addRoomOccModalBtn.addEventListener('click', () => {
    addRoomOccModal.showModal();
});





const offlineModal = document.getElementById('offline-modal');

window.addEventListener('online', () => {
    offlineModal.close();
});

window.addEventListener('offline', () => {
    offlineModal.showModal();
});

const closeModalSpan = document.getElementsByClassName('close-modal');

for(let i = 0; i < closeModalSpan.length; i++){
   
    closeModalSpan[i].addEventListener('click', () => {
        document.getElementById(closeModalSpan[i].dataset.target).close();
    })
}

