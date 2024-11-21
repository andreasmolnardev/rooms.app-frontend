const addSignatureBtn = document.getElementById('add-signature');
const addSignatureModal = document.getElementById('add-signature-modal');
const closeSignatureModalBtn = document.getElementById('close-signature-dialog')

const addRoomBtn = document.getElementById('add-room');
const addRoomModal = document.getElementById('add-room-modal');
const closeRoomModalBtn = document.getElementById('close-room-dialog')

const openContactModal = document.getElementById('open-contact-modal');
const contactModal = document.getElementById('feedback-modal')

openContactModal.addEventListener('click', () => {
    contactModal.showModal();
})

addSignatureBtn.addEventListener('click', () => {
    addSignatureModal.showModal();
})

closeSignatureModalBtn.addEventListener('click', () => {
    addSignatureModal.close();
})


addRoomBtn.addEventListener('click', () => {
    addRoomModal.showModal();
})

closeRoomModalBtn.addEventListener('click', () => {
    addRoomModal.close;
})

document.getElementsByClassName('close-modal').forEach(span => {

    span.addEventListener('click', () => {
        console.log(span.dataset.target)
        document.getElementById(span.dataset.target).close();
    })

});
