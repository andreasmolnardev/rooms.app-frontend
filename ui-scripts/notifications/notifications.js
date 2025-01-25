export function showNotification(notificationDOMId) {
    document.getElementById(notificationDOMId).style.display = "flex"
    setTimeout(() => {
        document.getElementById(notificationDOMId).style.display = "none"
    }, 3000);
}

export function showNotificationByTemplate(text, type) {
    let notificationTemplate = document.getElementById("template-notification");
    let notificationTemplateIcon = notificationTemplate.querySelector("i")
    let notificationTemplateText = notificationTemplate.querySelector("p")

    if (text) {
        notificationTemplateText.innerText = text;
    } else {
        throw new Error("Notification text is null!")
    }

    if (!type) {
        throw new Error("Notification type is null!")
    } else if (type == "error"){
        notificationTemplateIcon.classList.values("vf-ic_fluent_dismiss_circle_24_filled")
    }  else if (type == "warning"){
        notificationTemplateIcon.classList.values("vf-ic_fluent_warning_24_filled")
    } else if (type == "info"){
        notificationTemplateIcon.classList.values("vf-ic_fluent_info_24_filled")
    } else if (type == "success"){
        notificationTemplateIcon.classList.values("vf-ic_fluent_checkmark_circle_24_filled")
    } else {
        notificationTemplateIcon.classList.values("fa-solid", type)
    }

    notificationTemplate.classList.add("active")
    setTimeout(() => {
        notificationTemplate.classList.remove("active")
    }, 3000);

}