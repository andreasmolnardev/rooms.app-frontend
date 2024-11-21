import { root_prefix } from "./root.js";
import { customSelect } from "./custom-select/custom-select.js";
import { mutationObserverQuickadd } from "../shortcuts/mutation-observer.quickadd.js";
import { isStylesheetLoaded, loadStylesheet } from "../shortcuts/stylesheet-tools.js";

let components = { "custom-select": [] };

Object.keys(components).forEach(component => {
    mutationObserverQuickadd(document.body, (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains(component)) {
                        if (isStylesheetLoaded(`components/${component}/style.css`)) {
                            registerComponentNode(component, node)
                        } else {
                            loadStylesheet(document, `components/${component}/style.css`)
                            registerComponentNode(component, node)
                        }
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        const newSelectItems = node.querySelectorAll(".custom-select")
                        if (newSelectItems) {
                            Array.from(newSelectItems).forEach(newSelect => {
                                if (isStylesheetLoaded(`components/${component}/style.css`)) {
                                    registerComponentNode(component, newSelect)
                                } else {
                                    loadStylesheet(document, `components/${component}/style.css`)
                                    registerComponentNode(component, newSelect)
                                }
                            })
                        }

                    }
                }
            }
        }
    }, { childList: true, subtree: true })

    let component_nodes = document.getElementsByClassName(component);

    if (component_nodes) {

        let head = document.getElementsByTagName('HEAD')[0];
        let link = document.createElement('link');

        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = root_prefix + `components/${component}/style.css`;
        head.appendChild(link);


        if (component == "custom-select") {
            for (let index = 0; index < component_nodes.length; index++) {
                let occurance = component_nodes[index]
                /* let node = new customSelect(occurance, occurance.querySelector(".select-items"));
                 console.info("component registered: " + occurance)
                 node.id = occurance.getAttribute('id')
                 components["custom-select"].push(node);
                */
                registerComponentNode(component, occurance)
            }


        } else {

        }


    }
})

function registerComponentNode(componentType, node) {
    if (componentType == "custom-select") {
        const component = new customSelect(node, node.querySelector(".select-items"))
        component.id = node.getAttribute('id')
        components[componentType].push(component);

        document.body.dispatchEvent(new Event(component.id + '-added'));

    } else {

    }


}

export { components };