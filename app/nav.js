import { addDelayedEventListener } from "../shortcuts/dom-added-event-listener.js";
import { getPreviousSiblingWithClass } from "../shortcuts/previous-sibling.js";

const navbar = document.getElementById("navbar")

const navItems = document.getElementsByClassName('nav-tab-radio');
window.navItems = navItems;

for (let index = 0; index < navItems.length; index++) {
    const element = navItems[index];
    element.addEventListener('change', () => { tabSwitcher() });
}

addDelayedEventListener("nav-tab-radio", "change", () => {
    tabSwitcher();
}, "class", true)

function tabSwitcher() {
    //remove class active for all items which are not checked
    const uncheckedItems = document.querySelectorAll('.nav-tab-radio')

    Array.from(uncheckedItems).forEach(item => {
        if (item.dataset.target && document.getElementById(item.dataset.target).classList) {
            document.getElementById(item.dataset.target).classList.remove("active");
        }
        item.parentElement.classList.remove("active");
    })

    //get checked item
    const checkedItem = document.querySelector('.nav-tab-radio:checked')

    //add active class to checked item
    const target = document.getElementById(checkedItem.dataset.target)

    if (target && target.id != "schedule-dashboard") {
        document.getElementById(checkedItem.dataset.target).classList.add("active");
    } else if (target) {
        groupSelect.value = checkedItem.dataset.groupId
        groupSelect.dispatchEvent(new Event("change"))
        setTimeout(() => { target.classList.add('active') }, 185)
    }

    checkedItem.parentElement.classList.add("active")
    
    document.querySelector('h2#group-name').textContent = checkedItem.parentElement.querySelector('p').textContent;
    document.querySelector('#page-type').textContent = getPreviousSiblingWithClass(checkedItem.parentElement, "nav-header").querySelector('h3').textContent

}

let hideNavToggles = document.querySelectorAll('.hide-nav-toggle')

for (let index = 0; index < hideNavToggles.length; index++) {
    const toggle = hideNavToggles[index];

    toggle.addEventListener("change", () => {
        const targetCollection = navbar.querySelectorAll("." + toggle.dataset.target);

        targetCollection.forEach(item => {
            item.parentElement.classList.toggle("hidden")
        })
    })
}