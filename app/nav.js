import { addDelayedEventListener } from "../shortcuts/dom-added-event-listener";

tabSwitcher();

function tabSwitcher() {
    const navItems = document.getElementsByClassName('nav-tab-radio');
    window.navItems = navItems;

    for (let i = 0; i < navItems.length; i++) {

        let target;

        let item = navItems[i]

        if (item.dataset.target) {
            target = document.getElementById(item.dataset.target)
        }

        if (item.checked) {
            item.parentElement.classList.add('active');
        } else {
            item.parentElement.classList.remove('active');
        }

        if (item.checked && target) {
            target.style.display = "flex"
        } else if (target) {
            document.getElementById(item.dataset.target).style.display = "none"
        }

        if (item.checked && target.id == "scheule-dashboard"){
            console.log(item.dataset.groupId)
            groupSelect.value = item.dataset.groupId
            groupSelect.dispatchEvent(new Event("change"))
        }

    };

}

document.getElementById('navbar').addEventListener('click', () => {tabSwitcher()})

addDelayedEventListener("hide-nav-toggle", "change", (node) => {
    
}, "class")
