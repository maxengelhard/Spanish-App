const translatethis = require('.././google')
const {seperate, higlight} = require('.././qform')
const asyncForEach = require('./asyncForEach')

const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})


const transalteSentences = async (req,res) => {
        try {
            // sentences
            const lang = req.path.slice('/sentences'.length)
            let sql = `SELECT word FROM words${lang}`
            db.query(sql, async (err,allWords) => {
                if (err) throw err;
                sql = `SELECT * FROM sentences${lang}`
                db.query(sql, async (err,result2) => {
                    if (err) throw err;
                // need to do the learnedwords every 10
                // this will make them blanks if we already know the words
                let i=0;
                let prevIndex = 0;
                let languageArr = []
                let translationArr = []
                let wordids = []
                result2.forEach((obj,i) => {
                    languageArr.push(seperate(obj[`${lang}S`]))
                    wordids.push(obj.word_id)
                })
    
                // we have the top 5000 words and 500 days
                while (i<500) {
                    // find the index of the word_id
                    let j = (i+1)*10
                    let index = wordids.indexOf(j)
                    if (j ===5000) {
                        index = result2.length
                    } 
                    if (index <0) {
                        while (wordids.indexOf(j) <0) {
                            j++
                            i=Math.ceil(j/10);
                        }
                        index = wordids.indexOf(j)
                    }
                    if (prevIndex < index) {
                    // // catch it if it doesn't land on multiple of 10
                    const learnedwords = allWords.slice(0,j).map(obj => obj.word)
                    const highlighted = languageArr.slice(prevIndex,index).map((sentence) => higlight(sentence,learnedwords))
                    translationArr.push(highlighted)
                    }
                    prevIndex = index;
                    i++;
                    
                }
    
                sql=`UPDATE sentences${lang} SET qform=? WHERE id=?`
                const finishedArr = [].concat.apply([], translationArr)
                // break the array into 50 arrays
                let apiLimARR = []
                let spread=0
                const divisor = 50
                while (spread<divisor) {
                    const firstIndex = Math.floor(((finishedArr.length*spread)/divisor))
                    const endIndex = Math.floor(((finishedArr.length*(spread+1))/divisor))
                    const end = endIndex > finishedArr.length ? finishedArr.length: endIndex
                    apiLimARR.push(finishedArr.slice(firstIndex,end))
                    spread++
                }
            
               const bigText = apiLimARR.map(arr => arr.join('[]'))
             
               let lastTextLength = 0
               let count = 1
               let qform = []
                await asyncForEach(bigText, async (text,i) => {
                const underScore = await translatethis(text)
                const underScoreArr = underScore.split('[]').map(string => string.trim())
                qform.push(underScoreArr)
                // // for each underscoree ARR
                underScoreArr.forEach((engSentences,i) => {
                    db.query(sql,[engSentences,lastTextLength+i+1],(err,result) => {
                        if (err) throw err;
                        count++
                        console.log(`${count} done`)
                    })
                })
                lastTextLength += underScoreArr.length

                })
                
                res.json(qform)
            })
    
            })
        }
        catch(error) {
            console.log(error)
        }
}


module.exports = transalteSentences