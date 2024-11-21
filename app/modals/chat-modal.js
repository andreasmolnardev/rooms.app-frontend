let messengerNavForm = document.getElementById("recent-chats");

messengerTabs();

messengerNavForm.addEventListener('change', () => {
    messengerTabs();
})

function messengerTabs() {
    let messengerNavRadios = document.getElementsByName("messenger-nav");

    for (let index = 0; index < messengerNavRadios.length; index++) {
        const radio = messengerNavRadios[index];
        const target = document.getElementById(radio.dataset.target)

        if (radio.checked == true) {
            target.style.display = "flex";
            let div = target.querySelector('.messages');
            if (div) {
                div.scrollTo(0, div.scrollHeight);                
            }
        } else {
            target.style.display = "none";
        }
    }
}


