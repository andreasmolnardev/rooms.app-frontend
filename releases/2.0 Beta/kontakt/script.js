import { newContactRequest } from "../db-scripts/contact-requests/new-request.js";   
 const requestForm = document.getElementById('request-form');
    const nameInput = document.getElementById('request-name');
    const emailInput = document.getElementById('request-email');
    const titleInput = document.getElementById('request-title');
    let publishCheckbox = document.getElementById('publish-checkbox');
    const textarea = document.getElementById('request-text');


    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (textarea.value != "" && nameInput.value != "" && titleInput.value != "" && emailInput.value != "") {
            console.log(publishCheckbox)
            newContactRequest(
                nameInput.value,
                emailInput.value,
                titleInput.value,
                textarea.value,
                new Date(),
                publishCheckbox.checked
            )
        }
    })


    textarea.addEventListener('keyup', () => {
        document.getElementById('textarea-length').innerText = textarea.value.length

    })