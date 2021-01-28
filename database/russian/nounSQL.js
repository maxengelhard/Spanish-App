const mysql = require('mysql')
const caseNouns = require('./caseNouns')
const asyncForEach = require('../asyncForEach')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})


const nounSQL = async (req,res) => {
    try {
        // get all the words from russian
        let sql="SELECT grammar, word,word_id FROM wordsrussian"
        db.query(sql, async (err,words) => {
            // filter only the verbs
        const nouns = words.filter(obj => (obj.grammar === 'substantive' || obj.grammar ==='s'))
        // itereate over and return the conjugations
        let count = 0
        await asyncForEach(nouns, async (obj) => {
            count++
            const noun = obj.word
            const word_id = obj.word_id
            const url = 'https://en.openrussian.org/ru/' + encodeURI(noun)
            const result = await caseNouns(url)
            result.unshift(count)
            result.push(word_id)
            const values = [result]
        sql = 'REPLACE INTO nounsrussian VALUES ?'
        db.query(sql,[values], async (err,result) => {
            if (err) throw err;
        })
        })

        res.json('finished russian nouns')
        
        
        })
    }
    catch(error) {
        console.log(error)
    }
}


module.exports = nounSQL