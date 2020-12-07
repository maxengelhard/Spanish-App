const axios = require('axios')
const cheerio = require('cheerio')

// using axios


async function getSentences(page_url,word_id) {
    try {
    let sentenceArr = []
    
    const {data} = await axios.get(page_url);
    const $ = cheerio.load(data)
    const usage = $('#dictionary-neodict-es').find('div._3aQ9irLD')
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
                console.log(spanSelect.length)
                spanSelect.each(j => {
                const spanData = spanSelect[j].children[0].data
                const engData = engSelect[j].children[0].data
                sentenceArr.push({word_id: word_id, usage: `${use}: ${transData}`, spanish: spanData, english: engData})
                })
                
            })
        })
    })

    let verbs = []
    const verb = $('div._2v8iz7Ez').length
    if (verb > 0) {
        const thisVerb = $('h1._1xnuU6l-')[0].children[0].data
        const presentParticple = $('div._2xfncFkp').find('span')[0].children[0].data
        const pastParticple = $('div._2xfncFkp').find('span')[1].children[0].data
        verbs.push({thisVerb},{presentParticple},{pastParticple})
        const persons = {
            0: 'Yo',
            1: 'Tu',
            2: 'El',
            3: 'Nos',
            4: 'Vos',
            5: 'Ellos'
        }
        const indicativeTable = $('table._2qmJM3i9')
        const rows = $(indicativeTable).find('td._2UqTZCc2')
        const label = $(indicativeTable).find("[aria-label]")

        rows.each(i => {
            for (let j=0; j<5;j++) {
                const ariaLabel = label[5*i+j].attribs['aria-label']
                verbs.push({[`${persons[i]}${j}`]: ariaLabel})
            } 
            
        })


    }

     return [sentenceArr,verbs]
}
catch(error) {
    console.log(error)
    return [{word_id: 50001, usage: '', spanish: '', english: ''}]
}
}

async function call() {
    const result1 = await getSentences('https://www.spanishdict.com/translate/estoy',10)
    // const result2 = await getSentences('https://www.spanishdict.com/translate/me?langFrom=es',10)
    console.log(result1)
}

call()

// module.exports = getSentences