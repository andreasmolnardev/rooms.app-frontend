export function copyTextToClipboard(text){
    navigator.clipboard.writeText(text);
    return "success";
}