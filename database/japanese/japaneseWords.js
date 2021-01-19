const axios = require('axios')
const cheerio = require('cheerio')

const page_url = `https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/Japanese`


// using axios

async function getFrequentWords() {
    // start the frequent words back to an empty array
    let frequentWords = []
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const list = $('#mw-content-text > div.mw-parser-output > ol > li > span > a')
    const sliced = list.slice(0,5000)
    sliced.each((i,word) => {
        const currentWord = $(word).text()
        const thisWord = currentWord.includes('|') ? currentWord.slice(0,currentWord.indexOf('#')) : currentWord
        const verb = null
        const pronunciation = null
        const grammar = null
        frequentWords.push({id: i, word: thisWord, vID: verb, pronunciation, grammar})
    })

    return frequentWords
}



module.exports = getFrequentWords