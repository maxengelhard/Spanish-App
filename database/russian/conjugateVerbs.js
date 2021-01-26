const axios = require('axios')
const cheerio = require('cheerio')


async function conjugateVerbs(page_url) {
    let conjugations = []
    try {
        const {data} = await axios.get(page_url);
        const $ = cheerio.load(data)

        const thisVerb = $('div.bare').find('span')[0].children[0].data

        const imperative = $('div.imperative').find('td').find('span')
        const singleImperative = imperative[0].children.length >0 ? imperative[0].children[0].data : ''
        const plrImperative = imperative[1].children.length >0 ? imperative[1].children[0].data : ''


        const past = $('div.past').find('td').find('span')

        const pastM = past[0].children.length > 0 ? past[0].children[0].data : ''
        const pastF = past[1].children.length > 0 ? past[1].children[0].data : ''
        const pastN = past[2].children.length > 0? past[2].children[0].data : '' 
        const pastPlr = past[3].children.length > 0 ? past[3].children[0].data : ''


        const presfut = $('div.presfut').find('tr')

        const presI = presfut.find('span')[0].children.length > 0  ? presfut.find('span')[0].children[0].data : ''
        const futI = presfut.find('td.onedit-hide')[0].children.length > 0 ? presfut.find('td.onedit-hide')[0].children[0].data:''
        const presYou = presfut.find('span')[1].children.length > 0 ? presfut.find('span')[1].children[0].data:''
        const futYou = presfut.find('td.onedit-hide')[1].children.length > 0 ? presfut.find('td.onedit-hide')[1].children[0].data:''
        const presIt = presfut.find('span')[2].children.length > 0 ? presfut.find('span')[2].children[0].data:''
        const futIt = presfut.find('td.onedit-hide')[2].children.length > 0 ? presfut.find('td.onedit-hide')[2].children[0].data:''
        const presWe = presfut.find('span')[3].children.length > 0 ? presfut.find('span')[3].children[0].data:''
        const futWe = presfut.find('td.onedit-hide')[3].children.length > 0 ? presfut.find('td.onedit-hide')[3].children[0].data:''
        const presYouAll = presfut.find('span')[4].children.length > 0 ? presfut.find('span')[4].children[0].data:''
        const futYouAll = presfut.find('td.onedit-hide')[4].children.length > 0 ? presfut.find('td.onedit-hide')[4].children[0].data:''
        const presThey = presfut.find('span')[5].children.length > 0 ? presfut.find('span')[5].children[0].data:''
        const futThey = presfut.find('td.onedit-hide')[5].children.length > 0 ? presfut.find('td.onedit-hide')[5].children[0].data:''
        
        conjugations.push(
            thisVerb,
            singleImperative,
            plrImperative,
            pastM,
            pastF,
            pastN,
            pastPlr,
            presI,
            presYou,
            presIt,
            presWe,
            presYouAll,
            presThey,
            futI,
            futYou,
            futIt,
            futWe,
            futYouAll,
            futThey)
        
        console.log(`${thisVerb} done`)
        return conjugations
}
    catch(error) {
        const empty = new Array(19).fill('')
        return empty
    }


}




module.exports = conjugateVerbs


