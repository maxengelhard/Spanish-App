const mysql = require('mysql')
const conjugateVerbs = require('./conjugateVerbs')
const asyncForEach = require('./asyncForEach')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const dict_url = 'https://www.spanishdict.com/conjugate/'



async function conjugateAll(arr) {
    let final = []
    await arr
    return final

}

const createVerbsSQL = async (req,res) => {
        try {
            let sql = "SELECT * FROM verbs;"
                db.query(sql, async (err,verbs) => {
                    if (err) throw err;
                   
                    await asyncForEach(verbs, async (verb) => {
                        const result = await conjugateVerbs(`${dict_url}${verb.verb}`)
                        const conjugations = result.map(obj => Object.values(obj)[0])
                        const allElse = conjugations.slice(1)
                        const descriptions = result.map(obj => Object.keys(obj)[0]).slice(1)

                        
                            // update each description
                            descriptions.forEach((description,i) => {
                                sql = `UPDATE verbs SET ${description}=? WHERE vID='${verb.vID}'`
                                db.query(sql, [allElse[i]], async (err,result) => {
                                if (err) throw err;
                                })
                            }) 

                        console.log(verb + ' done')
                    })
                        // const array = await conjugateVerbs(verbArr)
                        
                        
                        res.send('finsihed')
                
                
                })
                
                
        
        }
        catch(error) {
                console.log(error)
        
            }
        
        
    }





module.exports = createVerbsSQL