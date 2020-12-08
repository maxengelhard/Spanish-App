const axios = require('axios')
const cheerio = require('cheerio')

// using axios


async function getSentences(page_url,word_id) {
    try {
    let sentenceArr = []
    
    let {data} = await axios.get(page_url);
    let $ = cheerio.load(data)
    let usage = $('#dictionary-neodict-es').find('div._3aQ9irLD')
    if (usage.length ===0) {
        let {data} = await axios.get(page_url+'?langFrom=es');
        $ = cheerio.load(data)
        usage = $('#dictionary-neodict-es').find('div._3aQ9irLD')
    }
    

    usage.each((i,useCase) => {
        // each has number associtated
        const numberUse = $(useCase).find('span._2M9naesu')
        const innerSelections = $(useCase).find('div._1IN7ttrU')
        let sum = 0;
        innerSelections.each((i,number) => {
            const increment = $(number).find('span._2M9naesu').length
            const use = numberUse[i+sum].children[0].data
            sum += increment
            const upperSpan = $(number).find('div._3ne2Sqvz')
            const translation = $(number).find('a._1UD6CASd, span.hNI9vSMp')
            upperSpan.each((index,translate) => {
                const spanSelect = $(translate).find('span._1f2Xuesa')
                const engSelect = $(translate).find('span._3WrcYAGx')
                const transData = translation[index].children[0].data
                spanSelect.each(j => {
                const spanData = spanSelect[j].children[0].data
                const engData = engSelect[j].children[0].data
                sentenceArr.push({word_id: word_id, usage: `${use}: ${transData}`, spanish: spanData, english: engData})
                })
                
            })
        })
    })

    const verb = $('div._2v8iz7Ez').length > 0 ? $('h1._1xnuU6l-')[0].children[0].data: null

     return [sentenceArr,verb]
}
catch(error) {
    console.log(error)
    return [{word_id: 50001, usage: '', spanish: '', english: ''},null]
}
}



module.exports = getSentences