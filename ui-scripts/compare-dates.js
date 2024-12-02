export function isDate1Later(date1, date2) {

    const parsedDate1 = parseDateString(date1);
    const parsedDate2 = parseDateString(date2);

    return parsedDate1 > parsedDate2;
}

function parseDateString(dateString) {
    const [year, month, day, hour, minute] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, hour, minute);
}