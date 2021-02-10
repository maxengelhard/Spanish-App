const mysql = require('mysql')


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})


const exportCSV = async (req,res) => {
    try {
        const sql="SHOW TABLES"
        db.query(sql,async (err,result) => {
            if (err) throw err;
            // for each of the results make a CSV
            await result.forEach(obj => {
                const table = obj.Tables_in_spanishapp
                const csvSQL = `SELECT * FROM ${table} INTO OUTFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/${table}.csv'
                FIELDS TERMINATED BY ','
                LINES TERMINATED BY '\n'`
                db.query(csvSQL,(err,result) => {
                    if (err) throw err;
                    console.log(`${table} done`)
                })
            })
           
            res.json(result)
        })
    }
    catch(error) {
        console.log(error)
    }
}

module.exports = exportCSV