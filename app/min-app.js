import { components } from "../components/components.js";
import { pingAPIforInternalServerError } from "../scripts/api/api-entry.js";
import { initiateWsInitConnection, sendWsClientMessage } from "../scripts/api/app/websocket-connection.js";
import { logOut } from "../scripts/auth/logout.js";
import { savePublicIpV4 } from "../scripts/public-ip/get-public-ipv4.js";
import { isDate1Later } from "../ui-scripts/compare-dates.js";
import { lazyLoadCSS } from "../ui-scripts/lazyload/lazy-load-css.js";
import { showNotificationByTemplate } from "../ui-scripts/notifications/notifications.js";

localStorage.setItem("session", "app");

sessionStorage.clear();

const timestamp = new Date();
let authTokenId = localStorage.getItem('api-authtoken')

const apiRoot = localStorage.getItem("apiRoot") ?? "rooms-app-api.prairiedog-stargazer.ts.net"

pingAPIforInternalServerError(() => { console.log("success") })

if (!authTokenId) {
    alert("Login erforderlich")
    window.location.replace("../")
} else {
    savePublicIpV4().then(ip => {

        fetch('https://' + apiRoot + '/start-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ timestamp: timestamp, authTokenId: authTokenId, ip: ip })
        }).then(response => response.json()).then(result => {
            if (result.error == "neuer Login erforderlich" || result.error == "Token existiert nicht auf dem Server... - bitte neu anmelden.") {
                localStorage.removeItem("api-authtoken")
                alert(result.error)
                console.log(result.error)
                window.location.replace("../")
            } else if (result.sessionTokenId) {
                //session initiated
                sessionStorage.setItem("sessionToken", result.sessionTokenId)
                initiateWsInitConnection("start-session", result.sessionTokenId, ip, apiRoot)
            }
        }).catch(error => {
            
            const loader = document.querySelector(".loader-main")
            loader.querySelector("p").textContent = "Verbidung zum Server fehlgeschlagen"
            loader.querySelector(".spinner").style.display = "none"
            loader.querySelector("img").src = "../assets/custom-icons/server-error.png"
            loader.insertAdjacentHTML(`beforeend`, /*html*/`
                    <p id="error-desciption"> dies ist nur ein temporärer Fehler. Mögliche Vorgehensweisen sind:`)
            loader.insertAdjacentHTML(`beforeend`, /*html*/`
                    <ul class="measures">
                        <li> <a href=""><i class="fa-solid fa-rotate-right"></i><p>Seite neu laden</p></a></li>
                        <li><a href=""> <i class="fa-solid fa-user-tie"></i><p>Admin kontaktieren</p></a></li>
                        <li><a href="https://github.com/andreasmolnardev/rooms.app-frontend/issues/new/choose"> <i class="fa-solid fa-bug"></i><p>Fehler melden</p></a></li>
                    </ul>
                    
                    `)


            console.log('Error:', error);
            showNotificationByTemplate(error, "error");

        });

    });
}



document.addEventListener("DOMContentLoaded", function () {
    lazyLoadCSS('/app/css/admin.css')
    lazyLoadCSS('/app/css/add-group.css')
    lazyLoadCSS('/app/css/settings.css')
    lazyLoadCSS('/app/css/modals.css')
    lazyLoadCSS('/assets/icons/font-awesome-6-pro-main/css/all.min.css');
    lazyLoadCSS('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

    const body = document.body;
    const backgroundSrc = body.dataset.backgroundSrc;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                body.style.backgroundImage = `url(${backgroundSrc})`;
                observer.unobserve(body);
            }
        });
    });

    observer.observe(body);
});

const addRoomOccupationForm = document.getElementById("new-room-occ-form")

addRoomOccupationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //add Room Occupation
    const roomOccupationTitle = addRoomOccupationForm.querySelector('#event-title').value
    const targetGroup = addRoomOccupationForm.querySelector('#select-group-for-add-form').value
    const targetRoom = addRoomOccupationForm.querySelector('#select-room-for-add-form').value
    const dateValue = addRoomOccupationForm.querySelector('#pick-date').value
    const timeBegins = addRoomOccupationForm.querySelector('#time-from').value
    const timeEnds = addRoomOccupationForm.querySelector('#time-to').value
    const notesTextField = addRoomOccupationForm.querySelector('#notes').value

    let invitedMembers = () => {
        let _invitedMembers;

        components['custom-multi-select'].find(customMultiSelect => {
            customMultiSelect.id == "invited-members-select"
        }).selectedItems.forEach(item => {
            _invitedMembers.push(item)
        })

        return _invitedMembers
    }

    const titleRegex = /^(?!.*\b(?:onload|script)\b)[1-9a-zA-Z\s\W]+$/;

    const date = new Date();
    date.setDate(date.getDate() - 1)

    if (roomOccupationTitle &&
        titleRegex.test(roomOccupationTitle) &&
        targetGroup &&
        targetRoom &&
        dateValue &&
        isDate1Later(dateValue, date)
        && (timeEnds.replaceAll(":", "") > timeBegins.replaceAll(":", ""))
        &&
        (
            !notesTextField || notesTextField
            && titleRegex.test(notesTextField)
        )) {



        sendWsClientMessage({
            type: "register-room-occupation",
            data: {
                title: roomOccupationTitle,
                groupId: targetGroup,
                room: targetRoom,
                date: dateValue,
                invitedUsers: invitedMembers,
                timespan: [timeBegins, timeEnds],
                notes: notesTextField
            }
        })
    } else {
        console.log("Something went wrong")
    }


})

document.getElementById('view-invitations-button').addEventListener('click', () => {
    document.getElementById('group-invitations-modal').showModal();
})

const logOutNavBtn = document.getElementById("nav-logout");

logOutNavBtn.addEventListener("click", () => { logOut(); })

//The old code has been moved to /more/archive/app/min-app-onlyfrontend.js in order to optimize loading speeds