const axios = require('axios')
const cheerio = require('cheerio')

const page_url = `https://en.wiktionary.org/wiki/User:Matthias_Buchmeier/German_frequency_list-1-5000`

let frequentWords = []

// using axios

async function getFrequentWords() {
    // start the frequent words back to an empty array
    frequentWords = []
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const list = $('#mw-content-text > div.mw-parser-output > p > a')
    list.each((i,word) => {
        const currentWord = $(word).text()
        // need this becuase there is a bug in the html
        if (currentWord.length > 30) {
            return true
        }
        const verb = null
        const pronunciation = null
        const grammar = null
        frequentWords.push({id: i, word: currentWord, vID: verb, pronunciation, grammar})
    })

    return frequentWords
}

module.exports = getFrequentWords