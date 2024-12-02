const groupInvitationsModal = document.getElementById("group-invitations-modal")

export function addInvitationToModal(invitation, state_active) {
    console.log({ invitation, state_active })

    if (state_active) {
        groupInvitationsModal.querySelector('#active-invitations').insertAdjacentHTML('beforeend', /*html*/`
            <section class="invitation-card item includes-gap vertical">
            <div class="credentials center">
               <div class="output center">
                    <i class="fa-solid fa-key"></i>
                    <span id="key-output">${invitation.invitationData.code.toString().replaceAll(',', '')}</span>
               </div>
               <div class="output center">
                   <i class="pin-code-icon"></i>
                    <span id="pin-output">${invitation.invitationData.pin.toString().replaceAll(',', '')}</span>     
               </div>
               <div class="share-panel includes-gap">
                <span title="Einladung herunterladen" class="center" onclick="downloadAsTxt('${invitation.invitationData.code.toString().replaceAll(',', '')}|||${invitation.invitationData.pin.toString().replaceAll(',', '')}', 'invitation')"><i class="fa-solid fa-download"></i></span>
                <span title="Einladung kopieren" class="center" onclick="copyToClipboard('${invitation.invitationData.code.toString().replaceAll(',', '')}|||${invitation.invitationData.pin.toString().replaceAll(',', '')}')" ><i class="fa-solid fa-clipboard"></i></span>
               </div>
            </div>
            <div class="detail-cards">
                <div class="comment item">
                <i class="fa-solid fa-note-sticky"></i>
                <h4 class="decription">Kommentar</h4>
                <p class="invitation-comment" title="${invitation.invitationData.comment}">${invitation.invitationData.comment}</p>
                </div>
                <div class="user-group item">
                    <i class="fa-solid fa-user-group"></i>
                    <h4 class="description">Nutzergruppe</h4>
                    <p class="invitation-user-group">${invitation.invitationData.userGroup}</p>
                </div>
                <div class="creation-datetime item"><i class="fa-solid fa-calendar-days"></i>
                    <h4 class="description">Erstellt am</h4>
                    <p class="invitation-creation-datetime">${invitation.invitationData.creationData.date}</p>
                </div>
                <div class="creator item">
                <i class="fa-solid fa-circle-user"></i>
                    <h4 class="description">von</h4>
                    <p class="invitation-creator">${invitation.invitationData.creationData.user.name}</p>
                </div>
                <div class="expiration-datetime item">
                    <i class="fa-solid fa-hourglass-half"></i>
                    <h4 class="description">Läuft ab am</h4>
                    <p class="invitation-expiration-datetime">${invitation.invitationData.expiryDate}</p>
                </div>
                <div class="people-join-counter item">
                    <i class="fa-solid fa-user-plus"></i>
                    <h4 class="description">noch mögliche Beitritte</h4>
                    <p class="people-join-counter-data">${invitation.invitationData.maxPeopleJoinCount - invitation.invitationData.usersJoinedCounter}/${invitation.invitationData.maxPeopleJoinCount}</p>
                </div>
            </div>
            <div class="actions center">
                <button class="tertiary" title="Einladung verlängern"><i class="fa-solid fa-calendar-plus"></i></button>
                <button class="tertiary" title="Einladung deaktivieren"><i class="fa-solid fa-power-off"></i></button>
            </div>
        </section>
            `)
    } else {
        groupInvitationsModal.querySelector('#inactive-invitations').insertAdjacentHTML('beforeend', /*html*/ `
                  <section class="invitation-card item includes-gap vertical">
            <div class="credentials center">
               <div class="output center">
                    <i class="fa-solid fa-key"></i>
                    <span id="key-output">${invitation.invitationData.code.toString().replaceAll(',', '')}</span>
               </div>
               <div class="output center">
                   <i class="pin-code-icon"></i>
                    <span id="pin-output">${invitation.invitationData.pin.toString().replaceAll(',', '')}</span>     
               </div>
               <div class="share-panel"></div>
            </div>
            <div class="detail-cards">
                <div class="comment item">
                <i class="fa-solid fa-note-sticky"></i>
                <h4 class="decription">Kommentar</h4>
                <p class="invitation-comment" title="${invitation.invitationData.comment}">${invitation.invitationData.comment}</p>
                </div>
                <div class="user-group item">
                    <i class="fa-solid fa-user-group"></i>
                    <h4 class="description">Nutzergruppe</h4>
                    <p class="invitation-user-group">${invitation.invitationData.userGroup}</p>
                </div>
                <div class="creation-datetime item"><i class="fa-solid fa-calendar-days"></i>
                    <h4 class="description">Erstellt am</h4>
                    <p class="invitation-creation-datetime">${invitation.invitationData.creationData.date}</p>
                </div>
                <div class="creator item">
                <i class="fa-solid fa-circle-user"></i>
                    <h4 class="description">von</h4>
                    <p class="invitation-creator">${invitation.invitationData.creationData.user.name}</p>
                </div>
                <div class="expiration-datetime item">
                    <i class="fa-solid fa-hourglass-half"></i>
                    <h4 class="description">Lief ab am</h4>
                    <p class="invitation-expiration-datetime">${invitation.invitationData.expiryDate}</p>
                </div>
                <div class="people-join-counter item">
                    <i class="fa-solid fa-user-plus"></i>
                    <h4 class="description">insgesamte Beitritte</h4>
                    <p class="people-join-counter-data">${invitation.invitationData.maxPeopleJoinCount}/${invitation.invitationData.maxPeopleJoinCount}</p>
                </div>
            </div>
            <div class="actions center">
                <button class="tertiary"><i class="fa-solid fa-trash"></i></button>
            </div>
        </section>`)  
    }


}