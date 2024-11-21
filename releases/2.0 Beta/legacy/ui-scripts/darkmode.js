
let body = document.getElementsByTagName('body')[0]
let themeSwitcherDark = document.getElementById('theme-dark');
let themeSwitcherLight = document.getElementById('theme-light');
let darkMode = localStorage.getItem('darkMode');


export function ThemeSetter() {
    if (themeSwitcherDark.checked == true) {
        localStorage.setItem('darkMode', 'enabled');
        body.classList.add('dark');

    } else {
        localStorage.setItem('darkMode', 'disabled');
        body.classList.remove('dark');
    }
    
}



export function ThemeGetter() {
    if (darkMode == 'enabled') {
        themeSwitcherDark.checked = true;
        themeSwitcherLight.checked = false;
    } else if (darkMode == 'disabled') {
        themeSwitcherLight.checked = true;
        themeSwitcherDark.checked = false;
    }
    ThemeSetter();
} 

export function SwitchDesignPreference() {
    const SelectDesign = document.getElementById('design-pref');
    if (SelectDesign.value == "dark") {
        localStorage.setItem("smartcode-design", "dark");
    } else {
        localStorage.setItem("smartcode-design", "light");
    }
}