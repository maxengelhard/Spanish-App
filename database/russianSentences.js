const axios = require('axios')
const cheerio = require('cheerio')
const asyncForEach = require('./asyncForEach')

async function getSentences(page_url,word_id) {
    try {
    let sentenceArr = []
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const translation = $('div.translations').find('li').not('li.prototype').find('p.tl')
    let allTranslations = ''
    translation.each((i,text) => {
        if (i===translation.length-1) {
        allTranslations += $(text).text()
        } else {
        allTranslations += `${$(text).text()}, `
        }
    })
    const examples = $('ul.sentences.more-less-paging').find('li')
    
    examples.each((i,example) => {
        const russianS = example.attribs['data-bare-ru']
        const englishS = $(example).find('span.tl').text()
        sentenceArr.push({word_id,translation: allTranslations,russianS,englishS})

    })
    return sentenceArr

}
catch(error) {
    console.log(error)
    return [{word_id: 50001, usage: '', spanish: '', english: ''},null]
}
}


const createArr = async (arr) => {
    let final = []
    asyncForEach(obj => {

    })
}



getSentences('https://en.openrussian.org/ru/%D1%81%D0%B5%D0%B9%D1%87%D0%B0%D1%81')
