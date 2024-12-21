export function isDate1Later(date1, date2) {
    let parsedDate1;
    let parsedDate2;

    if (isFullDateFormat(date1) && isFullDateFormat(date1)) {
        parsedDate1 = parseDateString(date1);
        parsedDate2 = parseDateString(date2);
    } else if (isFullDateFormat(date1)) {
        //convert 'full' date to shorthand date 
        parsedDate1 = formatDate(date1).replaceAll('-', '')
        parsedDate2 = date2.replaceAll('-', '')
    } else if (isFullDateFormat(date2)) {
        //convert 'full' date to shorthand date 
        parsedDate2 = formatDate(date2).replaceAll('-', '')
        parsedDate1 = date1.replaceAll('-', '')
    } else {
        parsedDate1 = date1.replaceAll('-', '')
        parsedDate2 = date2.replaceAll('-', '')
    }

    return parsedDate1 > parsedDate2;
}

function parseDateString(dateString) {
    console.log(dateString)
    const [year, month, day, hour, minute] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, hour, minute);
}

function isFullDateFormat(dateString) {
    const regex = /^[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \([A-Za-z\s]+( [A-Za-z\s]+)*\)$/;
    return regex.test(dateString);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0'); // pad single digits with 0
    return `${year}-${month}-${day}`;
}