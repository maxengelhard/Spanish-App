const axios = require('axios')
const cheerio = require('cheerio')
const asyncForEach = require('../asyncForEach')

const page_url = `https://en.wiktionary.org/wiki/Wiktionary:French_frequency_lists/`



// using axios

async function getFrequentWords() {
    // start the frequent words back to an empty array
    // every 1,0000 words we increment
    let frequentWords = []

    await asyncForEach(['1-2000','2001-4000','4001-6000'], async(page) => {
    const {data} = await axios.get(page_url+page);
    const $ = cheerio.load(data)
    const list = $('#mw-content-text > div.mw-parser-output > table > tbody > tr > td > ul > li')
    let index = parseInt(page.slice(0,1))
    list.each((i,word) => {
        if (index ===4) {
            index--
        }
        const id = i+((index-1)*2000)
        const extra = (id-1).toString().length +3
        const a = $(word).find('a')
        const currentWord = a.length > 0 ? a.text() : $(word).text().slice(extra)
        const pronunciation = null
        const grammar = null
        const verb = null

        frequentWords.push({id, word: currentWord, vID: verb, pronunciation, grammar})
    })
    })

    const sliced = frequentWords.slice(0,5000)
    // then slice off the last 1000 to get 5000

    return sliced
}



module.exports = getFrequentWords