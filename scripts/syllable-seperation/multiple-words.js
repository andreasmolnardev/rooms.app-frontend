export function fetch_n_Words(sentence) {
    return new Promise((resolve, reject) => {
        const array = sentence.split(" ");
        let sentence_seperated = "";

        array.forEach(word => {
            let seperationSpace = "";

            if (array.indexOf(word) > 0) {
                seperationSpace = " ";
            }

            fetchWord(word).then((seperatedWord) => {
                if (seperatedWord == word) {
                    sentence_seperated += seperationSpace + seperatedWord;
                } else if (seperatedWord.includes('<span class="hilight">-</span>')) {
                    sentence_seperated += seperationSpace + seperatedWord.replaceAll('<span class="hilight">-</span>', '&shy;')
                } else {
                    reject(error);
                }

                if(array.indexOf(word) == (array.length - 1)){
                    resolve(sentence_seperated)
                }
            }).catch((error) => {
                reject(error);
            })
        });
    })
}