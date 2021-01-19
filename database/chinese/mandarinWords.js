const axios = require('axios')
const cheerio = require('cheerio')
const asyncForEach = require('../asyncForEach')

const page_url = `https://en.wiktionary.org/wiki/Appendix:Mandarin_Frequency_lists/`



// using axios

async function getFrequentWords() {
    // start the frequent words back to an empty array
    // every 1,0000 words we increment
    let frequentWords = []
    // let vID = 0

    await asyncForEach([1,2,3,4,5], async(page) => {
    const ending = `${1+(page-1)*1000}-${page*1000}`
    const {data} = await axios.get(page_url+ending);
    const $ = cheerio.load(data)
    const list = $('#mw-content-text > div.mw-parser-output > table > tbody > tr').not('#mw-content-text > div.mw-parser-output > table > tbody > tr:nth-child(1)')
    list.each((i,row) => {
        const id = i+((page-1)*1000)
        const traditional = $(row).find('td')[0].children[0].children[0].children[0].data
        const simplified = $(row).find('td')[1].children[0].children[0].children[0].data
        const pronunciation = $(row).find('td')[2].children[0].children[0].children[0].data
        const verb = null
        const grammar = null
        
        
        frequentWords.push({id, word: traditional, vID: verb, pronunciation, grammar})
    })
    })

    return frequentWords
}




module.exports = getFrequentWords