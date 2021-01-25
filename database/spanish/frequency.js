const axios = require('axios')
const cheerio = require('cheerio')
const getSentences = require('../sentences')
const asyncForEach = require('../asyncForEach')

const page_url = `https://en.wiktionary.org/wiki/User:Matthias_Buchmeier/Spanish_frequency_list-1-5000`
const dict_url = `https://www.spanishdict.com/translate/`



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
        frequentWords.push({id: i, word: currentWord,sentences: []})
    })

    return frequentWords
}



// then push in sentences
async function pushSentences() {
    await getFrequentWords()
    await asyncForEach(frequentWords, async (object) => {
        object.sentences = await getSentences(`${dict_url}${object.word}`,object.id)
        console.log(`word ${object.id} done`)
    })
    return frequentWords 
}


async function getSpanishSentences(arr) {
    await arr
    await asyncForEach(arr, async (object) => {
        const result = await getSentences(`${dict_url}${object.word}`,object.word_id)
        object.sentences = result[0]
        object.verb = result[1]
        console.log(`word ${object.word_id} done`)
    })
    return arr

}


module.exports = {
    getFrequentWords,
    pushSentences,
    getSpanishSentences

}

