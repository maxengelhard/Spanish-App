const mysql = require('mysql')
const wordsrussian = require('./russian/russianWords')
const wordsgerman = require('./german/germanWords')
const wordsitalian = require('./italian/italianWords')
const wordsfrench = require('./french/frenchWords')
const wordsportuguese = require('./portuguese/portugueseWords')
const wordsjapanese = require('./japanese/japaneseWords')
const wordsmandarin = require('./chinese/mandarinWords')
const wordskorean = require('./korean/koreanWords')
const localLanguage = require('./localLangs')
const getFrequentWords = require('./getFrequentWords')

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const iso = async (dir) => {
    if (functions[dir]) {
    return  functions[dir]()
    } else {
    const arr = localLanguage(dir.slice(5))
    return getFrequentWords(arr)
    }
}

// these are one I've already scraped
const functions = {
    'wordsrussian': wordsrussian,
    'wordsgerman': wordsgerman,
    'wordsitalian': wordsitalian,
    'wordsfrench': wordsfrench,
    'wordsportuguese': wordsportuguese,
    'wordsjapanese': wordsjapanese,
    'wordsmandarin': wordsmandarin,
    'wordskorean': wordskorean
}

const wordsSQL = async (req,res) => {
    try {
        // first check if we have a table
        let sql="SHOW TABLES"
        db.query(sql, async (err,result) => {
        if (err) throw err;
        const currentTbls = await result.map(obj => Object.values(obj)[0])
        const lang = req.path.slice(1)
        const frequentwords = await iso(lang)
        const words = frequentwords.map(obj => [Object.values(obj)]) 
        const values = [].concat.apply([], words)
        const replaceInto = (sqlArr,columns) => {
            const rsql = `REPLACE INTO ${lang} ${columns} VALUES ?`
            db.query(rsql,[sqlArr],(err,result) => {
            if (err) throw err;
            res.json(`finished ${lang}`)
        })
            // also update that we have the languages words complete
            const lsql=`REPLACE INTO languages (lang,words) VALUES ('${lang.slice(5)}',1)`
            db.query(lsql,(err,result) => {
                if (err) throw err;
            })
        }
        // we already have the table then we insert it in
        if (currentTbls.includes(lang)) {
          replaceInto(values, '(word_id,word,vID,pronunciation,grammar)')
        } 
        // if we don't we create that table and then insert it
        else {
            sql=`CREATE TABLE ${lang} (
                word_id INT PRIMARY KEY,
                word VARCHAR(30),
                vID INT,
                pronunciation VARCHAR(30),
                grammar VARCHAR(60));`
            db.query(sql, async (err,result) => {
                if (err) throw err;
                await result
                // changing the values and columns becuase I don't want to replace previously completed tables with nulls
                const value2 = values.map(arr => arr.slice(0,2))
                replaceInto(value2,'(word_id,word)')
            })
        }
       
        })
       
    }
    catch(error) {
        console.log(error)
    }
}


module.exports = wordsSQL