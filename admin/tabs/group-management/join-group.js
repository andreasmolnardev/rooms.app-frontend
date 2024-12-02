import { sendAdminWsMessage } from "../../../scripts/api/websocket-connection.js";
import { showNotification } from "../../../ui-scripts/notifications/notifications.js";

let uploadInvitationFileBtn = document.getElementById('upload-invitation-text');
let pasteInvitationTextBtn = document.getElementById('paste-invitation-text');

let codeInput = document.getElementById("code-input")
let pinInput = document.getElementById("pin-code-input")

pasteInvitationTextBtn.addEventListener('click', () => {
    pasteInvitationText().then((text) => {
       fillInvitationFormOut(text);
    })
})

let fileUploadInput = document.getElementById('invitation-fileupload')

uploadInvitationFileBtn.addEventListener('click', () => {
    console.log("upload triggered")
    fileUploadInput.click();
})

fileUploadInput.addEventListener('change', () => {

    let fr = new FileReader();

    fr.readAsText(fileUploadInput.files[0]);

    fr.onload  = function() {
        fillInvitationFormOut(fr.result);

        
    }
})

async function pasteInvitationText(){
    return await navigator.clipboard.readText();
}

function fillInvitationFormOut(text){
    let invitationDataInput = text.split("|||");
    
    if(
        invitationDataInput.length > 1 && 
        typeof parseFloat(invitationDataInput[1]) == "number" &&
         invitationDataInput[1].length == 4 &&
          invitationDataInput[0].length == 6 &&
           typeof invitationDataInput[0] == "string")
    {
        codeInput.value = invitationDataInput[0];
        pinInput.value = invitationDataInput[1];
        pinInput.dispatchEvent(new Event("keyup"))
    } else {
        showNotification("upload-invalid-notification")
        throw new Error("Falsches Format");
    }
}

codeInput.addEventListener('keyup', () => {pinInput.dispatchEvent(new Event("keyup"))});

pinInput.addEventListener('keyup', () => {
    let date = new Date(); 
    if (codeInput.value.length == 6 && pinInput.value.length == 4) {
        sendAdminWsMessage({type: "validate-invitation", data: {code: codeInput.value, pin: pinInput.value}, date: date})
    } else {
        
    }
})