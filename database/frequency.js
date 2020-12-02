const axios = require('axios')
const cheerio = require('cheerio')
const getSentences = require('./sentences')

const page_url = `https://en.wiktionary.org/wiki/User:Matthias_Buchmeier/Spanish_frequency_list-1-5000`
const dict_url = `https://www.spanishdict.com/translate/`
const engEnd = '?langFrom=es'


let frequentWords = []


// getSentences(dict_url+'a').then(data => console.log(data)).catch(err => console.log(err))

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

// create an async for Each function
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
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


async function getEnglishSentences(arr) {
    await arr
    await asyncForEach(arr, async (object) => {
        object.sentences = await getSentences(`${dict_url}${object.word}${engEnd}`,object.word_id)
        console.log(`word ${object.word_id} done`)
    })
    return arr

}

async function getSpanishSentences(arr) {
    await arr
    await asyncForEach(arr, async (object) => {
        object.sentences = await getSentences(`${dict_url}${object.word}`,object.word_id)
        console.log(`word ${object.word_id} done`)
    })
    return arr

}


    

    


// const span_url = `https://www.spanishdict.com/translate/${currentWord}`

//         async function getSentences() {
//         const {newData} = await axios.get(span_url);
//         const $ = cheerio.load(newData)
//         const usage = $('#dictionary-neodict-es > div > div:nth-child(2) > div._3aQ9irLD > div')
//         usage.each((i,word) => {
//         const useSelect = 'span._2M9naesu'
//         const spanSelect = 'span._1f2Xuesa'
//         const engSelect = 'span._3WrcYAGx'
//         const use = $(word).find(useSelect).text()
//         const spanishSentence = $(word).find(spanSelect).text()
//         const englishSentence = $(word).find(engSelect).text()
//         api.push({id: i, usage: use, spanish: spanishSentence, english: englishSentence})
//     })
//     console.log(api)
// }


module.exports = {
    getFrequentWords,
    pushSentences,
    asyncForEach,
    getEnglishSentences,
    getSpanishSentences

}

