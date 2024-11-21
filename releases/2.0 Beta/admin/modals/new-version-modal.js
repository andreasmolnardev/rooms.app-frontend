import { addToVersion } from "../../db-scripts/versions/add-to-version.js";

const openVersionModal = document.getElementById('open-version-modal');

const submitVersionModal = document.getElementById('submit-version-modal');

openVersionModal.addEventListener('click', () =>{
    submitVersionModal.showModal();
})



