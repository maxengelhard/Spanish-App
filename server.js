const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const createSpanishSQL = require('./database/createSpanishSQL')
const createVerbsSQL = require('./database/createVerbsSQL')
const translateSentences = require('./database/translateSentences')



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
        let sql = 'INSERT INTO day VALUES (?);'
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
        let sql = 'REPLACE INTO day VALUES (?);'
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
        let sql = "SELECT * FROM day;"
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
app.get(`/day:day`, async (req,res) => {
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
        let sql = "SELECT word FROM words"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})


// // insert sentences to sentences table:  finished
// app.get('/spanishsentence', createSpanishSQL)

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

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on ${port}`))