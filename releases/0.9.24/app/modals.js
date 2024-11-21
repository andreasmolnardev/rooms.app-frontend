const addModal = document.getElementById('add-modal');
let addModalTitle = document.getElementById('add-modal-title');
const closeAddModalBtn = document.getElementById('close-value-dialog');


const addSignatureBtn = document.getElementById('add-signature');

const addRoomBtn = document.getElementById('add-room');

 function openAddModal (type){
    if (type == "signature"){
        addModalTitle.innerText = "Signatur hinzufügen"
    } else {
        addModalTitle.innerText = "Raum hinzufügen"
    }

    addModal.showModal();
    
}

addSignatureBtn.addEventListener('click', () => {
    addModal.dataset.purpose = "signature"
   openAddModal('signature');
})



addRoomBtn.addEventListener('click', () => {
    addModal.dataset.purpose = "room"
    openAddModal('room');
})

closeAddModalBtn.addEventListener('click', ()=>{
    addModal.close();
})




const openContactModal = document.getElementById('open-contact-modal');
const contactModal = document.getElementById('feedback-modal')

const addRoomOccModalBtn = document.getElementsByClassName('add-btn')[0];
const addRoomOccModal = document.getElementById('new-room-occ');

addRoomOccModalBtn.addEventListener('click', () => {
    addRoomOccModal.showModal();
});

openContactModal.addEventListener('click', () => {
    contactModal.showModal();
})

const openDateModal = document.getElementById('open-date-modal')
const selectDateModal = document.getElementById('select-date-modal');


openDateModal.addEventListener('click', ()=>{
    selectDateModal.showModal();
})

const closeModalSpan = document.getElementsByClassName('close-modal');

for(let i = 0; i < closeModalSpan.length; i++){
    console.log(closeModalSpan[i])
    closeModalSpan[i].addEventListener('click', () => {
        console.log(closeModalSpan[i].dataset.target)
        document.getElementById(closeModalSpan[i].dataset.target).close();
    })
}


export {openAddModal, addModal};