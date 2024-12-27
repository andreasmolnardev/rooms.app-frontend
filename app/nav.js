
tabSwitcher();

function tabSwitcher() {
    const navItems = document.getElementsByClassName('nav-tab-radio');
    
    window.navItems = navItems;

    for (let i = 0; i < navItems.length; i++) {

        let target;

        if (navItems[i].dataset.target) {
            target = document.getElementById(navItems[i].dataset.target)
        }

        if (navItems[i].checked) {
            navItems[i].parentElement.classList.add('active');
        } else {
            navItems[i].parentElement.classList.remove('active');
        }

        if (navItems[i].checked && target) {
            target.style.display = "flex"
        } else if (target) {
            document.getElementById(navItems[i].dataset.target).style.display = "none"
        }

    };

}

document.getElementById('navbar').addEventListener('click', () => {
    tabSwitcher();

    if (window.navItems[1].checked == true) {
        document.getElementsByClassName('add-btn')[0].classList.remove("active");
    }

})

