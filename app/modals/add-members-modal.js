import { components } from "../../components/components.js";
import { sendWsClientMessage } from "../../scripts/api/app/websocket-connection.js";
import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";



export function addMembersFormSubmit() {
    document.getElementById("invite-users-form").addEventListener("submit", (event) => {
        event.preventDefault();

        const addSection = document.getElementById('add-section')
        const infoSection = document.getElementById('info-section')
        const selectRoomGroup = components["custom-select"].find(selectEl => (selectEl.id == "select-user-group-invitation-form"))
        const expireDatetimeValue = document.getElementById("expire-code-date-time-input").value;
        const possibleJoinsQuanity = document.getElementById("max-group-join-count").value;
        const invitationComment = document.getElementById('invitation-comment').value

        if (selectRoomGroup.selectedOption && possibleJoinsQuanity && (new Date(expireDatetimeValue) > new Date())) {
            addSection.textContent = "";
            addSection.insertAdjacentHTML(
                "afterbegin", /*html*/`
              <div class="outer-loader-wrapper center">
                <div class="loader-wrapper center">
                    <div class="micro-loader"></div>
                    Einladung wird erstellt
                </div>
                </div>
              `);


            sendWsClientMessage(
                {
                    type: "create-invitation", data:
                    {
                        creationDate: new Date(),
                        sessionTokenId: sessionStorage.getItem("sessionToken"),
                        groupIndex: Object.keys(JSON.parse(sessionStorage.getItem("groups"))).indexOf(sessionStorage.getItem("opened-group")),
                        userGroup: selectRoomGroup.selectedOption.option_id.replace('-user-group-select-group-invitations-form', ''),
                        maxPeopleJoinCount: possibleJoinsQuanity,
                        expiryDate: expireDatetimeValue,
                        comment: invitationComment
                    }
                }
            )

            //wait until a response is being received 

            document.body.addEventListener("invitation-created", (event) => {
                const invitationData = event.detail;
                console.log(event)

                infoSection.classList.add("active");
                addSection.classList.remove("active");

                infoSection.textContent = "";
                infoSection.insertAdjacentHTML('beforeend', /*html*/ `
                    <h2>Details zur Einladung</h2>
                    <div class="field">
                        <p>Code</p>
                        <div class="output-wrapper">
                            <p>${invitationData["joinKey"].toString().replaceAll(',', '')}</p>
                        </div>
                    </div>
                    <div class="field">
                    <p>Pin</p>
                    <div class="output-wrapper">
                        <p>${invitationData["pinCode"].toString().replaceAll(',', '')}</p>
                    </div>
                    <button class="secondary" id="download-invitation-text"><i class="vf-ic_fluent_arrow_download_24_filled"></i>Download</button>
                    <button class="secondary" id="copy-invitation-text"><i class="vf-ic_fluent_copy_24_filled"></i>Kopieren</button>
                </div>
                    
                    `)
            })

        } else if (new Date(expireDatetimeValue) < new Date()) {
            alert("Ablaufdatum liegt in der Vergangenheit")
        } else {
            alert("bitte alle markierten Felder ausfüllen")
        }

    })
}

function getActiveFormTab() {
    const addMethodTabs = document.getElementsByName("add-method");

    for (let index = 0; index < addMethodTabs.length; index++) {
        const tabRadio = addMethodTabs[index];

        if (tabRadio.checked) {
            return tabRadio.dataset.target
        }
    }
}

export function displayInvitation(key, value) {
    const addSection = document.getElementById('add-section')
    const infoSection = document.getElementById('info-section')

    addSection.classList.remove('active');
    addSection.textContent = "";

    infoSection.classList.add('active');
    infoSection.insertAdjacentHTML('beforeend', /*html*/ `
        <div class="invitation-details">
            
        </div>
        
        `)

}