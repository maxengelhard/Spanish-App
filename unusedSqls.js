
// const fs = require('fs')
//const twenty16 = './database/frequentWords/2016'
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


////////////////////////////// END OF OTHER LANGUAGES


// insert sentences to sentences table:  finished
// spanish
// app.get('/spanishsentence', createSpanishSQL)
// app.get('/conjugate', createVerbsSQL)


// to see all the questions we have
// when I click on each day I can then already see the questions I have


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