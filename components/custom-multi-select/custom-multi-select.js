export class customMultiSelect {
    domEl;
    id;
    selectedItems;
    options;

    constructor(item) {

        this.domEl = item
        this.id = item.id;

        let self = this;

        const config = {
            childList: true
        };

        this.selectedItems = [];

        const callback = function (mutationsList, observer) {
            for (const mutation of mutationsList) {

                for (let index = 0; index < mutation.addedNodes.length; index++) {
                    let node = mutation.addedNodes[index];

                    if (node.tagName === "LI") {

                        node.addEventListener('click', () => {
                            const selectedOption = self.options.find(option => option.option_id == node.dataset.id)

                            item.querySelector(".selected").insertAdjacentHTML('afterbegin', /*html*/`
                                <li data-id="invite-${node.dataset.id}" class="includes-gap center">${node.textContent}<span onclick="
                                this.parentElement.remove();
                                console.log('${self.id}')
                                document.querySelector('#${self.id} .results li[data-id = &quot;${node.dataset.id}&quot;]').dataset.availableForSelect = 'true';
                                document.querySelector('#${self.id} .results li[data-id = &quot;${node.dataset.id}&quot;]').style.display = &quot;block&quot;;
                                console.log('test')
                                 self.options.find(option => option.option_id == '${node.dataset.id}').deselect();
                                 "><i class="vf-ic_fluent_dismiss_circle_24_fille"></i></span></li>`);

                            node.dataset.availableForSelect = "false";
                            node.style.display = "none";

                            //push option to selectedItems
                            selectedOption.select();

                            self.selectedItems.push(selectedOption)

                            console.log(selectedOption + "selected")
                        })


                    }
                }

            }
        };

        const observer = new MutationObserver(callback);

        observer.observe(item.querySelector(".results"), config)



    }


    get checkedItems() {
        let data;

        this.selectedItems.forEach(item => {
            data.push(item.option_id)
        });

        return data;
    }


    addOption(option_title, option_id, name) {
        if (!this.options) {
            this.options = [];
        }

        this.options.push(new customSelectOption(this.domEl.querySelector(".results"), option_title, option_id, name))
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
        this.selectItems = selectItems; ///the items selectBox (DOM)
        this.option_title = option_title;
        this.option_id = option_id;
        this.name = name;
        this.isChecked = false;

        this.domElement = `<li data-id="${option_id}">${option_title}</li>`;


        selectItems.insertAdjacentHTML('beforeend', this.domElement);



    }

    select() {
        this.isChecked = true;
    }

    deselect() {
        this.isChecked = false;
    }
}

