const mysql = require('mysql')
const russianWords = require('./russianWords')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})


const wordsSQL = async (req,res) => {
    try {
        const lang = req.path.slice(1)
        const frequentwords = await russianWords()
        const words = frequentwords.map(obj => [Object.values(obj)]) 
        const values = [].concat.apply([], words);
        const sql = `REPLACE INTO ${lang} (word_id,word,vID,pronunciation,grammar) VALUES ?`
        db.query(sql,[values],(err,result) => {
            if (err) res.json(err);
            res.json('finished russian words')
        })
    }
    catch(error) {
        console.log(error)
    }
}


module.exports = wordsSQL