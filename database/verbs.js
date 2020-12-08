const axios = require('axios')
const cheerio = require('cheerio')

async function conjugateVerbs () {
    try {
        let conjugations = []
        const {data} = await axios.get(page_url);
        const $ = cheerio.load(data)

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
    catch(error) {
        console.log(error)
    }


}