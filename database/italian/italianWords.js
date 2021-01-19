const axios = require('axios')
const cheerio = require('cheerio')

const page_url = `https://en.wiktionary.org/wiki/User:Matthias_Buchmeier/Italian_frequency_list-1-5000`


async function getFrequentWords() {
    let frequentWords = []
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const list = $('#mw-content-text > div.mw-parser-output > ol > li > a')

    list.each((i,word) => {
        const currentWord = $(word).text()
        const verb = null
        const pronunciation = null
        const grammar = null
        frequentWords.push({id: i, word: currentWord, vID: verb, pronunciation, grammar})
    })

    return frequentWords
}


module.exports = getFrequentWords