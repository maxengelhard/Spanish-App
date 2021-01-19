const axios = require('axios')
const cheerio = require('cheerio')

const page_url = `https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/Korean_5800`


// using axios

async function getFrequentWords() {
    // start the frequent words back to an empty array
    let frequentWords = []
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const list = $('#mw-content-text > div.mw-parser-output > table > tbody > tr > td > dl > dd > span > a').slice(0,5000)
    console.log(list.length)
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