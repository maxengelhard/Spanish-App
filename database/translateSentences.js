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
    // }
}


module.exports = transalteSentences