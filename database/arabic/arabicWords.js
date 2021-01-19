const arr = require('../frequentWords/2016/ar/ar_50k')

const getFrequentWords = () => {
    return arr.map((word,i) => {
        const currentWord = word.split(' ')[0]
        const verb = null
        const pronunciation = null
        const grammar = null
        return {id: i, word: currentWord, vID: verb, pronunciation, grammar}
    })

}


module.exports = getFrequentWords