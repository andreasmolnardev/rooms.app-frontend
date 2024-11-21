///A tab group is made up of elements with the tab class and the same "name" attribute

export function applyTabControl(nameAttribute){
    const tabs = document.getElementsByName(nameAttribute);
    let radios = [];

    for (let index = 0; index < tabs.length; index++) {
        const tabSelectedRadio = tabs[index];
        
        tabSelectedRadio.addEventListener('change', () => {
            Array.from(radios).forEach(radio => {
                document.getElementById(radio.dataset.target).classList.remove('active');
            })

            document.getElementById(tabSelectedRadio.dataset.target).classList.add("active");
        })

        radios.push(tabSelectedRadio)
    }
}