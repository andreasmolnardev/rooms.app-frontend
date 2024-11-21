
import { ExpandSetting } from "../../../ui-scripts/expand-setting.js";


let expandsAdmin = ["expand-signatures", "expand-rooms", "expand-invitations"];
let expandsApp = ["expand-data", "expand-groups"]

let currentSession = sessionStorage.getItem("session");


if (currentSession == "admin") {
    expandSectionTrigger(expandsAdmin)
} else if (currentSession == "app"){
    expandSectionTrigger(expandsApp)
}

function expandSectionTrigger(array) {
    
    for (let index = 0; index < array.length; index++) {
        let element = array[index];
        document.getElementById(element).addEventListener("click", () => {
    
            ExpandSetting(element)
    
    
        })
    }
}



    /*Implement Expand Setting: 

    Add target container to the item

    */



    