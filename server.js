const express = require('express')
const mysql = require('mysql')
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const {getFrequentWords, pushSentences,asyncForEach, getEnglishSentences, getSpanishSentences} = require('./database/frequency');
const translatethis = require('./google')
const {seperate, higlight, blank} = require('./qform')

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
// app.get('/insertwords', async (req,res) => {
//     let sql = 'INSERT INTO words (id,word) VALUES ?;'
//     try {
//         const array = await getFrequentWords()
//         const values = array.map(obj => [obj.id,obj.word])
//         let query = db.query(sql, [values], (err) => {
//             if (err) throw err;
//             else res.send('Finished')
//         })
//         }
//         catch(error) {
//             console.log(error)
    
//         }
    
    
// })

// show words

// app.get('/showwords', async(req,res) => {
//     let sql = 'SELECT * FROM words;'
//     db.query(sql, (err,results) => {
//         if (err) throw err
//         console.log(results)
//         res.send('finsihed')
//     })
// })

// // insert sentences to sentences table:  finished
// app.get('/insertsentence', async (req,res) => {
//     try {
//         let sql = "SELECT word_id FROM engSentences"
//         db.query(sql,(err,wordids) => {
//             if (err) throw err;
//             const set = [...new Set(wordids.map(obj => obj.word_id))]
//             let num = 0;
//             let fivethou = []
//             while (num <5000) {
//                 fivethou.push(num)
//                 num++
//             }

//             const spannum = fivethou.filter(num => {
//                 if (set.includes(num)) {
//                     return false
//                 } return true
//             })
            
//             sql = "SELECT * FROM words"
//             db.query(sql, async (err,words) => {
//                 if (err) throw err;
//                 let days = 0;
//                 while (days <= 4825) {
//                     const end = days+10 > 4825 ? 4825: days+10
//                     const spanishArr = words.filter(obj => {
//                         if (obj.word_id ===0) {
//                             return true
//                         }
//                         if (spannum.includes(obj.word_id)) {
//                         return true
//                         } else return false
//                     }).slice(days,end)
//                     days += 10
//                     sql = 'INSERT INTO sentences (way,spanishS,englishS,word_id) VALUES ?;'
//             const array = await getSpanishSentences(spanishArr)
//             const sentences = array.map(word => word.sentences.map(usage => [usage.usage, usage.spanish, usage.english, usage.word_id]))
//             const values = [].concat.apply([], sentences);
//             db.query(sql, [values], (err,result) => {
//             if (err) throw err;
//             })
//                 }

//                 res.send('finished')

            
//             })
            
//         })
        
        
//     }
//         catch(error) {
//             console.log(error)
    
//         }
    
    
// })

// // merge the english and regular sentences
// app.get('/merge', async (req,res) => {
//     try {
//         let sql = "SELECT * FROM sentences"
//         db.query(sql,(err,spanResult) => {
//             if (err) throw err;
//             sql="SELECT * FROM engSentences"
//             db.query(sql, (err,engResult) => {
//                 if (err) throw err;
//                 // none of them are back to back which means that I don't have to account for a difference of two in the spanish Indexes
//                 // create an object with all the counts and duplicates of the engindexes
//                 let engCountArr = {}
//                 engResult.forEach(obj => {
//                     if (engCountArr[obj.word_id]) {
//                         engCountArr[obj.word_id].push(obj)
//                     } else engCountArr[obj.word_id] = [obj]
//                 })
//                 // we need to splice into the spanResult these counts
//                 const spanIndexes = spanResult.map(obj => obj.word_id)
//                 // itereate over the engIndexes check to see where the index of the number abover it is equal to 1 plus it
//                 Object.keys(engCountArr).forEach(strNum => {
//                     const num = Number(strNum)
//                     let increment = 1;
//                     let index = spanIndexes.indexOf(num+increment)
//                     if (index ===-1) {
//                     while (index === -1) {
//                         index = spanIndexes.indexOf(num+increment)
//                         increment++;
//                     } 
//                 }
//                 spanResult.splice(index,0,engCountArr[num]) 
//                 })

//             const fullArray = [].concat.apply([], spanResult).map(obj => [obj.way,obj.spanishS,obj.englishS,obj.word_id]);
//             sql = 'INSERT INTO allSentences (way,spanishS,englishS,word_id) VALUES ?;'
//              // need a range becuase of ECONNRESET
//             let range = 0
//             while (range <=fullArray.length) {
//                 const end = range+100 > fullArray.length ? fullArray.length: range+100
//                 const partSQL = fullArray.slice(range,end)
//             db.query(sql, [partSQL], (err,result) => {
//             if (err) throw err;
//             console.log(`Finsihed ${end}`)
//             })
//             range+=100

//             }

//             res.send('Finished')
              
//             })

//         })

//     }
//     catch(error) {
//         console.log(error)
//     }
// })


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

// app.get('/sentences', async (req,res) => {
//     try {
//         let sql = "SELECT * FROM sentences"
//         db.query(sql,(err,result) => {
//             if (err) throw err;
//             res.json(result)
//         })
//     }
//     catch(err) {
//         console.log(err)
//     }
// })

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


// testing to put the format of words learned to be blank
app.get('/translation', async (req,res) => {
    try {
        let sql = "SELECT * FROM sentences WHERE id>0 AND id<10;"
        db.query(sql, (err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})


// app.get('/sendtranslation', async (req,res) => {
//     try {
//         let sql = "SELECT word FROM words"
//         db.query(sql, (err,allWords) => {
//             if (err) throw err;

//             sql = "SELECT * FROM sentences"
//             db.query(sql,(err,result2) => {
//                 if (err) throw err;
            
//             // need to do the learnedwords every 10
//             // this will make them blanks if we already know the words
//             let i=0;
//             let prevIndex = 0;
//             let spanishArr = []
//             let translationArr = []
//             let wordids = []
//             result2.forEach((obj,i) => {
//                 spanishArr.push(seperate(obj.spanishS))
//                 wordids.push(obj.word_id)

//             })

//             // we have the top 5000 words and 500 days
//             while (i<500) {
//                 // find the index of the word_id
//                 let j = (i+1)*10
//                 let index = wordids.indexOf(j)
//                 if (j ===5000) {
//                     index = result2.length
//                 } 
//                 if (index <0) {
//                     while (wordids.indexOf(j) <0) {
//                         j++
//                         i=Math.ceil(j/10);
//                     }
//                     index = wordids.indexOf(j)
//                 }
//                 if (prevIndex < index) {
//                 // // catch it if it doesn't land on multiple of 10
//                 const learnedwords = allWords.slice(0,j).map(obj => obj.word)
//                 const highlighted = spanishArr.slice(prevIndex,index).map((sentence) => higlight(sentence,learnedwords))
//                 translationArr.push(highlighted)

//                 }
//                 prevIndex = index;
//                 i++;
                
//             }

//             sql="UPDATE sentences SET qform=? WHERE id=?"
//             let end = []
//             const finishedArr = [].concat.apply([], translationArr)

//             asyncForEach(finishedArr, async (sentence,i) => {
//                     const underScore = await translatethis(sentence)
//                     db.query(sql,[underScore,i+1],(err,result) => {
//                         if (err) throw err;
//                         end.push(result)
//                     })
//                     console.log(`Sentence ${i} done`)

//                 })

            
//             res.json(end)
//         })

//         })
//     }
//     catch(error) {
//         console.log(error)
//     }
// })

// app.get('/englishwords', async (req,res) => {
//     try {
//         let sql = "SELECT word_id FROM sentences"
//         db.query(sql, (err,wordids) => {
//             if (err) throw err;
//             const filtered = [...new Set(wordids.map(obj => obj.word_id+1))].filter((num,i,arr) => {
//                 if (num >=5000) {
//                     return false
//                 }
//                 if (num+1 !== arr[i+1]) {
//                     return num
//                 } else return false
//             })
//             sql="SELECT * FROM words"
//             db.query(sql, async (err,words) => {
//                     if (err) throw err;
//                     // filter out the non filters
//                     const englishwords = words.filter(obj => {
//                         if (filtered.includes(obj.word_id)) {
//                             return true
//                         } else return false
//                     })

//                     sql = 'INSERT INTO engSentences (way,spanishS,englishS,word_id) VALUES ?;'
//                     const array = await getEnglishSentences(englishwords)
//                     const sentences = array.map(word => word.sentences.map(usage => [usage.usage, usage.spanish, usage.english, usage.word_id]))
//                     const values = [].concat.apply([], sentences);
//                     db.query(sql, [values], (err) => {
//                     if (err) throw err;
//                     res.send('Finished')
//                     })
                    
//                 })
            
            
            
//         })
//     }
//     catch(err) {
//         console.log(err)
//     }
// })


app.get('/allsentences', async (req,res) => {
    try {
        let sql = "SELECT * FROM sentences;"
        db.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
})


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