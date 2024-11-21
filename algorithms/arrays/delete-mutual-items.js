let arrayStorage = { array1: null, arra2: null };

export function deleteMutualItems(array1, array2, blockedValue) {
    if (!Array.isArray(array1)) {
        array1 = Array.from(array1)
    }

    if (!Array.isArray(array2)) {
        array2 = Array.from(array2)
    }

    

    /*console.log(
        {
            "comparison 1": arrayStorage[array1] != array1,
            "comparison 2": arrayStorage[array2] != array2,
            "comparison 3": array1[array1.length - 1][blockedValue.key] != blockedValue.value,
            "comparison 4": array2[array2.length - 1][blockedValue.key] != blockedValue.value
        }
            )*/

    if (arrayStorage[array1] != array1 && arrayStorage[array2] != array2 && array1[array1.length - 1][blockedValue.key] != blockedValue.value && array2[array2.length - 1][blockedValue.key] != blockedValue.value) {

        arrayStorage[array1] = array1;
        arrayStorage[array2] = array2;

        let newItems = [];

        array1.forEach(element => {
            //console.log(element)
            if (!array2.find(array2_element => JSON.stringify(array2_element) === JSON.stringify(element))) {
                newItems.push(element)
            }
        });

        return(newItems);

    } else {
        return(undefined);
    }



}