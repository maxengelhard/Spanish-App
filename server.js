const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const {getFrequentWords, pushSentences} = require('./database/frequency');

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


// insert word database
app.get('/insertwords', async (req,res) => {
    let sql = 'INSERT INTO words (id,word) VALUES ?;'
    try {
        const array = await getFrequentWords()
        const values = array.map(obj => [obj.id,obj.word])
        let query = db.query(sql, [values], (err) => {
            if (err) throw err;
            else res.send('Finished')
        })
        }
        catch(error) {
            console.log(error)
    
        }
    
    
})

// show words

app.get('/showwords', async(req,res) => {
    let sql = 'SELECT * FROM words;'
    db.query(sql, (err,results) => {
        if (err) throw err
        console.log(results)
        res.send('finsihed')
    })
})

// insert sentences to sentences table:  finished
// app.get('/insertsentence', async (req,res) => {
//     let sql = 'INSERT INTO sentences (way,spanishS,englishS,word_id) VALUES ?;'
//     try {
//         const array = await pushSentences()
//         const sentences = array.map(word => word.sentences.map(usage => [usage.usage, usage.spanish, usage.english, usage.word_id]))
//         const values = [].concat.apply([], sentences);
//         let query = db.query(sql, [values], (err) => {
//             if (err) throw err;
//         })
//         res.send('Finished')
//     }
//         catch(error) {
//             console.log(error)
    
//         }
    
    
// })

// read
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



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on ${port}`))