let settingsWindow = document.getElementById('settings');
let administrationWindow = document.getElementById('administration');

let adminRadio = document.getElementById('nav-administration');
let settingsRadio = document.getElementById('nav-settings');

let administrationLabel = document.getElementById('nav-administration-label');
let settingsLabel = document.getElementById('nav-settings-label');

function ShowAdminWin(){
    settingsRadio.checked = "false";
        adminRadio.checked = "true";
        settingsWindow.style.display = "none";
        administrationWindow.style.display = "block";
        administrationLabel.classList.add('active');
        settingsLabel.classList.remove('active');
}

function ShowSettingsWin(){
     settingsRadio.checked = "true";
        adminRadio.checked = "false";
        settingsWindow.style.display = "block";
        administrationWindow.style.display = "none";
        administrationLabel.classList.remove('active');
        settingsLabel.classList.add('active');
    }


let toggleSidebarLabel = document.getElementById('toggle-sidebar-label');
let toggleSidebarCb = document.getElementById('toggle-sidebar')
toggleSidebarLabel.addEventListener('click' , () => {
    if (toggleSidebarCb.checked == true){
    document.getElementById('navbar').classList.add('small');
    } else {
        document.getElementById('navbar').classList.remove('small');
    }
})