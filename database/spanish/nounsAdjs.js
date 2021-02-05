const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const nounsAdjs = async (req,res) => {
    try {
        let sql="SELECT * FROM wordsspanish WHERE vID IS NULL"
        db.query(sql,(err,result) => {
            if (err) throw err;
            let nID=0;
            let aID=0;
            result.forEach(obj => {
                const {grammar,word,word_id} = obj
                if (grammar.includes('noun')) {
                    nID++
                    const nsql=`REPLACE INTO nounsspanish (nID,word,word_id) VALUES (${nID},'${word}',${word_id})`
                    db.query(nsql,(err,result) => {
                        if (err) throw err;
                        console.log(`nID:${nID} word:${word}`)
                    })
                }
                if (grammar==='adjective' || grammar.includes('hasAdj')) {
                    aID++
                    const asql=`REPLACE INTO adjectivesspanish (aID,word,word_id) VALUES (${aID},'${word}',${word_id})`
                    db.query(asql,(err,result) => {
                        if (err) throw err;
                        console.log(`aID:${aID} word:${word}`)
                    })
                }
            })
            
        })

        res.json('finsihed nouns and adjectives for later use')

    }
    catch(error) {
        console.log(error)
    }
}


module.exports = nounsAdjs