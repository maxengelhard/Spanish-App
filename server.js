const express = require('express')
const {Client} = require('pg')
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const languages = require('./languages')
const {hash, compare} =require('bcryptjs')
const cookieParser = require('cookie-parser')
const {ensureLoggedIn} = require('./middleware')

// postgres

const client = new Client({
    user: process.env.PSQLUSER,
    password: process.env.PSQLPASSWORD,
    port: process.env.PSQLPORT,
    database: process.env.PSQLDATABASE
})

client.connect()
.then(() => console.log('Postgres Connected'))
.catch(e => console.log(e))


const app = express();


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(cors({
    origin: 'hhtp://localhost:3001/',
    credentials:true
}))



// app.use(express.static('public'))

// to display a list of all languages
// I can now itereate over this
app.get('/languages', async (req,res) => {
    try{   
        const sql="SELECT lang FROM languages"
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows.map(obj => obj.lang))
        })

    }catch(error) {
        console.log(error)
    }
})



languages.forEach(lang => {

    // to read for the words and their sentneces each day: 10 words a day
    app.get(`/day${lang}:day`, async (req,res) => {
        try {
        const day = req.params.day;
        const sql =  `SELECT * FROM words${lang} INNER JOIN sentences${lang} ON words${lang}.word_id = sentences${lang}.word_id WHERE sentences${lang}.word_id >=$1 AND sentences${lang}.word_id<$2;`
        client.query(sql,[(day*10)-10,day*10],(err,result) => {
            if (err) throw err;
            res.json(result.rows);
        })
        }
        catch(error) {
            console.log(error)

        }
    })


    // this will allow me to see all the words
    app.get(`/words${lang}:day`, async (req,res) => {
        try {
            const {day} = req.params
            let sql = `SELECT * FROM words${lang} WHERE word_id < ${day*10}`
            client.query(sql,(err,result) => {
                if (err) throw err;
                res.json(result.rows)
            })
        }
        catch(error) {
            console.log(error)
        }
    })

app.get(`/questions${lang}:day`, async (req,res) => {
    try {
        const {day} = req.params
        const sql = `SELECT * FROM questions${lang} WHERE day=${day}`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})

// to get the lessons
app.get(`/lesson${lang}:day`, async (req,res) => {
    try {
        const {day} = req.params
        let sql = `SELECT * FROM day${lang} WHERE dayid=${day};`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})


// to update lessons and questions
app.patch(`/update${lang}`, async (req,res) => {
    try {
        const id = req.body.day
        const {lesson,solution,usedVerbs,highlightedWords} = req.body
        const questions = lesson.map(obj => [obj.id,obj.question,obj.upper])
        const questionStr = lesson.reduce((str, obj,i) => {
            return str + `<h4>${solution[i].word}: ${solution[i].way}</h4><p>`+ solution[i].englishs + ' -> '+ obj.question  + '->' + obj.upper + '<p>'
        },'')
        const solutionStr = solution.reduce((str, obj,i) => {
            const not_undefined = lesson[i] ? lesson[i].upper.trim() : ''
            return `${str} <h4>${obj.word}: ${obj.way}</h4><p>${obj.englishs}<p><b>${not_undefined}<p>Full Spanish Text: ${obj.spanishs}<p>`
        },'')
        const arr = [id,`E'${questionStr.replace(/'/g, "\\'")}'`,`E'${solutionStr.replace(/'/g, "\\'")}'`,`'${usedVerbs}'`]
        const sql = `INSERT INTO day${lang} VALUES (${arr}) ON CONFLICT (dayid) DO UPDATE
        SET lesson=EXCLUDED.lesson, solution=EXCLUDED.solution, verbs=EXCLUDED.verbs;`
        client.query(sql, (err,result) => {
            if (err) throw err;
        })

        // to update the questions
        questions.forEach((arr,i) => {
            arr[1] = `E'${arr[1].replace(/'/g, "\\'")}'`
            arr[2] = arr[2] ? `E'${arr[2].replace(/'/g,"\\'")}'` : null
            const {word} = solution[i]
            const highlight = highlightedWords[i]
            const updateSQL =`INSERT INTO questions${lang} VALUES ('${arr[0]}',${arr[1]},${arr[2]},${id},'${word}',($1)) ON CONFLICT (id) DO UPDATE
            SET question=${arr[1]}, upper=${arr[2]},day=${id},word='${word}', wordarray=($1)`
            client.query(updateSQL,[highlight],(err,result) => {
                if (err) throw err;
            })

        })
    }
    catch(err) {
        console.log(err)
    }
})


app.patch(`/setqform${lang}:day`, async (req,res) => {
    try {
        const {qform,day} = req.body
        qform.forEach(translation => {
            // to escape the apstrophys
            const escape = translation[1].replace(/'/g, "\\'")
            const sql=`UPDATE sentences${lang} SET qform=E'${escape}' WHERE id=${translation[0]}`
            client.query(sql,(err,result) => {
                if (err) throw err;
            })
        })

        const finishedSql=`INSERT INTO day${lang} (dayid) VALUES (${day})`
        client.query(finishedSql,(err,result) => {
            if (err) throw err;
        })



    }
    catch(error) {
        console.log(error)
    }
})



// to see what days have been completed

app.get(`/completed${lang}`, async (req,res) => {
    try {
        const sql=`SELECT dayid,verbs FROM day${lang} ORDER BY dayid`
        client.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})


app.get(`/sentences${lang}`, async (req,res) => {
    try {
        const sql = `SELECT * FROM sentences${lang}`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(err) {
        console.log(err)
    }
})

app.get(`/verbs${lang}`, async (req,res) => {
    try {
        let sql=`SELECT * FROM verbs${lang} ORDER BY vid;`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        res.json([])
        console.log(error)
    }
})


// to clear out the verbID and it's grammar
app.patch(`/out${lang}verb`, async (req,res) => {
    try{
        const {obj} = req.body
        const sql=`UPDATE words${lang} SET vID=NULL WHERE word_id=${obj.word_id}`
        client.query(sql,(err,result) => {
            if (err)throw err;
        })
    }
    catch(error) {
        console.log(error)
    }
})

// for the adjectives
app.get(`/adjectives${lang}:day`, async (req,res) => {
    try {
        const {day} = req.params
        const sql=`SELECT * FROM adjectives${lang} WHERE word_id<${(parseInt(day)+1)*10} ORDER BY aid`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})

// for nouns
app.get(`/nouns${lang}:day`, async (req,res) => {
    try {
        const {day} = req.params
        const sql=`SELECT * FROM nouns${lang} WHERE word_id<${(parseInt(day)+1)*10} ORDER BY nid`
        client.query(sql,(err,result) => {
            if (err) throw err;
                res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})


app.get(`/day${lang}`, async (req,res) => {
    try {
        const sql=`SELECT * FROM day${lang} ORDER BY dayid`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })
    }
    catch(error) {
        console.log(error)
    }
})

})



app.post('/register', async (req,res) => {
    try {
        const {username,email,password,password2,name} = req.body
        let errors = [];
        if (password.length <6) {
            errors.push({message:'Password Should Be At Least 6 Characters Long'})
        }
        if (password!==password2) {
            errors.push({message: 'Passwords Do Not Match'})
        }
        if (errors.length >0) {
            res.json(errors)
        } else {
        const hashedPassword = await hash(password,12)
        const sql=`INSERT INTO users (username,email,password,name) VALUES ('${username}','${email}','${hashedPassword}','${name}')`
        client.query(sql,(err,result) => {
            if (err) {
            const message = (err.detail && err.detail.includes('already exists')) ? `Email ${email} already exists`: null
            errors.push({message})
            res.json(errors)
            }
            else {
            res.json('Confirmed!')
            }
        })

    }

    }
    catch(error) {
        console.log(error)
    }
})



app.post('/userlogin', async (req,res) => {
    const {username,password} = req.body
    const path = username.includes('@') ? 'email': 'username'
    const sql=`SELECT * FROM users WHERE ${path}=$1`
    client.query(sql,[username],async (err,result) => {
        if (err) throw err;
        if (result.rows.length >0) {
            const valid = await compare(password,result.rows[0].password)
            if (!valid) {
                res.json("Wrong username/password combination")
            } else {
                // set cookie header
                const {id,username,email,name} = result.rows[0]
                const isSecure = req.app.get('env')!=='development'
                res.cookie('user_id', id, {
                    httpOnly: true,
                    secure: isSecure,
                    signed: true
                });
            res.json({id,username,email,name})
            }
        } else res.json("Wrong username/password combination")
    })


})

app.get('/logout', (req,res) => {
    res.clearCookie('user_id');
    res.json({
        message: 'locked'
    })
})


app.get('/userdashboard', ensureLoggedIn)

// to make sure profiles are the same cookie
app.get('/userprofile/:id', (req,res,next) => {
    if (req.signedCookies.user_id ===req.params.id) {
        const sql=`SELECT username,email,id FROM users WHERE id=${req.signedCookies.user_id}`
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows[0])
        })
    } else {
        res.status(401);
        next(new Error('Un-Authorized'))
    }
})

app.use(function(req,res,next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err)
})

app.use(function(err,req,res,next) {
    res.status(err.status || res.statusCode || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') ==='development' ? err: {}
    })
})






// send users to the userDAtabase
app.post('/testuser', (req,res) => {
    try {
        const userArr = req.body.map(obj => {
            return Object.values(obj)
        })
        let sql = 'INSERT INTO users(email,purchased,created,pid,lastSent,unsubscribe,deactivated) VALUES $1;'
        client.query(sql,[userArr], (err,result) => {
            if (err) throw err;
            console.log('sent User')
        })
    }
    catch(error) {
        console.log(error)
    }
})

// select all the users to send Emails too

app.get('/getusers', (req,res) => {
    try {
        let sql = "SELECT * FROM users;"
        client.query(sql,(err,result) => {
            if (err) throw err;
            res.json(result.rows)
        })

    }

    catch(error) {
        console.log(error)
    }
})


// STRIPE
const stripe = require('stripe')('sk_test_51IR0tlK1jGKaRNn7bCxCB5WFtfC8TIiJ6r8pEF5GwXxMJHmY2J7T5Xuuud7jKHHOnZaPrUtiFY6CRoLhwxXz0VQi00oN1NCz5I')

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  res.json({ id: session.id });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started on ${port}`))