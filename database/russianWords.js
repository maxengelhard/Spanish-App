const axios = require('axios')
const cheerio = require('cheerio')
const asyncForEach = require('./asyncForEach')

const page_url = `https://en.wiktionary.org/wiki/Appendix:Frequency_dictionary_of_the_modern_Russian_language_(the_Russian_National_Corpus)/`

let frequentWords = []

// using axios

async function getFrequentWords() {
    // start the frequent words back to an empty array
    // every 1,0000 words we increment
    frequentWords = []
    let vID = 0

    await asyncForEach([1,2,3,4,5], async(page) => {
    const {data} = await axios.get(page_url+page);
    const $ = cheerio.load(data)
    const list = $('#mw-content-text > div.mw-parser-output > ol > li')
    list.each((i,word) => {
        const id = i+((page-1)*1000)
        const currentWord = $(word).find('a').text()
        const pronunciation = $(word).find('span.tr.Latn').text()
        const grammar = $(word).find('span.ann-pos').text()
        const verb = grammar === 'verb' ? vID+=1 : null

        frequentWords.push({id, word: currentWord, vID: verb, pronunciation, grammar})
    })
    })

    return frequentWords
}

module.exports = getFrequentWords
