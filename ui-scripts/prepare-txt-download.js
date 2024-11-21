let d = new Date().toLocaleDateString('de-de', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"2-digit", minute:"2-digit"}) ;

export function downloadTextAsTextFile(text) {
    const blob = new Blob([text], {type: text});
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "einladung-" + d ;
    link.href = fileUrl;
    link.click();
}