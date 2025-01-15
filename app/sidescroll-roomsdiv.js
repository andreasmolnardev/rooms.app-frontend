const dateInput = document.getElementById('date');
const container = document.getElementById('rooms-div');

document.addEventListener("DOMContentLoaded", function () {
    const TOUCH_THRESHOLD = 80; // Minimum distance in pixels from the left edge
    let touchStartX = null;

    container.addEventListener('touchstart', function (event) {
        const touch = event.touches[0]; // Get the first touch
        touchStartX = touch.clientX;
    });

    container.addEventListener('touchend', function (event) {
        if (touchStartX !== null) {
            const touch = event.changedTouches[0]; // Get the touch that ended
            const containerRect = container.getBoundingClientRect();

            // Calculate horizontal movement
            const horizontalMovement = Math.abs(touch.clientX - touchStartX);


            // Reset touchStartX
            touchStartX = null;
        }
    });

    window.addEventListener('scroll', function () {
        const containerRect = container.getBoundingClientRect();
        if (window.scrollX >= containerRect.left + TOUCH_THRESHOLD) {
            decreaseDate();
        } else {
            increaseDate();
        }
    });
});


function increaseDate() {
    let currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() + 1);
    dateInput.value = currentDate.toISOString().slice(0, 10);
    dateInput.dispatchEvent(new Event("change"));
}

function decreaseDate() {
    let currentDate = new Date(dateInput.value);
    currentDate.setDate(currentDate.getDate() - 1);
    dateInput.value = currentDate.toISOString().slice(0, 10);
    dateInput.dispatchEvent(new Event("change"));

}

export function emptyRoomOccSpaces() {
    const roomOccSpaces = container.querySelectorAll('p.room-occ-space')

    for (let index = 0; index < roomOccSpaces.length; index++) {
        const element = roomOccSpaces[index];

        element.innerHTML = "Keine Besetzungen"
    }
}