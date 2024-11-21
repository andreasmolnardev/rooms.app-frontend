export function ExpandSetting(element) {

    let targetClass = document.getElementById(element).dataset.target;
    let items = document.getElementsByClassName(targetClass);
    
    for (let i = 0; i < items.length; i++) {
        items.item(i).classList.toggle('expanded')
console.log("Event: " + items.item(i).classList)
    }

}
