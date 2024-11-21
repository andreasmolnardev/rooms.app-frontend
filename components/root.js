let root = localStorage.getItem("root");
let root_prefix = "";

if (root != undefined) {
    root_prefix += root;
}

export {root_prefix};