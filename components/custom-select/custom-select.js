export class customSelect {
    id; 
    selectDom;
    selectItems;
    selectedOption;
    selectLabel;
    name;
    options = [];

    constructor(item, customSelectItemDiv) {

        this.selectDom = item;
        this.selectItems = item.querySelector(".select-items");
        this.selectLabel = item.querySelector(".select-label")
        this.name = "select-receiver";

        let self = this;

        const config = {
            childList: true
        };

        const callback = function (mutationsList, observer) {
            for (const mutation of mutationsList) {

                for (let index = 0; index < mutation.addedNodes.length; index++) {
                    let node = mutation.addedNodes[index];



                    if (node.tagName === "LABEL") {

                        node.querySelector('input[type="radio"]').addEventListener('change', () => {

                            if (node.querySelector('input[type="radio"]').checked == true) {
                               self.selectDom = node.parentElement.parentElement;

                                self.selectDom.querySelector(".select-label").innerText = node.textContent;
                                self.selectDom.querySelector(".select-box input").checked = false;
                                self.selectedOption = self.options.find(option => option.option_id = node.querySelector("input:checked").getAttribute('id'))
                                self.selectedOption.isChecked = true;
                                //self.selectDom.dispatchEvent(new Event("change"));

                            } else {
                                console.log("Failover Breakpoint activated: " + node.checked)
                            }
                        })


                    }
                }

            }
        };

        const observer = new MutationObserver(callback);

        observer.observe(customSelectItemDiv, config)



    }


    get checkedRadio() {
        return this.options.find(option => option.isChecked);
    }


    addOption(option_title, option_id, name) {
        this.options.push(new customSelectOption(this.selectItems, option_title, option_id, name))
    }




}


export class customSelectOption {

    selectItems;
    option_title;
    option_id;
    name;
    isChecked;
    domElement;

    constructor(selectItems, option_title, option_id, name) {
        this.selectItems = selectItems;
        this.option_title = option_title;
        this.option_id = option_id;
        this.name = name;
        this.isChecked = false;

        this.domElement = `<label for="${this.option_id}"><input type="radio" name="${this.name}" id="${this.option_id}" form="${selectItems.getAttribute('id')}">${option_title}</label>`;


        selectItems.insertAdjacentHTML('beforeend', this.domElement);



    }

    select() {
        this.isChecked = true;
    }
}