import { sendAdminWsMessage } from "../../scripts/api/websocket-connection.js";
import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";

const comboModal = document.getElementById("main-info-edit-modal");

export function addUsergroupFormSubmit(userGroupData){
    const addUserGroupForm = document.getElementById('add-user-group-form');

    addUserGroupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const usergroupNameInput = document.getElementById('add-usergrup-name')
      const usergroupCommentTextarea = document.getElementById('add-usergrup-comment')
      const checkedReadAccessPermissionRadio = document.querySelector('input[name="read-access-permissions-addmodal"]:checked');
      const checkedWriteAccessPermissionRadio = document.querySelector('input[name="write-access-permissions-addmodal"]:checked');
      const createNewRoomsToggle = document.getElementById('create-new-rooms')
      const editExistingRoomsToggle = document.getElementById('edit-existing-rooms')


      if (!usergroupNameInput.value || !checkedReadAccessPermissionRadio || !checkedWriteAccessPermissionRadio) {
        alert("bitte alle benötigten Felder ausfüllen/anklicken")
      } else if (userGroupData.find(groupName => (groupName == usergroupNameInput.value))) {
        alert("Nutzergruppe mit gleichem Namen existiert bereits")
      } else {
        let newUserGroup = {
          name: usergroupNameInput.value,
          comment: usergroupCommentTextarea.value,
          permissions: {
            admin: {
              "create-new-rooms": createNewRoomsToggle.checked,
              "edit-existing-rooms": editExistingRoomsToggle.checked
            }
          }
        }

        newUserGroup.permissions['read'] = { type: checkedReadAccessPermissionRadio.id };

        if (checkedReadAccessPermissionRadio.classList.contains('limited-capabilities')) {
          let exceptions = [];
          const selectedRoomNodes = checkedReadAccessPermissionRadio.parentNode.nextElementSibling.querySelector('.selected').children;
          console.log(selectedRoomNodes)
          for (let index = 0; index < selectedRoomNodes.length; index++) {
            const element = selectedRoomNodes[index];
            console.log(element)
            exceptions.push(element.dataset.id.replace('id-', ''))
          }

          newUserGroup.permissions.read.exceptions = exceptions
        }

        newUserGroup.permissions['write'] = { type: checkedWriteAccessPermissionRadio.id };

        if (checkedReadAccessPermissionRadio.classList.contains('limited-capabilities')) {
          let exceptions = [];
          const selectedRoomNodes = checkedWriteAccessPermissionRadio.parentNode.nextElementSibling.querySelector('.selected').children;

          for (let index = 0; index < selectedRoomNodes.length; index++) {
            const element = selectedRoomNodes[index];
            exceptions.push(element.dataset.id.replace('id-', ''))
          }

          newUserGroup.permissions.write.exceptions = exceptions
        }

        newUserGroup.creationDate = new Date();

        sendAdminWsMessage({
            type: "create-user-group",
            sessionTokenId: sessionStorage.getItem("sessionToken"),
            groupIndex: Object.keys(JSON.parse(sessionStorage.getItem("groups"))).indexOf(sessionStorage.getItem("opened-group")),
            data: newUserGroup 
        })

        comboModal.close();
        showNotificationByTemplate("Raumgruppe wird erstellt", "info")

      }
    })
}
