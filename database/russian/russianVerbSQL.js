const mysql = require('mysql')
const conjugatethis = require('./conjugateVerbs')
const asyncForEach = require('../asyncForEach')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})


const russianSQL = async (req,res) => {
    try {
        // get all the words from russian
        let sql="SELECT grammar, word FROM wordsrussian"
        db.query(sql, async (err,words) => {
            // filter only the verbs
        const verbs = words.filter(obj => obj.grammar === 'verb')
        // itereate over and return the conjugations
        let count = 0
        await asyncForEach(verbs, async (obj) => {
            count++
            const verb = obj.word
            const url = 'https://en.openrussian.org/ru/' + encodeURI(verb)
            const result = await conjugatethis(url)
            result.unshift(count)
            const values = [result]
        sql = 'REPLACE INTO verbsrussian VALUES ?'
        db.query(sql,[values], async (err,result) => {
            if (err) throw err;
        })
        })

        res.json('finished russian verbs')
        
        
        })
    }
    catch(error) {
        console.log(error)
    }
}


module.exports = russianSQL