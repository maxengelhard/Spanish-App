const express = require('express')
const {Client} = require('pg')
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const fs = require('fs')
const twenty16 = './database/frequentWords/2016'
const languages = require('./languages')
/* All Old MySQL databases
// const mysql = require('mysql')
const createSpanishSQL = require('./database/spanish/createSpanishSQL')
const createVerbsSQL = require('./database/spanish/createVerbsSQL')
const spanishGrammar = require('./database/spanish/grammar')
const spanishNounsAdjs = require('./database/spanish/nounsAdjs')
const translateSentences = require('./database/translateSentences')
const wordsSQL = require('./database/wordsSQL');
const russianSQL = require('./database/russian/russianSQL')
const russianVerbs = require('./database/russian/russianVerbSQL')
const russianNouns = require('./database/russian/nounSQL')
const russianAdjectives = require('./database/russian/adjective')
const exportCSV = require('./database/exportCSV')
const createTables = require('./database/createTables')
const migrate = require('./database/migrateCSV')
*/


// create connection mysql
// const db = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
// })

// connect
// db.connect((err) => {
//     if(err) {
//         throw err;
//     } 
//     console.log('My sql connected...')
// })

// postgres

const client = new Client({
    user: process.env.PSQLUSER,
    password: process.env.PSQLPASSWORD,
    port: process.env.PSQLPORT,
    database: process.env.PSQLDATABASE
})

client.connect()
.then(() => console.log('Postgres Connected'))
.catch(e => console.log(e))



const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.use(express.static('public'))

// after each submisson create a lesson and put in all the quesitons

/*
app.get('/postgres', async(req,res) => {
    try {
        const sql='SELECT * FROM test'
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})

//// exports as csvs
// app.get('/exportcsv', exportCSV)

// app.get('/createtables',createTables)

// app.get('/migrate', migrate)
// testing it out
app.get('/psqlrussian',async(req,res) => {
    try{
        const sql='SELECT * FROM adjectivesrussian'
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    } 
})

app.get('/mysqlrussian',async(req,res) => {
    try {
        const sql=`SELECT * FROM adjectivesrussian`
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})

//////////////////////////// OTHER LANGUAGES
// russian sql
app.get('/topwordsrussian', wordsSQL)

app.get('/russiansql', russianSQL)

app.get('/russianverbssql', russianVerbs)

app.get('/russiannounssql', russianNouns)

app.get('/russianadjsql', russianAdjectives)

app.get('/russiangrammar', async (req,res) => {
    try {
        const sql ="SELECT grammar, word, word_id FROM wordsrussian"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })

    }
    catch(error) {
        console.log(error)
    }
})

app.get('/russianwordids', async (req,res) => {
    try {
        let sql="SELECT grammar,word,word_id FROM wordsrussian"
        db.query(sql,(err,words) => {
            if (err) throw err;
            
        const nouns = words.filter(obj => (obj.grammar === 'substantive' || obj.grammar ==='s')).map((obj,i) => [obj.word_id,i])
        const adjectives = words.filter(obj => (obj.grammar.includes('adjectival') || obj.grammar ==='adjective')).map((obj,i) => [obj.word_id,i])
        const verbs = words.filter(obj => obj.grammar === 'verb').map((obj,i) => [obj.word_id,i])

        // for each of them add in the word id
        nouns.forEach(arr => {
        sql=`UPDATE nounsrussian SET word_id=${arr[0]} WHERE nID=${arr[1]}`
        db.query(sql,(err,result) => {
            if (err) throw err;
            console.log(`Noun ${arr[1]} done`)
        })
        })
        adjectives.forEach(arr => {
        sql=`UPDATE adjectivesrussian SET word_id=${arr[0]} WHERE aID=${arr[1]}`
        db.query(sql,(err,result) => {
            if (err) throw err;
            console.log(`Adjective ${arr[1]} done`)
        })
        })
        verbs.forEach(arr => {
        sql=`UPDATE verbsrussian SET word_id=${arr[0]} WHERE vID=${arr[1]}`
        db.query(sql,(err,result) => {
            if (err) throw err;
            console.log(`Verb ${arr[1]} done`)
        })
        })

        res.json('finsihed word ids')
        
    })

}
    catch(error) {
        console.log(error)
    }
})
// to make the word ids
app.get('/russianotherids', async (req,res) => {
    try {
        // 
        const sql="SELECT word_id,grammar FROM wordsrussian"
        db.query(sql,(err,words) => {
            if (err) throw err;
            let nID = 0
            let aID = 0
            // let vID = 0

        words.forEach((obj,i) => {
           const {word_id} = obj
           if (obj.grammar === 'substantive' || obj.grammar ==='s') {
               const nSQL=`UPDATE wordsrussian SET nID=${nID} WHERE word_id=${word_id}`
               db.query(nSQL,(err,result) => {
                   if (err) throw err;
               })
                nID++
           }
           if (obj.grammar.includes('adjectival') || obj.grammar ==='adjective') {
               const aSQL=`UPDATE wordsrussian SET aID=${aID} WHERE word_id=${word_id}`
               db.query(aSQL,(err,result) => {
                   if (err) throw err;
               })
                aID++
           }
        //    if (obj.grammar === 'verb') {
        //        const vSQL=`UPDATE wordsrussian SET vID=`
        //         vID++

        //    }
        })

        res.json('finsihed ids')
        
        })


    }
    catch(error) {
        console.log(error)
    }
})

// select russian words

app.get('/sentencesrussian', translateSentences)


// german sql

app.get('/topwordsgerman', wordsSQL)

app.get('/german', async (req,res) => {
    try {
        const sql = "SELECT * FROM wordsgerman"
        db.query(sql, (err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})



// italian SQL

app.get('/topwordsitalian', wordsSQL)



// french

app.get('/topwordsfrench', wordsSQL)


// portugues

app.get('/topwordsportuguese', wordsSQL)

// japanese

app.get('/topwordsjapanese', wordsSQL)


// chinese - traditional mandarian

app.get('/topwordsmandarin', wordsSQL)


// koren

app.get('/topwordskorean', wordsSQL)

// to get all other languages
app.get('/languagewords',async (req,res) => {
        const sql="SELECT * FROM languages"
        db.query(sql, async (err,result) => {
            const execpt = await result.reduce((acum,obj) => {
                if (obj.words ===1) {
                    acum.push(obj.lang)
                }
                return acum
            },[])
            fs.readdir(twenty16, (err,files) => {
            // execptions
            const reduced = files.reduce((acum,lang) => {
                if (!execpt.includes(lang)) {
                    app.get(`/words${lang}`,wordsSQL)
                    acum.push(lang)
                }
                return acum
            },[])
            res.json(reduced)
            })
        })
    })


*/
// to display a list of all languages
// I can now itereate over this
app.get('/languages', async (req,res) => {
    try{   
        const sql="SELECT lang FROM languages"
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows.map(obj => obj.lang))
        })

    }catch(error) {
        console.log(error)
    }
})

////////////////////////////// END OF OTHER LANGUAGES


// insert sentences to sentences table:  finished
// spanish
// app.get('/spanishsentence', createSpanishSQL)
// app.get('/conjugate', createVerbsSQL)


// to see all the questions we have
// when I click on each day I can then already see the questions I have


languages.forEach(lang => {

    // to read for the words and their sentneces each day: 10 words a day
    app.get(`/day${lang}:day`, async (req,res) => {
        try {
        const day = req.params.day;
        const sql =  `SELECT * FROM words${lang} INNER JOIN sentences${lang} ON words${lang}.word_id = sentences${lang}.word_id WHERE sentences${lang}.word_id >=$1 AND sentences${lang}.word_id<$2;`
        client.query(sql,[(day*10)-10,day*10],(err,result) => {
            if (err) throw err;
            res.json(result.rows);
        })
        }
        catch(error) {
            console.log(error)

        }
    })


    // this will allow me to see all the words
    app.get(`/words${lang}:day`, async (req,res) => {
        try {
            const {day} = req.params
            let sql = `SELECT * FROM words${lang} WHERE word_id < ${day*10}`
            client.query(sql,(err,result) => {
                if (err) throw err;
                res.json(result.rows)
            })
        }
        catch(error) {
            console.log(error)
        }
    })

app.get(`/questions${lang}`, async (req,res) => {
    try {
        const sql = `SELECT * FROM questions${lang}`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})

// to get the lessons
app.get(`/lesson${lang}:day`, async (req,res) => {
    try {
        const {day} = req.params
        let sql = `SELECT * FROM day${lang} WHERE dayid=${day};`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})


// to update lessons and questions
app.patch(`/update${lang}`, async (req,res) => {
    try {
        const id = req.body.day
        const {lesson,solution,usedVerbs} = req.body
        const questions = lesson.map(obj => [obj.id,obj.question])
        const questionStr = lesson.reduce((str, obj) => {
            return str + obj.question + '<p>'
        },'')
        const solutionStr = solution.reduce((str, obj) => {
            return `${str} <h4>${obj.word}: ${obj.way}</h4><p>${obj.englishs}<p>${obj.spanishs}<p>`
        },'')
        const arr = [id,`E'${questionStr.replace(/'/g, "\\'")}'`,`E'${solutionStr.replace(/'/g, "\\'")}'`,`'${usedVerbs}'`]
        const sql = `INSERT INTO day${lang} VALUES (${arr}) ON CONFLICT (dayid) DO UPDATE
        SET lesson=EXCLUDED.lesson, solution=EXCLUDED.solution, verbs=EXCLUDED.verbs;`
        client.query(sql, (err,result) => {
            if (err) throw err;
        })

        // to update the questions
        questions.forEach((arr,i) => {
            arr[1] = `E'${arr[1].replace(/'/g, "\\'")}'`
            const updateSQL =`INSERT INTO questions${lang} VALUES (${arr}) ON CONFLICT (id) DO UPDATE
            SET question=EXCLUDED.question`
            client.query(updateSQL,(err,result) => {
                if (err) throw err;
                
            })

        })
    }
    catch(err) {
        console.log(err)
    }
})


app.patch(`/setqform${lang}:day`, async (req,res) => {
    try {
        const {qform,day} = req.body
        qform.forEach(translation => {
            // to escape the apstrophys
            const escape = translation[1].replace(/'/g, "\\'")
            const sql=`UPDATE sentences${lang} SET qform=E'${escape}' WHERE id=${translation[0]}`
            client.query(sql,(err,result) => {
                if (err) throw err;
            })
        })

        const finishedSql=`INSERT INTO day${lang} (dayid) VALUES (${day})`
        client.query(finishedSql,(err,result) => {
            if (err) throw err;
        })



    }
    catch(error) {
        console.log(error)
    }
})



// to see what days have been completed

app.get(`/completed${lang}`, async (req,res) => {
    try {
        const sql=`SELECT dayid,verbs FROM day${lang} ORDER BY dayid`
        client.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})


app.get(`/sentences${lang}`, async (req,res) => {
    try {
        const sql = `SELECT * FROM sentences${lang}`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(err) {
        console.log(err)
    }
})

app.get(`/verbs${lang}`, async (req,res) => {
    try {
        let sql=`SELECT * FROM verbs${lang};`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        res.json([])
        console.log(error)
    }
})


// to clear out the verbID and it's grammar
app.patch(`/out${lang}verb`, async (req,res) => {
    try{
        const {obj} = req.body
        const sql=`UPDATE words${lang} SET vID=NULL WHERE word_id=${obj.word_id}`
        client.query(sql,(err,result) => {
            if (err)throw err;
        })
    }
    catch(error) {
        console.log(error)
    }
})

// for the adjectives
app.get(`/adjectives${lang}:day`, async (req,res) => {
    try {
        const {day} = req.params
        const sql=`SELECT * FROM adjectives${lang} WHERE word_id<${(parseInt(day)+1)*10}`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})

// for nouns
app.get(`/nouns${lang}:day`, async (req,res) => {
    try {
        const {day} = req.params
        const sql=`SELECT * FROM nouns${lang} WHERE word_id<${(parseInt(day)+1)*10}`
        client.query(sql,(err,result) => {
            if (err) throw err;
                res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})


app.patch(`/update${lang}nouns:noun`, async (req,res) => {
    try {
        const {noun} = req.params
        const entires = Object.entries(req.body[noun])
        entires.forEach(pair => {
        const sql=`UPDATE nouns${lang} SET ${pair[0]}='${pair[1]}' WHERE word='${noun}'`
        client.query(sql,(err,result) => {
            if (err) throw err;
        })
        })
    }
    catch(error) {
        console.log(error)
    }
})

app.patch(`/update${lang}adjectives:adj`, async (req,res) => {
    try {
        const {adj} = req.params
        const entires = Object.entries(req.body[adj])
        entires.forEach(pair => {
        const sql=`UPDATE adjectives${lang} SET ${pair[0]}='${pair[1]}' WHERE word='${adj}'`
        client.query(sql,(err,result) => {
            if (err) throw err;
        })
        })
    }
    catch(error) {
        console.log(error)
    }
})

})


// app.get('/spanishnounsadj', spanishNounsAdjs)

// app.get('/spanishgrammar', spanishGrammar)

/* This was to update the verbs. More transparency as to what verb it goes to
//// also fixed bug that vID were not correct. This was due to some skips on verbs and their ids 

app.get('/spanishverbword', async(req,res) => {
    try {
       let sql="SELECT * FROM verbsspanish"
       db.query(sql,(err,verbs) => {
           if (err) throw err;
           sql="SELECT word,word_id FROM wordsspanish WHERE vID IS NOT NULL"
            db.query(sql,(err,words) => {
                if (err) throw err;
                // for each word check to see where it is
                const keys = Object.keys(verbs[0])
                const verbArr = verbs.map(obj=> Object.values(obj))
                words.forEach(wObj => {
                    const {word,word_id} = wObj
                    loop1:
                    for (let i=0;i<verbArr.length;i++) {
                        const verbConjs = verbArr[i]
                        loop2:
                        for (let j=1;j<verbConjs.length;j++) {
                            const vID = verbConjs[0]
                            const conjugation = verbConjs[j]
                            const grammar = keys[j]
                            const thisVerb = verbConjs[1]
                            if (word === conjugation) {
                                sql=`UPDATE wordsspanish SET vID=${vID}, grammar='${grammar}-${thisVerb}' WHERE word_id=${word_id}`
                                db.query(sql,(err,result) => {
                                    if (err) throw err;
                                    console.log(`${word_id} done: word ${word}`)
                                })
                            break loop1; // breaks out of loop1 and loop2
                            }
                        }
                    }
                })
                res.json(verbArr)
            })
          
           
       })
    }
    catch(error) {
        console.log(error)
    }
}

)*/


// app.get('/sendtranslation', translateSentences)



// send users to the userDAtabase
app.post('/testuser', (req,res) => {
    try {
        const userArr = req.body.map(obj => {
            return Object.values(obj)
        })
        let sql = 'INSERT INTO users(email,purchased,created,pid,lastSent,unsubscribe,deactivated) VALUES $1;'
        client.query(sql,[userArr], (err,result) => {
            if (err) throw err;
            console.log('sent User')
        })
    }
    catch(error) {
        console.log(error)
    }
})

// select all the users to send Emails too

app.get('/getusers', (req,res) => {
    try {
        let sql = "SELECT * FROM users;"
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })

    }

    catch(error) {
        console.log(error)
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on ${port}`))