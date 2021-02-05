const axios = require('axios')
const cheerio = require('cheerio')
const url = 'https://www.spanishdict.com/translate/'

async function grammar(page_url) {
    try {
        const {data} = await axios.get(page_url);
        let $ = cheerio.load(data)

        const usage = $('#dictionary-neodict-es').find('div._3aQ9irLD')
    if (usage.length ===0) {
        const {data} = await axios.get(page_url+'?langFrom=es');
        $ = cheerio.load(data)
    }

        // const grammarList = $('a._2MYNwPb3')
        // let hasAdj = false
        // let mainUse = ''
        // grammarList.each((i,grammar) => {
        //     const type = $(grammar)[0].children[0].data
        //     if (i===0) {
        //         mainUse = type
        //     }
        //     if (type ==='adjective') {
        //         hasAdj = true
        //     }
        // })

        // grammar = mainUse.includes('adjective') ? mainUse: hasAdj ? mainUse + ': hasAdj' : mainUse
        const mainUse = $('span.B2BmICec').text()
        return mainUse 
        
}
    catch(error) {
       console.log(error)
       return null
    }

}

// then add them to mysql

const mysql = require('mysql')
const asyncForEach = require('../asyncForEach')


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})
/*/////////////////// This one worked but didn't get some unqiue words creating antoehr for the ones that had errors
const spanishGrammar = async () => {
    try{
        let sql="SELECT * FROM wordsspanish WHERE grammar IS NULL"
        db.query(sql,async (err,words) => {
            if (err) throw err;
            // for each of them update their grammar
            await asyncForEach(words, async (obj) => {
                const {word_id,word} = obj
                const updated = await grammar(url+word)
                sql=`UPDATE wordsspanish SET grammar='${updated}' WHERE word_id=${word_id}`
                db.query(sql,(err,result) => {
                    if (err) throw err;
                    console.log(`${word} done, id:${word_id}`)
                })
            })

            res.json('finsihed grammar')

        })

    }
    catch(error) {
        console.log(error)
    }
}
*/


const spanishGrammar2 = async (req,res) => {
    try{
        let sql="SELECT * FROM wordsspanish WHERE grammar=''"
        db.query(sql,async (err,words) => {
            if (err) throw err;
            // for each of them update their grammar
            await asyncForEach(words, async (obj) => {
                const {word_id,word} = obj
                const updated = await grammar(url+word)
                sql=`UPDATE wordsspanish SET grammar='${updated}' WHERE word_id=${word_id}`
                db.query(sql,(err,result) => {
                    if (err) throw err;
                    console.log(`${word} done, id:${word_id}`)
                })
            })

            res.json('finsihed grammar')

        })

    }
    catch(error) {
        console.log(error)
    }
}


module.exports = spanishGrammar2
