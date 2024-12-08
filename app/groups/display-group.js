export function displayGroup(groupId, groupData) {
    
    
    const groupSelect = document.getElementById("select-group")
    groupSelect.innerHTML += `<option value="${groupId}">${groupData.name}<option>`;

    /*   markGroupAsStandard = `
           <span title="Standardstatus entfernen" class="destandardized-group">
               <i class="fa-solid fa-award"></i>
          </span>
           `;
       settingsGroupDiv.innerHTML += ` 
       <div class="group" id="group+${groupId}">
           <i class="fa-solid fa-group">
           </i>
           <p class="max">${group.name}
           ${standardGroupBadge}
           </p>
          <p title="Name des Administrators">${admin.name}</p>
          <section class="actions">
             ${markGroupAsStandard}
             <span title="${group.name} verlassen" class="leave-group">
                  <i class="fa-solid fa-right-from-bracket"></i>
              </span>
           </section>
       </div>`;

   */   

    if(groupData.permissions.writeAll || groupData.permissions.write.exceptions){
            document.querySelector(".add-btn").classList.add("active")
    }

}