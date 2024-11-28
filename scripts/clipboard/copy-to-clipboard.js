import { showNotificationByTemplate } from "../../ui-scripts/notifications/notifications.js";

export function copyToClipboard(text){
    navigator.clipboard.writeText(text).then(() => {
        showNotificationByTemplate("Einladung wurde in die Zwischenablage kopiert!", "success");
    }).catch(err => {
        showNotificationByTemplate("Einladung konnte nicht kopiert werden. Unbekannter Fehler", "error")
        console.error("Failed to copy text to clipboard: ", err);
    });
}

window.copyToClipboard = copyToClipboard;