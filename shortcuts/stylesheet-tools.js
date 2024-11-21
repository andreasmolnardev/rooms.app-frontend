export function isStylesheetLoaded(stylesheetPath) {
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      if (sheet.href && sheet.href.includes(stylesheetPath)) {
        return true;
      }
    }
    return false;
  }

export function loadStylesheet(documentNode, path){
  const head = documentNode.getElementsByTagName('HEAD')[0];
  const link = documentNode.createElement('link');

  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = root_prefix + '/' + path;
  head.appendChild(link);
}