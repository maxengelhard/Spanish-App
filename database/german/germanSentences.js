const axios = require('axios')
const cheerio = require('cheerio')


async function deSentences(page_url,word_id) {
    try {
    let sentenceArr = []
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const verb = $('div.hom.sense').find('a.ref')
    
    console.log(verb.text())
    // let allTranslations = ''
    // translation.each((i,text) => {
    //     if (i===translation.length-1) {
    //     allTranslations += $(text).text()
    //     } else {
    //     allTranslations += `${$(text).text()}, `
    //     }
    // })
    // const examples = $('ul.sentences.more-less-paging').find('li')
    
    // examples.each((i,example) => {
    //     const russianS = example.attribs['data-bare-ru']
    //     const englishS = $(example).find('span.tl').text()
    //     sentenceArr.push({translation: allTranslations,russianS,englishS,word_id})

    // })
    // return sentenceArr

}
catch(error) {
    console.log(error)
    return [{word_id: 50001, usage: '', spanish: '', english: ''},null]
}
}

const url = 'https://www.collinsdictionary.com/dictionary/german-english/ist'
const url1 = 'https://www.collinsdictionary.com/dictionary/german-english/sein'
const url2 = 'https://www.collinsdictionary.com/dictionary/german-english/nicht'
const url3 = 'https://www.collinsdictionary.com/dictionary/german-english/war'
const call = async () => {
    await deSentences(url)
    await deSentences(url1)
    await deSentences(url2)
    await deSentences(url3)

}

call()