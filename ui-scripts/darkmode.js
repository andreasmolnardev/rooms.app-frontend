export function setTheme(darkModeBool) {
    localStorage.setItem("dark-theme", darkModeBool);
    
    if (darkModeBool == true) {
        console.log("yess")
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

export function switchTheme() {
    document.body.classList.toggle("dark");
    console.log(localStorage.getItem("dark-theme"))
    if ((localStorage.getItem("dark-theme") == 'false') != false) {
        console.log("getItem('dark-theme') == false")
        localStorage.setItem("dark-theme", true)
    } else {
        console.log("getItem('dark-theme') != false")
        localStorage.setItem("dark-theme", false)   
    }
}

export function getTheme() {
    return localStorage.getItem("dark-theme")
}