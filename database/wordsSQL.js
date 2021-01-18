const mysql = require('mysql')
const russianWords = require('./russian/russianWords')
const germanWords = require('./german/germanWords')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const functions = {
    'wordsrussian': russianWords(),
    'wordsgerman': germanWords()
}


const wordsSQL = async (req,res) => {
    try {
        const lang = req.path.slice(1)
        const frequentwords = await functions[lang]
        const words = frequentwords.map(obj => [Object.values(obj)]) 
        const values = [].concat.apply([], words);
        const sql = `REPLACE INTO ${lang} (word_id,word,vID,pronunciation,grammar) VALUES ?`
        db.query(sql,[values],(err,result) => {
            if (err) res.json(err);
            res.json(`finished ${lang}`)
        })
    }
    catch(error) {
        console.log(error)
    }
}


module.exports = wordsSQL