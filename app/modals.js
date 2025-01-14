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

function addCloseEventListener(element) {
    element.addEventListener('click', () => {
        document.getElementById(element.dataset.target).close();
        if (element.dataset.target == "changelog-modal") {
        document.getElementById(element.dataset.target).classList.add("hidden");
        }
    });
}

function handleAddedNodes(nodes) {
    nodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList.contains('close-modal')) {
                addCloseEventListener(node);
            }

            const closeModalElements = node.getElementsByClassName('close-modal');
            for (let i = 0; i < closeModalElements.length; i++) {
                addCloseEventListener(closeModalElements[i]);
            }
        }
    });
}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            handleAddedNodes(mutation.addedNodes);
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

const closeModalSpans = document.getElementsByClassName('close-modal');
for (let i = 0; i < closeModalSpans.length; i++) {
    addCloseEventListener(closeModalSpans[i]);
}
