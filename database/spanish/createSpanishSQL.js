const mysql = require('mysql')
const {getSpanishSentences} = require('./frequency')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const createSpanishSQL = async (req,res) => {
        try {
            let sql = "SELECT * FROM words"
                db.query(sql, async (err,words) => {
                    if (err) throw err;
                    let days = 0;
                    uniqueverbs = []
                    while (days < 5000) {
                        const end = days+10 > 5000 ? 5000: days+10
                        const eachArr = words.slice(days,end)
                        days += 10
                        sql = 'INSERT INTO sentences (way,spanishS,englishS,word_id) VALUES ?;'
                        const array = await getSpanishSentences(eachArr)
                        const sentences = array.map(word => word.sentences[0].map(usage => [usage.usage, usage.spanish, usage.english, usage.word_id]))
                        const values = [].concat.apply([], sentences);
                db.query(sql, [values], (err,result) => {
                if (err) throw err;
                })
                sql = "INSERT INTO verbs (verb) VALUES ?;"
                const verbs = [...new Set(array.map(word => word.sentences[1]).filter(verbs => (verbs === null || uniqueverbs.includes(verbs) ? false:true)))]
                if (verbs.length > 0) {
                    uniqueverbs.push(...verbs)
                const sqlverbs = verbs.map(verb => [verb])
                        db.query(sql,[sqlverbs],(err) => {
                            if (err) throw err;
                        })

                }
                
                }
                
                res.send('finsihed test')
                
                })
                
        
        }
        catch(error) {
                console.log(error)
        
            }
        
        
    }





module.exports = createSpanishSQL