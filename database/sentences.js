const axios = require('axios')
const cheerio = require('cheerio')

// using axios
const shorter = (str) => str.slice(0,255)

async function getSentences(page_url,word_id) {
    try {
    let sentenceArr = []
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const usage = $('#dictionary-neodict-es > div > div:nth-child(2) > div._3aQ9irLD > div')
    // const list = $('#dictionary-neodict-es > div > div:nth-child(2) > div._3aQ9irLD > div > div._1IN7ttrU > div > div > div._3ne2Sqvz > div')
    usage.each((i,word) => {
        const useSelect = 'span._2M9naesu'
        const spanSelect = 'span._1f2Xuesa'
        const engSelect = 'span._3WrcYAGx'
        const use = $(word).find(useSelect).text()
        const spanish = $(word).find(spanSelect).text().length >255 ? shorter($(word).find(spanSelect).text()) : $(word).find(spanSelect).text()
        const english = $(word).find(engSelect).text().length >255 ? shorter($(word).find(engSelect).text()) : $(word).find(engSelect).text()
        sentenceArr.push({word_id: word_id, usage: use, spanish: spanish, english: english})
    })

     return sentenceArr
}
catch(error) {
    return [{word_id: 50001, usage: '', spanish: '', english: ''}]
}
}


 module.exports = getSentences;