let topBarCheckboxes = document.getElementsByName('top-bar');

for (let index = 0; index < topBarCheckboxes.length; index++) {
    const checkbox = topBarCheckboxes[index];
    
    checkbox.addEventListener('change', () => {
        if(checkbox.checked == true){
            document.getElementById(checkbox.dataset.target).showModal();
        } else if(checkbox.checked == false){
            document.getElementById(checkbox.dataset.target).close();
        }
    })
}

let topbarModalCloseTriggers = document.getElementsByClassName('close-topbar-modal');

for (let index = 0; index < topbarModalCloseTriggers.length; index++) {
    const closeTrigger = topbarModalCloseTriggers[index];
 
    
    closeTrigger.addEventListener('click', () => {
        document.getElementById(closeTrigger.dataset.target).click();
    })
}