import { components } from "../../components/components.js";
import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";
import { applyTabControl } from "../tabs/tab-controls.js";
import { addMembersFormSubmit } from "./add-members-modal.js";
import { addRoomaddFormSubmit } from "./add-rooms-modal.js";
import { addUsergroupFormSubmit } from "./add-usergroup.js";

const comboModal = document.getElementById("main-info-edit-modal");

export function showComboModal(purpose, type, itemId) {

  console.log("show combo modal executed")

  const globalGroupData = JSON.parse(sessionStorage.getItem("groups"));
  const activeGroupId = sessionStorage.getItem("opened-group");

  const userGroupData = Object.keys(globalGroupData[activeGroupId]["user-groups"]);
  let toggledItemData;

  if (purpose == "edit" || purpose == "details") {
    if (Array.isArray(globalGroupData[activeGroupId][type + "s"])) {
      toggledItemData = globalGroupData[activeGroupId][type + "s"].find(
        (item) => item.id == itemId.replace(type + '-', '')
      );

    } else {
      toggledItemData = globalGroupData[activeGroupId][type + "s"][itemId.replace(type + '-', '')]
      toggledItemData.name = itemId.replace(type + '-', '');
    }
  }

  if (purpose == "add") {
    let cooldownActive;

    console.log(document.getElementById("info-add-modal-submit-btn"))

    document.getElementById("info-add-modal-submit-btn").addEventListener("click", () => {
      if (!cooldownActive) {
        comboModal.querySelector(':is(#add-section.active:not(:has(.tabs)) form, #add-section.active:has(.tabs) form.active) input[type="submit"]').click();
        cooldownActive = true;
        setTimeout(() => { cooldownActive = false }, 1000)
      }
    })

  }


  const infoSection = comboModal.querySelector("#info-section");
  const addSection = comboModal.querySelector("#add-section");

  if (purpose == "add" && type == "room") {
    addSection.classList.add("active");
    infoSection.classList.remove("active");

    addSection.textContent = "";
    addSection.insertAdjacentHTML(
      "afterbegin",
      /*html*/`
            <h2>Raum hinzufügen</h2>
            <form action="" id="new-room-form">
    <div class="field">
        <label for="room-name">Name</label>
        <input type="text" id="room-name" required>
    </div>
    <div class="field">
        <label for="room-name">max. Personenanzahl</label>
        <input type="number" id="room-capacity" min="1" required>
    </div>
    <ul id="room-details" class="tree-view">
        <li>
            <span class="caret">weitere Details (optional)</span>
            <ul class="nested">

            </ul>
        </li>
    </ul>

    <input type="submit" value="">
</form>
            `
    );

    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }

    addRoomaddFormSubmit();

  } else if (purpose == "add" && type == "user-group") {
    addSection.classList.add("active");
    infoSection.classList.remove("active");

    addSection.textContent = "";
    addSection.insertAdjacentHTML(
      "afterbegin",
      /*html*/`
            <h2>Nutzergruppe hinzufügen</h2>
            <form id="add-user-group-form">
              <h3>Beschreibung</h3>
              <div class="field">
                <label for="add-usergrup-name">Name</label>
                <div class="input-wrapper">
                    <input type="text" id="add-usergrup-name" pattern="[A-Za-z0-9]+" required>
                </div>
             </div>
             <div class="field">
              <label for="add-usergrup-comment">Kommentar</label>
              <div class="input-wrapper">
                <textarea id="add-usergrup-comment"></textarea>
              </div>
             </div>
              <h3>Rechte</h3>
             <p>Lesezugriff</p>
             <div class="input-field">
              <input type="radio" name="read-access-permissions-addmodal" id="full-read-access" required>
              <label for="full-read-access">alle Räume</label>
             </div>
             <div class="input-field">
             <input type="radio" name="read-access-permissions-addmodal" id="exclude-items-from-read-access" class="limited-capabilities" required>
             <label for="exclude-items-from-read-access">folgende Räume ausschließen</label>
            </div>
            <div class="input-field">
            <input type="radio" name="read-access-permissions-addmodal" id="limited-read-access" class="limited-capabilities" required>
            <label for="limited-read-access">auf folgende Räume beschränken</label>
           </div>
           <div class="input-field">
           <input type="radio" name="read-access-permissions-addmodal" id="own-participation-read-access" required>
           <label for="own-participation-read-access">auf eigene Teilnahme beschränken</label>
          </div>
          <p>Schreibzugriff</p>
          <div class="input-field">
              <input type="radio" name="write-access-permissions-addmodal" id="full-write-access" required>
              <label for="full-write-access">alle Räume</label>
          </div>
          <div class="input-field">
             <input type="radio" name="write-access-permissions-addmodal" id="exclude-items-from-write-access" class="limited-capabilities" required>
             <label for="exclude-items-from-write-access">folgende Räume ausschließen</label>
          </div>
          <div class="input-field">
            <input type="radio" name="write-access-permissions-addmodal" id="limited-write-access"  class="limited-capabilities" required>
            <label for="limited-write-access">auf folgende Räume beschränken</label>
          </div>
          <div class="input-field">
           <input type="radio" name="write-access-permissions-addmodal" id="deny-write-access" required>
           <label for="deny-write-access">keinen Zugriff erlauben</label>
          </div>  
          <p>Admindashboard</p>
          <div class="input-field">
            <input type="checkbox" name="admin-permissions-addmodal" id="create-new-rooms">
            <label for="create-new-rooms">Erstellen & Verwalten von neuen Räumen</label>
          </div>
          <div class="input-field">
          <input type="checkbox" name="admin-permissions-addmodal" id="edit-existing-rooms">
          <label for="edit-existing-rooms">Verwalten von bestehenden Räumen</label>
        </div>
        <input type="submit">
        </form>
            `


    );

    const roomData = globalGroupData[activeGroupId].rooms

    let roomsSelectHTML = "";

    roomData.forEach(room => {
      roomsSelectHTML += /*html*/`
       <li data-id="id-${room.id}" data-name="${room.name}" title="zum Auswählen klicken" data-available-for-select = "true">${room.name}</li>
      `
    })

    const limitedCapabilitiesItems = document.querySelectorAll('input.limited-capabilities')

    for (let index = 0; index < limitedCapabilitiesItems.length; index++) {
      const item = limitedCapabilitiesItems[index];

      item.addEventListener('change', () => {
        const existingMultiSelects = document.querySelectorAll(`.multi-select.${item.name}`)
        if (existingMultiSelects) {
          for (let index = 0; index < existingMultiSelects.length; index++) {
            const multiSelectEl = existingMultiSelects[index];
            multiSelectEl.remove();
          }
        }

        item.parentElement.insertAdjacentHTML('afterend', /*html*/`
           <div class="room-select multi-select ${item.name}" id="${item.id}-rooms-select">
                    <div class="search">
                        <div class="wrapper center">
                            <ul class="selected">
                            </ul>
                            <input type="text" placeholder="nach einem Raum suchen" id="${item.id}-search-item">
                             <label for="${item.id}-show-items-checkbox" class="center">
                            <input type="checkbox" id="${item.id}-show-items-checkbox">
                            <span class="caret-round center"><i class="vf-ic_fluent_caret_down_24_filled"></i></span>
                            </label>
                        </div>
                        <ul class="results"  data-multi-select-id="${item.id}-rooms-select">
                          ${roomsSelectHTML}
                        </div>
                    </div>
                </div>
          
        `)

        const multiSelect = document.getElementById(`${item.id}-rooms-select`)

        const searchItem = document.getElementById(item.id + '-search-item')
        searchItem.addEventListener('keyup', () => {
          const value = searchItem.value
          roomData.forEach(room => {
            document.querySelector(`#${multiSelect.id} .results li[data-id = "id-${room.id}"]`).style.display = "none"
          })
          roomData.filter(room => room.name.toLowerCase().includes(value.toLowerCase())).forEach(roomToShow => {
            //get the multiSelect element based on the radio's id
            document.querySelector(`#${multiSelect.id} .results li[data-id = "id-${roomToShow.id}"][data-available-for-select = "true"]`).style.display = "block"
          }
          )
        })

        const roomItems = multiSelect.querySelectorAll('.results li')

        for (let index = 0; index < roomItems.length; index++) {
          const roomItem = roomItems[index];

          roomItem.addEventListener('click', (e) => {
            e.preventDefault();
            multiSelect.querySelector('.selected').insertAdjacentHTML('beforeend', /*html*/`
              <li data-id="${roomItem.dataset.id}" class="includes-gap center">${roomItem.textContent}<span onclick="
              this.parentElement.remove();
              console.log('${roomItem.parentNode.dataset.multiSelectId}')
              document.querySelector('#${roomItem.parentNode.dataset.multiSelectId} .results li[data-id = &quot;${roomItem.dataset.id}&quot;]').dataset.availableForSelect = 'true';
              document.querySelector('#${roomItem.parentNode.dataset.multiSelectId} .results li[data-id = &quot;${roomItem.dataset.id}&quot;]').style.display = &quot;block&quot;;
               "><i class="vf-ic_fluent_dismiss_circle_24_filled"></i></span></li>`);

            roomItem.dataset.availableForSelect = "false";
            roomItem.style.display = "none";
          })

        }

      })

    }

    addUsergroupFormSubmit(userGroupData);

  } else if (purpose == "add" && type == "member" && Array.isArray(userGroupData)) {
    addSection.classList.add("active");
    infoSection.classList.remove("active");

    let userGroupFormHTML;


    addSection.textContent = "";
    addSection.insertAdjacentHTML(
      "afterbegin",
      /*html*/`
            <h2>Mitglieder hinzufügen</h2>
            <div class="tabs center">
                <label class="item tab">
                    <input type="radio" name="add-method" id="invite-users" data-target="invite-users-form" checked>
                    <i class="vf-ic_fluent_mail_template_24_filled"></i>
                    <p>Einladung erstellen</p>
                    <span><i class="vr-ic_fluent_question_circle_24_regular"></i></span>
                </label>
                <label class="item tab">
                    <input type="radio" name="add-method" id="add-user-manually" data-target="add-user-manually-form">
                    <i class="vf-ic_fluent_person_add_24_filled"></i>
                    <p>Manuell hinzufügen</p>
                    <span><i class="vr-ic_fluent_question_circle_24_regular"></i></span>
                </label>
            </div>
            <form id="invite-users-form">
                <h3>Zuweisung zu einer Benutzergruppe</h3>
                <div class="field">
                <label for="">Benutzergruppe</label>
                <div class="input-wrapper">
                    <div class="custom-select" id="select-user-group-invitation-form" data-item-div="select-usergroup-grouplist">
                        <label class="select-box" for="select-usergrouop-visible">
                            <i class="vf-ic_fluent_caret_down_24_filled"></i>
                            <input type="checkbox" name="" id="select-usergrouop-visible">
                            <p class="select-label">Nutzergruppe auswählen</p>
                        </label>
                        <div class="select-items" id="select-usergroup-grouplist">
                        </div>
                    </div>
                </div> 
                </div>
                <div class="field">
                <label for="">Kommentar</label>
                <div class="input-wrapper">
                  <textarea id="invitation-comment"></textarea>
                </div>
                </div>
                <p>Weitere Einstellungen (Zugriffsrechte, Buchungslimits etc.) werden in den Nutzergruppeneinstellungen verwaltet</p>
            <h3>Zeitpunkt des Ablaufs</h3>
            <div class="field">
                <label for="">
                    Anzahl möglicher Beitritte
                </label>
                <div class="input-wrapper">
                    <input type="number" name="" id="max-group-join-count" min="1">
                </div>
            </div>
            <div class="field">
                <label for="">
                    Gültig bis zu folgendem Zeitpunkt
                </label>
                <div class="input-wrapper">
                    <input type="datetime-local" name="expire-code-date-time-input" id="expire-code-date-time-input">
                </div></div>
                </div>
                <input type="submit">
            </form>
            <form id="add-user-manually-form">
             <h3>Daten des Benutzers</h3>
             <div class="field">
              <label for="manual-useradd-name">Name</label>
              <div class="input-wrapper">
                <input type="text" id="manual-useradd-name">
              </div>
             </div>
             <div class="field">
              <label for="manual-useradd-email">E-Mail-Adresse</label>
              <div class="input-wrapper">
                <input type="email" id="manual-useradd-email">
              </div>
             </div>

            <h3>Zuweisung zu einer Benutzergruppe</h3>
                <div class="field">
                <label for="">Benutzergruppe</label>
                <div class="input-wrapper">
                    <div class="custom-select" id="select-user-group" data-item-div="select-usergroup-grouplist">
                        <label class="select-box" for="select-usergrouop-visible">
                            <i class="vf-ic_fluent_caret_down_24_filled center"></i>
                            <input type="checkbox" name="" id="select-usergrouop-visible">
                            <p class="select-label">Nutzergruppe auswählen</p>
                        </label>
                        <div class="select-items" id="select-usergroup-grouplist">
                        </div>
                    </div>
                </div> 
                </div>
                <div class="field">
                <label for="">Kommentar</label>
                <div class="input-wrapper">
                  <textarea></textarea>
                </div>
                </div>
                <p>Weitere Einstellungen (Zugriffsrechte, Buchungslimits etc.) werden in den Nutzergruppeneinstellungen verwaltet</p>
                <input type="submit">
                </form>
            `);

    applyTabControl("add-method");
    document.getElementById("invite-users").dispatchEvent(new Event("change"))

    document.body.addEventListener('select-user-group-invitation-form-added', () => {
      console.log('select-user-group-invitation-form-added')
      let selectUsergroupEl = components["custom-select"].find(selectEl => (selectEl.id == "select-user-group-invitation-form"))

      userGroupData.forEach(usergroup => {
        selectUsergroupEl.addOption(usergroup, usergroup + '-user-group-select-group-invitations-form', 'select-user-group-invitation-form')
      })
    })

    addMembersFormSubmit()


  } else if (purpose == "details") {
    infoSection.classList.add("active");
    addSection.classList.remove("active");

    let itemTypeDescription;

    if (type == "room") {
      itemTypeDescription = "Raum";
    } else if (type == "member") {
      itemTypeDescription = "Gruppenmitglied";
    } else if (type == "user-group") {
      itemTypeDescription = "Benutzergruppe";
    }
    const { name, id, ...rest } = toggledItemData;
    const destructuredAttibutes = { ...rest };

    console.log(toggledItemData)

    let gridContent;

    if (Object.keys(destructuredAttibutes).length) {
      console.log(destructuredAttibutes);
    } else {
      gridContent = "Keine Informationen wurden hinterlegt";
    }

    infoSection.textContent = "";
    infoSection.insertAdjacentHTML(
      "afterbegin",
      /*html*/`
                <label for="info-modal-item-name">${itemTypeDescription}</label>
                <h2 id="info-modal-item-name">${toggledItemData.name}</h2>
                <div class="grid">
                    ${gridContent}
                </div>
            `
    );
  }

  comboModal.showModal();
}
