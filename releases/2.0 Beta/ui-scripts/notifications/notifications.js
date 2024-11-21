export function showNotification(notificationDOMId) {
    document.getElementById(notificationDOMId).style.display = "flex"
    setTimeout(() => {
        document.getElementById(notificationDOMId).style.display = "none"
    }, 3000);
}