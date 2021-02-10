const {Client} = require('pg')


const client = new Client({
    user: process.env.PSQLUSER,
    password: process.env.PSQLPASSWORD,
    port: process.env.PSQLPORT,
    database: process.env.PSQLDATABASE
})

client.connect()


const migrate = async (req,res) => {
    try {
        let final = []
        const tSQL="SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
        client.query(tSQL,(err,result) => {
            if (err) throw err;
            const tables = result.rows.map(obj => obj.table_name)
            tables.forEach(name => {
                const copySQL =`\\encoding UTF8 \\copy ${name} FROM 'C:\\Users\\maxve\\Desktop\\coding-projects\\SpanishApp\\spanish-app\\database\\csv\\${name}.csv' DELIMITER ',';`
                // client.query(copySQL,(err,result) => {
                //     if (err) throw err;
                //     console.log(`${name} done`)
                // })
                ///////////////////////////////// cleint querying didn't work had to copy and paste from console
                console.log(copySQL)
            })
            res.json(final)
        })

    }
    catch(error) {
        console.log(error)
    }
}

module.exports = migrate

