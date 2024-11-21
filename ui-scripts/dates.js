export function DateToOutput(_date) {
    

    const daysOfWeek = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  
    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    
    const dateObj = new Date(_date);

    const dayOfWeek = daysOfWeek[dateObj.getDay()];
    
    let day = dateObj.getDate();

    if (day < 10){
        day = "0" + day
        console.log(day)
    }

    const month = months[dateObj.getMonth()];
    const monthNum = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();

    let unformattedDate;

    if (monthNum < 10) {
        unformattedDate = year + '-' + '0' + monthNum + '-' + day;
    } else {
        unformattedDate = year + '-' + monthNum + '-' + day;
    }
    
 
    let dateInput = document.getElementById('date')

    dateInput.value = unformattedDate;
    

    
}

export function IncreaseTime(dateInput) {



}