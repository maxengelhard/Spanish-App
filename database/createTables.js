const mysql = require('mysql')
const {Client} = require('pg')


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

const client = new Client({
    user: process.env.PSQLUSER,
    password: process.env.PSQLPASSWORD,
    port: process.env.PSQLPORT,
    database: process.env.PSQLDATABASE
})

client.connect()


const createTables = async (req,res) => {
    try {
        const sql="SHOW TABLES"
        let thisTable = []
        db.query(sql,async (err,result) => {
            if (err) throw err;
            // for each of the results make a CSV
            await result.forEach(obj => {
                const table = obj.Tables_in_spanishapp
                // create tables in postgres
                const columnSQL = `DESCRIBE ${table}`
            db.query(columnSQL,(err,columns) => {
                if (err) throw err;
                let createSql=`CREATE TABLE ${table} (`
                columns.forEach((column,i) => {
                    const {Field,Type,Key} = column
                    let type =''
                    if (Type==='tinyint'){
                        type='smallint'
                    } 
                    else if (Type==='datetime') {
                        type='timestamp'
                    } else {
                        type=Type
                    }
                    const primary = Key === 'PRI' ? 'PRIMARY KEY': '' 
                    createSql+=`${Field} ${type} ${primary}`.trim()
                    if (i!==columns.length-1) {
                        createSql+=','
                    }
                })
                createSql+=');'
                client.query(createSql,(err,result) => {
                    if (err) throw err;
                    console.log(result)
                })
            })
            })
            res.json(thisTable)
        })
    }
    catch(error) {
        console.log(error)
    }
}

module.exports = createTables