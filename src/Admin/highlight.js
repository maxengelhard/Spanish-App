const higlight = (str,learnedWords) => {
    const wordArr = str.toLowerCase().split(' ')
    return wordArr.reduce((sentence, word) => {
        const plural = word[word.length-1] ==='s' ? word.slice(0,word.length-1) !== 'no' ? word.slice(0,word.length-1) :false : false
        
        const punc = word.match('\\?|\\!|¿|¡|\\.|\\,')
        if (punc) {
            const puncWord = punc.input.slice(0,punc.index) + punc.input.slice(punc.index+1)
            if (learnedWords.includes(puncWord) || learnedWords.includes(plural) || learnedWords.includes(puncWord + 's')) {
                return `${sentence + word.toUpperCase()} `
            }
        }
        else if (learnedWords.includes(word) || learnedWords.includes(plural) || learnedWords.includes(word + 's')) {
        return `${sentence + word.toUpperCase()} `
        }
    return `${sentence + word} `
    }, '').trim()

}

module.exports = higlight 