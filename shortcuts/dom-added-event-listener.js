/*** Adds an event listener to an object after it has been added to the DOM
 */

import { mutationObserverQuickadd } from "./mutation-observer.quickadd.js";

export function addDelayedEventListener(nodeId, eventType, callback, nodeIdentifierType) {
    mutationObserverQuickadd(document.body, (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                console.log(node)

                let selectorType;

                if (nodeIdentifierType && nodeIdentifierType == "id" || !nodeIdentifierType) {
                    selectorType = "#"
                } else if (nodeIdentifierType && nodeIdentifierType == "class") {
                    selectorType = "."
                }

                if (node.nodeType === Node.ELEMENT_NODE && ((nodeIdentifierType == "id" && node.id == nodeId || !nodeIdentifierType && node.id == nodeId) || nodeIdentifierType == "class" && node.classList.includes(nodeId))) {
                    //element has been added directly
                    console.warn('Adding delayed event listener for element with id: ' + nodeId)

                    const objectNode = node;
                    console.log("added event listener")
                    objectNode.addEventListener(eventType, () => callback(objectNode))
                    observer.disconnect();
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    //element may have been added as a child

                    const objectNode = node.querySelector(selectorType + nodeId)
                    if (objectNode) {
                        console.warn('Adding delayed event listener for element with id: ' + nodeId)
                        objectNode.addEventListener(eventType, () => callback(objectNode))
                        console.log("added event listener")
                    }
                    observer.disconnect();
                }

            }
        }
    }, { childList: true, subtree: true })
}
