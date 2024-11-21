let selectContainerView = document.getElementById('select-container-view');

selectContainerView.addEventListener('change', () => {
    if (selectContainerView.value == "full") {
        document.getElementsByClassName("app")[0].classList.add("full")
    } else {
        document.getElementsByClassName("app")[0].classList.remove("full")
        
    }
})