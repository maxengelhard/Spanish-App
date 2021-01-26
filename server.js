const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const createSpanishSQL = require('./database/spanish/createSpanishSQL')
const createVerbsSQL = require('./database/spanish/createVerbsSQL')
const translateSentences = require('./database/translateSentences')
const wordsSQL = require('./database/wordsSQL');
const russianSQL = require('./database/russian/russianSQL')
const russianVerbs = require('./database/russian/russianVerbSQL')
const russianNouns = require('./database/russian/nounSQL')
const russianAdjectives = require('./database/russian/adjective')
const fs = require('fs')
const twenty16 = './database/frequentWords/2016'
const languages = require('./languages')



// create connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

// connect
db.connect((err) => {
    if(err) {
        throw err;
    } 
    console.log('My sql connected...')
})

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.use(express.static('public'))

// after each submisson create a lesson and put in all the quesitons

//////////////////////////// OTHER LANGUAGES

// russian sql
app.get('/topwordsrussian', wordsSQL)

app.get('/russiansql', russianSQL)

app.get('/russianverbssql', russianVerbs)

app.get('/russiannounssql', russianNouns)

app.get('/russianadjsql', russianAdjectives)

app.get('/russiangrammar', async (req,res) => {
    try {
        const sql ="SELECT grammar, word FROM wordsrussian"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
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



// to display a list of all languages
// I can now itereate over this
app.get('/languages', async (req,res) => {
    try{   
        const sql="SELECT lang FROM languages"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.map(obj => obj.lang))
        })

    }catch(error) {
        console.log(error)
    }
})

////////////////////////////// END OF OTHER LANGUAGES


// insert sentences to sentences table:  finished
// spanish
app.get('/spanishsentence', createSpanishSQL)
app.get('/conjugate', createVerbsSQL)


// to see all the questions we have
// when I click on each day I can then already see the questions I have


languages.forEach(lang => {

    // to read for the words and their sentneces each day: 10 words a day
    app.get(`/day${lang}:day`, async (req,res) => {
        try {
        const day = req.params.day;
        let sql =  `SELECT * FROM words${lang} INNER JOIN sentences${lang} ON words${lang}.word_id = sentences${lang}.word_id WHERE sentences${lang}.word_id >=? AND sentences${lang}.word_id<?;`
        db.query(sql,[(day*10)-10,day*10],(err,result) => {
            if (err) throw err;
            res.json(result);
        })
        }
        catch(error) {
            console.log(error)

        }
    })


    // this will allow me to see all the words
    app.get(`/words${lang}`, async (req,res) => {
        try {
            let sql = `SELECT * FROM words${lang}`
            db.query(sql,(err,result) => {
                if (err) throw err;
                res.json(result)
            })
        }
        catch(error) {
            console.log(error)
        }
    })

app.get(`/questions${lang}`, async (req,res) => {
    try {
        let sql = `SELECT * FROM questions${lang};`
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})

// to get the lessons
app.get(`/lesson${lang}`, async (req,res) => {
    try {
        let sql = `SELECT * FROM day${lang};`
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})
    // to insert the questions 
    app.post(`/insert${lang}`, async (req,res) => {
    try {
        const id = req.body.day
        const {lesson,solution}  = req.body
        const questions = lesson.map(obj => [obj.id,obj.question])
        const questionStr = lesson.reduce((str, obj) => {
            return str + obj.question + '<p>'
        },'')
        const solutionStr = solution.reduce((str, obj) => {
            return `${str} <h4>${obj.word}: ${obj.way}</h4><p>${obj.englishS}<p>${obj.spanishS}<p>`
        },'')
        const arr = [id,questionStr,solutionStr]
        let sql = `INSERT INTO day${lang} VALUES (?);`
        db.query(sql,[arr], (err,result) => {
            if (err) throw err;
        })
        sql = `INSERT INTO questions${lang} VALUES ?;`
        db.query(sql,[questions], (err,result) => {
            if (err) throw err;
        })
        
    }
    catch(err) {
        console.log(err)
    }
    
})


// to update lessons and questions
app.patch(`/update${lang}`, async (req,res) => {
    try {
        const id = req.body.day
        const {lesson,solution} = req.body
        const questions = lesson.map(obj => [obj.id,obj.question])
        const questionStr = lesson.reduce((str, obj) => {
            return str + obj.question + '<p>'
        },'')
        const solutionStr = solution.reduce((str, obj) => {
            return `${str} <h4>${obj.word}: ${obj.way}</h4><p>${obj.englishS}<p>${obj.spanishS}<p>`
        },'')
        const arr = [id,questionStr,solutionStr]
        let sql = `REPLACE INTO day${lang} VALUES (?);`
        db.query(sql,[arr], (err,result) => {
            if (err) throw err;
        })
        sql = `REPLACE INTO questions${lang} VALUES ?;`
        db.query(sql,[questions], (err,result) => {
            if (err) throw err;
        })
    }
    catch(err) {
        console.log(err)
    }
})



// to see what days have been completed

app.get(`/completed${lang}`, async (req,res) => {
    try {
        const sql=`SELECT dayID FROM day${lang}`
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})


app.get(`/sentences${lang}`, async (req,res) => {
    try {
        let sql = `SELECT * FROM sentences${lang}`
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(err) {
        console.log(err)
    }
})

app.get(`/verbs${lang}`, async (req,res) => {
    try {
        let sql=`SELECT * FROM verbs${lang};`
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        res.json([])
        console.log(error)
    }
})

})








// // push join verbs and used words
// app.get('/usedwords', async (req,res) => {
//     try {
//         let sql="SELECT * FROM verbs;"
//         db.query(sql, (err,verbArr) => {
//             if (err) throw err;
//             const strictArr = verbArr.map(obj => Object.values(obj))
//             sql = "SELECT word_id, word FROM words"
//             db.query(sql,(err,wordArr) => {
//                 if (err) throw err
//                 // find where they intersect
//                 // itereate over the wordArr words
//                 // find the index of the verb and add a verb id to it
//                 const added = wordArr.map(obj => {
//                     const word = obj.word
//                     // itereate over the array of arrays
//                     obj.vID = null
//                     strictArr.forEach((arr,i) => {
//                         if (arr.indexOf(word) !== -1) {
//                             obj.vID = i
//                         }
//                     })
//                     return Object.values(obj)
//                 })
//                 sql = "REPLACE INTO words VALUES ?"
//                 db.query(sql,[added],(err,result) => {
//                     if (err) throw err;
//                     res.send('finsihed')
//                 })

//                 // res.json(added)
//             })
//             // then see about the day
//             // res.json(fields)
//         })
//     }
//     catch(error) {
//         console.log(error)
//     }
// })


app.get('/sendtranslation', translateSentences)




// send users to the userDAtabase
app.post('/testuser', (req,res) => {
    try {
        const userArr = req.body.map(obj => {
            return Object.values(obj)
        })
        let sql = 'INSERT INTO users(email,purchased,created,pid,lastSent,unsubscribe,deactivated) VALUES ?;'
        db.query(sql,[userArr], (err,result) => {
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
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })

    }

    catch(error) {
        console.log(error)
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on ${port}`))