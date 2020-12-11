const seperate = (str) => {
    let newStr = ''
    // itereate over string and find index
    for (let i=0; i< str.length;i++) {
        if ((str[i] ==='.' || str[i] ==='?' || str[i] ==='!' || str[i] === '-') && str[i+1] !== ' ' &&  i+1 !== str.length) {
            newStr += str[i] + ' '
        } else {
            newStr += str[i]
        }
    }
    return newStr
}


const higlight = (str,learnedWords) => {
    const wordArr = str.toLowerCase().split(' ')
    return wordArr.reduce((sentence, word) => {
        const punc = word.match('\\?|\\!|¿|¡|\\.|\\,')
        if (punc) {
            const puncWord = punc.input.slice(0,punc.index) + punc.input.slice(punc.index+1)
            if (learnedWords.includes(puncWord)) {
                return `${sentence + '_'} `
            }
        }
        else if (learnedWords.includes(word)) {
        return `${sentence + '_'} `
        }
    return `${sentence + word} `
    }, '').trim()

}


module.exports = {
    seperate,
    higlight,
}

