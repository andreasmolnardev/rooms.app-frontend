/*** Adds an event listener to an object after it has been added to the DOM
 */

import { mutationObserverQuickadd } from "./mutation-observer.quickadd.js";

export function addDelayedEventListener(nodeId, eventType, callback) {
    mutationObserverQuickadd(document.body, (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                console.log(node)
                if (node.nodeType === Node.ELEMENT_NODE && node.id == nodeId) {
                    //element has been added directly
                    console.warn('Adding delayed event listener for element with id: ' + nodeId)

                    const objectNode = node;
                    console.log("added event listener")
                    objectNode.addEventListener(eventType, callback())
                    observer.disconnect();
                } else if (node.nodeType === Node.ELEMENT_NODE){
                    //element may have been added as a child

                    const objectNode = node.querySelector(nodeId)
                    if (objectNode) {
                    console.warn('Adding delayed event listener for element with id: ' + nodeId)
                        objectNode.addEventListener(eventType, callback())
                        console.log("added event listener")    
                    }
                    observer.disconnect();
                }
            }
        }
    }, { childList: true, subtree: true })
}