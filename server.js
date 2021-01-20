const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const createSpanishSQL = require('./database/createSpanishSQL')
const createVerbsSQL = require('./database/createVerbsSQL')
const translateSentences = require('./database/translateSentences')
const wordsSQL = require('./database/wordsSQL');
const russianSQL = require('./database/russian/russianSQL')
const fs = require('fs')
const twenty16 = './database/frequentWords/2016'



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
app.post('/insert', async (req,res) => {
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
        let sql = 'INSERT INTO dayes VALUES (?);'
        db.query(sql,[arr], (err,result) => {
            if (err) throw err;
        })
        sql = 'INSERT INTO questions VALUES ?;'
        db.query(sql,[questions], (err,result) => {
            if (err) throw err;
        })
        
    }
    catch(err) {
        console.log(err)
    }
    
})


// to update lessons and questions
app.patch('/update', async (req,res) => {
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
        let sql = 'REPLACE INTO dayes VALUES (?);'
        db.query(sql,[arr], (err,result) => {
            if (err) throw err;
        })
        sql = 'REPLACE INTO questions VALUES ?;'
        db.query(sql,[questions], (err,result) => {
            if (err) throw err;
        })
    }
    catch(err) {
        console.log(err)
    }
})



// to see what days have been completed

app.get('/completed', async (req,res) => {
    try {
        const sql="SELECT dayID FROM dayes"
        db.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})


app.get('/sentences', async (req,res) => {
    try {
        let sql = "SELECT * FROM sentences"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(err) {
        console.log(err)
    }
})


// russian sql
app.get('/wordsrussian', wordsSQL)

app.get('/russiansql', russianSQL)

// select russian words
app.get('/russian',async (req,res) => {
    try {
        const sql = "SELECT * FROM wordsrussian"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})

app.get('/russiansentences', async (req,res) => {
    try {
        const sql="SELECT * FROM sentencesrussian"
        db.query(sql,(err,result) => {
            if (err) throw err;
            const unqiues = [...new Set(result.map(obj => obj.word_id))]
            let cont = false
            unqiues.forEach((num,i,arr) => {
                if (arr[i+1] !== num+1) {
                    cont = num
                }
            })
            res.json(unqiues)
        })
    }
    catch(error) {
        console.log(error)
    }
})


// german sql

app.get('/wordsgerman', wordsSQL)

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

app.get('/wordsitalian', wordsSQL)



// french

app.get('/wordsfrench', wordsSQL)


// portugues

app.get('/wordsportuguese', wordsSQL)

// japanese

app.get('/wordsjapanese', wordsSQL)


// chinese - traditional mandarian

app.get('/wordsmandarin', wordsSQL)


// koren

app.get('/wordskorean', wordsSQL)


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
// to get all of them from 2016

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




// insert sentences to sentences table:  finished
// spanish
app.get('/spanishsentence', createSpanishSQL)
app.get('/conjugate', createVerbsSQL)


// to see all the questions we have
// when I click on each day I can then already see the questions I have

app.get('/questions', async (req,res) => {
    try {
        let sql = "SELECT * FROM questions;"
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
app.get('/lesson', async (req,res) => {
    try {
        let sql = "SELECT * FROM dayes;"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})

// to read for the words and their sentneces each day: 10 words a day
app.get(`/dayes:day`, async (req,res) => {
    try {
    const day = req.params.day;
    let sql =  "SELECT * FROM words INNER JOIN sentences ON words.word_id = sentences.word_id WHERE sentences.word_id >=? AND sentences.word_id<?;"
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
app.get('/words', async (req,res) => {
    try {
        let sql = "SELECT * FROM words"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})




app.get('/verbs', async (req,res) => {
    try {
        let sql="SELECT * FROM verbs;"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
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


// app.get('/sendtranslation', translateSentences)




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