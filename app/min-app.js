//import { SwitchDesignPreference, ThemeGetter, ThemeSetter } from "../ui-scripts/darkmode.js";
//import { DateToOutput } from "../ui-scripts/dates.js";
//import { AccentClGetter, AccentClSetter } from "../ui-scripts/accent-cl.js";
//import { ExpandSetting } from "../ui-scripts/expand-setting.js";
//import { showPage } from "../ui-scripts/page-loading.js";
//import { showNotification, showNotificationByTemplate } from "../ui-scripts/notifications/notifications.js"
//import { filterScheduleByRoom, resetFilter } from "../ui-scripts/filter-schedule.js";
//import { components } from "../components/components.js";
import { components } from "../components/components.js";
import { initiateWsInitConnection, sendWsClientMessage } from "../scripts/api/websocket-connection.js";
import { savePublicIpV4 } from "../scripts/public-ip/get-public-ipv4.js";
import { isDate1Later } from "../ui-scripts/compare-dates.js";

localStorage.setItem("session", "app");

sessionStorage.clear();

const timestamp = new Date();
let authTokenId = localStorage.getItem('api-authtoken')

const apiRoot = localStorage.getItem("apiRoot") ?? "urban-space-barnacle-v56xj9q7vp7cw95v-3000.app.github.dev"

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
            if (result.error == "neuer Login erforderlich") {
                localStorage.removeItem("api-authtoken")
                alert(result.error)
                window.location.replace("../")
            } else if (result.sessionTokenId) {
                //session initiated
                sessionStorage.setItem("sessionToken", result.sessionTokenId)
                initiateWsInitConnection("start-session", result.sessionTokenId, ip, apiRoot)
            }
        }).catch(error => {
            console.log('Error:', error); alert(error)
            showNotificationByTemplate(error, "error")
        });

    });
}

document.addEventListener("DOMContentLoaded", function () {
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



//The old code has been moved to /more/archive/app/min-app-onlyfrontend.js in order to optimize loading speeds