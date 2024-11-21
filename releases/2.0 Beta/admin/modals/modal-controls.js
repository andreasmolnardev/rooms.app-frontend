const closeModalSpan = document.getElementsByClassName('close-modal');

for(let i = 0; i < closeModalSpan.length; i++){
   
    closeModalSpan[i].addEventListener('click', () => {
        document.getElementById(closeModalSpan[i].dataset.target).close();
    })
}