const navItems = document.getElementsByClassName('nav-tab-radio');

tabSwitcher();

function tabSwitcher(){
    for(let i = 0; i < navItems.length; i++){
        if(navItems[i].checked == true){
          
            document.getElementById(navItems[i].dataset.target).style.display = "flex"
       navItems[i].parentElement.classList.add('active');
        } else if(navItems[i].checked == false){
            navItems[i].parentElement.classList.remove('active');
            document.getElementById(navItems[i].dataset.target).style.display = "none"
        }
    
    };
  
}

document.getElementById('navbar').addEventListener('click', () => {

tabSwitcher();
if(navItems[1].checked == true){
    document.getElementsByClassName('add-btn')[0].style.display = "none";
} else {
    document.getElementsByClassName('add-btn')[0].style.display = "flex";
}

})


let toggleSidebarLabel = document.getElementById('toggle-sidebar-label');
let toggleSidebarCb = document.getElementById('toggle-sidebar')
toggleSidebarLabel.addEventListener('click', () => {
    if (toggleSidebarCb.checked == true) {
        document.getElementById('navbar').classList.add('small');
    } else {
        document.getElementById('navbar').classList.remove('small');
    }
})