export function getPreviousSiblingWithClass(element, className) {
    let sibling = element.previousElementSibling;
    while (sibling) {
      if (sibling.classList.contains(className)) {
        return sibling;
      }
      sibling = sibling.previousElementSibling;
    }
    return null;
  }