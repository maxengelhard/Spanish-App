const axios = require('axios')
const cheerio = require('cheerio')

// using axios


async function getSentences(page_url,word_id) {
    try {
    let sentenceArr = []
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const usage = $('#dictionary-neodict-es > div > div:nth-child(2) > div._3aQ9irLD > div')
    usage.each((i,word) => {
        const spanSelect = $(word).find('span._1f2Xuesa')
        const engSelect = $(word).find('span._3WrcYAGx')
        const translation = $(word).find('a._1UD6CASd')
        const use = $(word).find('span._2M9naesu').text()
        spanSelect.each(i => {
            const spanData = spanSelect[i].children[0].data
            const engData = engSelect[i].children[0].data
            const transData = translation[i] ? translation[i].children[0].data : 'No Direct Translation'
            sentenceArr.push({word_id: word_id, usage: `${use}: ${transData}`, spanish: spanData, english: engData})
        })

        
    })

     return sentenceArr
}
catch(error) {
    console.log(error)
    return [{word_id: 50001, usage: '', spanish: '', english: ''}]
}
}



module.exports = getSentences