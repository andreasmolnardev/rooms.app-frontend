import { initiateWsAdminConnection } from "../scripts/api/websocket-connection.js";
import { savePublicIpV4 } from "../scripts/public-ip/get-public-ipv4.js";
import { addDelayedEventListener } from "../shortcuts/dom-added-event-listener.js";
import { mutationObserverQuickadd } from "../shortcuts/mutation-observer.quickadd.js";
import { getTheme, setTheme, switchTheme } from "../ui-scripts/darkmode.js";
import { showComboModal } from "./modals/open-info-add-modal.js";


sessionStorage.clear();

localStorage.setItem("session", "admin");

const timestamp = new Date();
let authTokenId = localStorage.getItem('api-authtoken')

const apiRoot = localStorage.getItem("apiRoot") ?? "urban-space-barnacle-v56xj9q7vp7cw95v-3000.app.github.dev"

if (!authTokenId) {
    window.location.replace("../")
} else {
    savePublicIpV4().then(ip => {
        fetch('https://' + apiRoot + '/start-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ timestamp: timestamp, authTokenId: authTokenId, ip: ip, sessionType: "admin" })
        }).then(response => response.json()).then(result => {
            if (result.error == "neuer Login erforderlich") {
                localStorage.removeItem("api-authtoken")
                alert(result.error)
                window.location.replace("../")
            } else if (result.sessionTokenId) {
                //session initiated
                sessionStorage.setItem("sessionToken", result.sessionTokenId)
                initiateWsAdminConnection("start-admin-session", result.sessionTokenId, ip, apiRoot)
            }
        })
    })
}


setTheme((getTheme() == "true"));

const themeToggleLink = document.getElementById("change-theme-toggle")
themeToggleLink.addEventListener('click', () => { switchTheme(); })

const selectRoomGroupCheckbox = document.getElementsByName('select-room-group')
const titleBar = document.getElementById('title-bar')

roomGroupSelect();

function roomGroupSelect() {

    for (let index = 0; index < selectRoomGroupCheckbox.length; index++) {
        const checkbox = selectRoomGroupCheckbox[index];

        checkbox.addEventListener('change', () => {
            selectRoomGroupCheckbox.forEach(checkboxInstance => {
                document.getElementById(checkboxInstance.dataset.target).classList.remove("active");
            })

            document.getElementById(checkbox.dataset.target).classList.add("active")
            titleBar.querySelector("h2").textContent = checkbox.parentElement.querySelector(".text p").textContent
        })


    }


}

const groupSelectNavigation = document.getElementById("main-group-select");

mutationObserverQuickadd(groupSelectNavigation, (mutationList, observer) => {
    for (const mutation of mutationList) {
        const roomGroupLabel = Object.values(mutation.addedNodes).find(node => (node.classList && node.classList.contains("group-label")))
        const roomGroupCheckbox = Object.values(roomGroupLabel.children).find(child => child.name = "select-room-group");

        roomGroupCheckbox.addEventListener('change', () => {
            selectRoomGroupCheckbox.forEach(checkboxInstance => {
                document.getElementById(checkboxInstance.dataset.target).classList.remove("active");
            })


            document.getElementById(roomGroupCheckbox.dataset.target).classList.add("active")
            titleBar.querySelector("h2").textContent = roomGroupCheckbox.parentElement.querySelector(".text p").textContent
            sessionStorage.setItem("opened-group", roomGroupCheckbox.id.replace("-group-select", ""))
        })
    }
}, { childList: true })


const groupManagementSection = document.getElementById("group-management-section")

mutationObserverQuickadd(groupManagementSection, (mutationList, observer) => {
    for (const mutation of mutationList) {

        let item = Object.values(mutation.addedNodes).find(entry => entry.classList && entry.classList.contains("item"))
        if (!item) {
            break;
        }
        const itemType = item.dataset.type;
        item.addEventListener("click", () => { showComboModal("details", itemType, item.id) })
    }
}, { childList: true, subtree: true })

document.getElementById('view-invitations-button').addEventListener('click', () => {
    document.getElementById('group-invitations-modal').showModal();
})


//navigation for adding/creating a new room group

const proceedBtn = document.getElementById("proceed-btn");
window.proceedBtn = proceedBtn;

proceedBtn.addEventListener('click', () => {
    document.querySelector('#add-group-section > :is(form, section).active input[type="submit"]').click();
})

const selectMethodForm = document.getElementById("select-method");

selectMethodForm.addEventListener('submit', (e) => {
    const checkedAddRoomGroupMethodItem = document.querySelector("input[name='method-tabs']:checked")
    e.preventDefault();
    console.log(checkedAddRoomGroupMethodItem)
    document.getElementById(checkedAddRoomGroupMethodItem.id + '-group').classList.toggle("active");
    selectMethodForm.classList.remove("active")
})