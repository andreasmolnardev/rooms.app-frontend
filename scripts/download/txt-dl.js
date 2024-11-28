export function downloadAsTxt(content, name_prefix) {
    const fileName = name_prefix + ".txt";
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
}

window.downloadAsTxt = downloadAsTxt;