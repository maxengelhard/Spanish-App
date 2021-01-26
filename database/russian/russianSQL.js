const mysql = require('mysql')
const examples = require('../examples')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const russianSQL = async (req,res) => {
    try {
        // get all the words from russian
        let sql="SELECT * FROM wordsrussian"
        db.query(sql, async (err,words) => {
        if (err) throw err;
        let day = 0;
        while (day <500) {
            const section = words.slice(day*10,(day+1)*10)
            const exampleObjs = await examples(section)
            const values = exampleObjs.map(obj => Object.values(obj))
            day++
            sql="REPLACE INTO sentencesrussian (way,russianS,englishS,word_id) VALUES ?"
            db.query(sql,[values],(err,result) => {
                if (err) throw err;
                console.log(`day ${day} finsihed`)
            })
            
        }
        res.send('finsihed russian!')

        })
       

    }
    catch(error) {
        console.log(error)
    }
}

module.exports = russianSQL

