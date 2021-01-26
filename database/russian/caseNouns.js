const axios = require('axios')
const cheerio = require('cheerio')


async function caseNouns(page_url) {
    let caseNouns = []
    try {
        const {data} = await axios.get(page_url);
        const $ = cheerio.load(data)

        const thisNoun = $('div.bare').find('span')[0].children[0].data
        const grammar = $('div.info')[0].children[0].data.trim()

        const table = $('table.mode-normal').find('td').find('span')
        const sNom = table[0].children[0].data
        const sGen = table[2].children[0].data
        const sDat = table[4].children[0].data
        const sAcu = table[6].children[0].data
        const sIns = table[8].children[0].data
        const sPre = table[10].children[0].data
        const pNom = table[1].children[0].data
        const pGen = table[3].children[0].data
        const pDat = table[5].children[0].data
        const pAcu = table[7].children[0].data
        const pIns = table[9].children[0].data
        const pPre = table[11].children[0].data
    
        caseNouns.push(
            thisNoun,
            grammar,
            sNom,
            sGen,
            sDat,
            sAcu,
            sIns,
            sPre,
            pNom,
            pGen,
            pDat,
            pAcu,
            pIns,
            pPre)
        
        console.log(`${thisNoun} done`)
        return caseNouns
}
    catch(error) {
        const urlLength = 'https://en.openrussian.org/ru/'.length
        const word = decodeURI(page_url.slice(urlLength))
        const empty = new Array(13).fill('')
        empty.unshift(word)
        return empty
    }


}



module.exports = caseNouns


