const axios = require('axios')
const cheerio = require('cheerio')

const cap = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

async function conjugateVerbs(page_url) {
    let conjugations = []
    try {
        const {data} = await axios.get(page_url);
        const $ = cheerio.load(data)

        const thisVerb = $('h1._1xnuU6l-')[0].children[0].data
        
        const hrefPres = $('div._2xfncFkp').find('a')[0].attribs['href']
        const hrefpas = $('div._2xfncFkp').find('a')[1].attribs['href']
        const presentParticiple = hrefPres.slice(10,hrefPres.indexOf('?'))
        const pastParticiple = hrefpas.slice(10,hrefpas.indexOf('?'))
        conjugations.push({thisVerb},{presentParticiple},{pastParticiple})
        const persons = {
            0: 'Yo',
            1: 'Tu',
            2: 'El',
            3: 'Nos',
            4: 'Vos',
            5: 'Ellos'
        }
        const form = {
            0: 'present',
            1: 'preterite',
            2: 'imperfect',
            3: 'conditional',
            4: 'future'
        }

        const indicativeTable = $('table._2qmJM3i9')
        const rows = $(indicativeTable).find('td._2UqTZCc2')
        const label = $(indicativeTable).find("[aria-label]")

        rows.each(i => {
            // for indicative
            if (i <6) {
                for (let j=0; j<5;j++) {
                    const ariaLabel = label[5*i+j].attribs['aria-label']
                    conjugations.push({[`${form[j]}${persons[i%6]}`]: ariaLabel})
                } 

            } 
            // for subjunctive
            else if (i <12) {
                for (let j=0; j<2;j++) {
                    const f = j===0 ? 0: 2
                   const ariaLabel = label[4*i+j+6].attribs['aria-label']
                    conjugations.push({[`sub${cap(form[f])}${persons[i%6]}`]: ariaLabel})
                }
            }
            
        })
        return conjugations
}
    catch(error) {
        const example = {'verb':"ser","presentYo":"soy","presentTu":"eres","presentEl":"es","presentNos":"somos","presentVos":"sois","presentEllos":"son","preteriteYo":"fui","preteriteTu":"fuiste","preteriteEl":"fue","preteriteNos":"fuimos","preteriteVos":"fuisteis","preteriteEllos":"fueron","imperfectYo":"era","imperfectTu":"eras","imperfectEl":"era","imperfectNos":"éramos","imperfectVos":"erais","imperfectEllos":"eran","conditionalYo":"sería","conditionalTu":"serías","conditionalEl":"sería","conditionalNos":"seríamos","conditionalVos":"seríais","conditionalEllos":"serían","futureYo":"seré","futureTu":"serás","futureEl":"será","futureNos":"seremos","futureVos":"seréis","futureEllos":"serán","presentParticiple":"siendo","pastParticiple":"sido","subPresentYo":"sea","subPresentTu":"seas","subPresentEl":"sea","subPresentNos":"seamos","subPresentVos":"seáis","subPresentEllos":"sean","subImperfectYo":"fuera","subImperfectTu":"fueras","subImperfectEl":"fuera","subImperfectNos":"fuéramos","subImperfectVos":"fuerais","subImperfectEllos":"fueran"}
        let nullObj = {}
        for (let key in example) {
            nullObj[key] = null
        }
        conjugations.push(nullObj)
        console.log(error)
        return conjugations
        
    }


}




module.exports = conjugateVerbs


