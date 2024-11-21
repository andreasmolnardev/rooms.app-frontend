export function ExpandSetting(element) {

    let elementDom = document.getElementById(element);
    let targetClass = elementDom.dataset.target;
    let items = document.getElementsByClassName(targetClass);

    for (let i = 0; i < items.length; i++) {
        elementDom.classList.toggle("active")
        items.item(i).classList.toggle('expanded')
        console.log("Event: " + items.item(i).classList)
    }

}