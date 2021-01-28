const axios = require('axios')
const cheerio = require('cheerio')


async function caseAdj(page_url) {
    let caseAdj = []
    try {
        const {data} = await axios.get(page_url);
        const $ = cheerio.load(data)

        const thisAdj = $('div.bare').find('span')[0].children[0].data

        const table = $('div.table-container').find('table').find('td').find('span')

        
        const mNom = table[0].children[0].data
        const mGen = table[4].children[0].data
        const mDat = table[8].children[0].data
        const mAcu = table[12].children[0].data
        const mIns = table[16].children[0].data
        const mPre = table[20].children[0].data
        const fNom = table[1].children[0].data
        const fGen = table[5].children[0].data
        const fDat = table[9].children[0].data
        const fAcu = table[13].children[0].data
        const fIns = table[17].children[0].data
        const fPre = table[21].children[0].data
        const nNom = table[2].children[0].data
        const nGen = table[6].children[0].data
        const nDat = table[10].children[0].data
        const nAcu = table[14].children[0].data
        const nIns = table[18].children[0].data
        const nPre = table[22].children[0].data
        const pNom = table[3].children[0].data
        const pGen = table[7].children[0].data
        const pDat = table[11].children[0].data
        const pAcu = table[15].children[0].data
        const pIns = table[19].children[0].data
        const pPre = table[23].children[0].data
    
        caseAdj.push(
        thisAdj,
        mNom, 
        mGen, 
        mDat, 
        mAcu, 
        mIns, 
        mPre, 
        fNom, 
        fGen, 
        fDat, 
        fAcu, 
        fIns, 
        fPre, 
        nNom, 
        nGen, 
        nDat, 
        nAcu, 
        nIns, 
        nPre, 
        pNom, 
        pGen, 
        pDat, 
        pAcu, 
        pIns, 
        pPre, 
        )
        
        console.log(`${thisAdj} done`)
        
        return caseAdj
}
    catch(error) {
        const urlLength = 'https://en.openrussian.org/ru/'.length
        const word = decodeURI(page_url.slice(urlLength))
        const empty = new Array(24).fill('')
        empty.unshift(word)
        return empty
    }


}


////////////////////////////////////////////////////////////////////////////// 
// then make the sql

const asyncForEach = require('../asyncForEach')
const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})


const adjSQL = async (req,res) => {
    try {
        // get all the words from russian
        let sql="SELECT grammar, word,word_id FROM wordsrussian"
        db.query(sql, async (err,words) => {
            // filter only the verbs
        const adjectives = words.filter(obj => (obj.grammar.includes('adjectival') || obj.grammar ==='adjective'))
        // itereate over and return the conjugations
        let count = 0
        await asyncForEach(adjectives, async (obj) => {
            count++
            const adjective = obj.word
            const word_id = obj.word_id
            const url = 'https://en.openrussian.org/ru/' + encodeURI(adjective)
            const result = await caseAdj(url)
            result.unshift(count)
            result.push(word_id)
            const values = [result]
        sql = 'REPLACE INTO adjectivesrussian VALUES ?'
        db.query(sql,[values], async (err,result) => {
            if (err) throw err;
        })
        })

        res.json('finished russian adjectives')
        
        
        })
    }
    catch(error) {
        console.log(error)
    }
}


module.exports = adjSQL

