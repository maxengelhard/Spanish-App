const underScore = (str,learnedWords) => {
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


module.exports = underScore

