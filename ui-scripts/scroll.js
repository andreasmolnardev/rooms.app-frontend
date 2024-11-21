let interactionWrapper = document.getElementById('interaction-wrapper');
let roomsDiv = document.getElementById('rooms-div')

interactionWrapper.scrollLeft = 0.25 * interactionWrapper.clientWidth;
let scrollTimeout;

interactionWrapper.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    

    
scrollTimeout = setTimeout(() => {
        handleScroll();
        interactionWrapper.scrollLeft = 0.25 * interactionWrapper.clientWidth;

    }, 500); 
});

function handleScroll() {
    let scroll = interactionWrapper.scrollLeft;

    if (calculateScrollPercentage(interactionWrapper) <= 0.2 && !interactionWrapper.classList.contains('disabled')) {
        decrementDate();
        setTimeout(() => {
            interactionWrapper.classList.remove('disabled');
        
        }, 800);
    } else if (calculateScrollPercentage(interactionWrapper) >= 0.45 && !interactionWrapper.classList.contains('disabled')) {
        incrementDate();
        interactionWrapper.classList.add('disabled')
        setTimeout(() => {
            interactionWrapper.classList.remove('disabled');
        }, 800);
    } else if (interactionWrapper.classList.contains('disabled')) {
        console.log("done")
    }
}


function calculateScrollPercentage(container) {
    return container.scrollLeft / container.clientWidth;
}

function incrementDate() {
    let dateInput = document.getElementById('date');
    let currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() + 1);
    dateInput.value = currentDate.toISOString().split('T')[0];
    dateInput.dispatchEvent(new Event('change'));
}

function decrementDate() {
    let dateInput = document.getElementById('date');
    let currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() - 1);
    dateInput.value = currentDate.toISOString().split('T')[0];
    dateInput.dispatchEvent(new Event('change'));
}