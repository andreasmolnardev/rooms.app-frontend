export function DateToOutput(_date) {
    // Array mit den deutschen Namen der Wochentage
    const daysOfWeek = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

    // Array mit den deutschen Namen der Monate
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    // JavaScript-Date-Objekt aus dem übergebenen Datum erstellen
    const dateObj = new Date(_date);

    // Wochentag, Tag, Monat und Jahr aus dem Date-Objekt auslesen
    const dayOfWeek = daysOfWeek[dateObj.getDay()];
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    // Das aktualisierte Datum im gewünschten Format (deutsch) erstellen
    const formattedDate = `${dayOfWeek}, ${day}. ${month} ${year}`;

    // Das aktualisierte Datum im HTML-Element mit der ID "date-output" setzen
    const dateOutput = document.getElementById("date-output");
    dateOutput.innerText = formattedDate;
}

export function SetDate(dateInput) {



}