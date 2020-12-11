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
            let sql = "SELECT word FROM words"
            db.query(sql, (err,allWords) => {
                if (err) throw err;
    
                sql = "SELECT * FROM sentences"
                db.query(sql, async (err,result2) => {
                    if (err) throw err;
                
                // need to do the learnedwords every 10
                // this will make them blanks if we already know the words
                let i=0;
                let prevIndex = 0;
                let spanishArr = []
                let translationArr = []
                let wordids = []
                result2.forEach((obj,i) => {
                    spanishArr.push(seperate(obj.spanishS))
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
                    const highlighted = spanishArr.slice(prevIndex,index).map((sentence) => higlight(sentence,learnedwords))
                    translationArr.push(highlighted)
    
                    }
                    prevIndex = index;
                    i++;
                    
                }
    
                sql="UPDATE sentences SET qform=? WHERE id=?"
                const finishedArr = [].concat.apply([], translationArr)
                // break the array into 10 arrays
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

                const bigText = apiLimARR.map(arr => arr.join(']'))
               let lastTextLength = 0
                asyncForEach(bigText, async (text) => {
                const arrText = text.split(']').length
                const underScore = await translatethis(text)
                const underScoreArr = underScore.split(']').map(string => string.trim())

                // for each underscoree ARR
                underScoreArr.forEach((engSentences,i) => {
                    db.query(sql,[engSentences,lastTextLength+i+1],(err,result) => {
                        if (err) throw err;
                        console.log(`${lastTextLength+i+1} done`)
                    })
                })

                lastTextLength += arrText

                })
                
                res.json(bigText)
            })
    
            })
        }
        catch(error) {
            console.log(error)
        }
}


module.exports = transalteSentences