const navbar = document.getElementById("navbar")
let checkedItem;

navbar.addEventListener('click', () => {
    tabSwitcher();
})

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

        if (item.checked && target && target.id != "schedule-dashboard") {
            target.classList.add('active')
        } else if (target) {
            target.classList.remove('active')
        }

        if (item.checked && target && target.id == "schedule-dashboard" && checkedItem != item) {
            groupSelect.value = item.dataset.groupId
            groupSelect.dispatchEvent(new Event("change"))
            setTimeout(() => { target.classList.add('active') }, 185)
        }

        if (item.checked) {
            checkedItem = item;
        }

    };

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