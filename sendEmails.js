const dotenv = require('dotenv')
const cron = require('node-cron')
dotenv.config()
const fetch = require('node-fetch')

const AWS = require('aws-sdk')
const email = require('./testemail2')

const SESConfig = {
  apiVersion: '2010-12-01',
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
}


// cron.schedule('* * * * * *', async () => {

//     // get all the lessons
//     const lessons = await fetch('http://localhost:5000/lesson').then(res => res.json()).then(data => data)
//     // get the users
//     let currentUser = 0;
//     const users = await fetch('http://localhost:5000/getusers')
//     .then(res => res.json())
//     .then(data => data)

//     console.log(lessons, users)
//     // send out 20emails every second

//     // in the email send out their current index

//     // after sending it out update the currentUser
//     // and update each persons index+

//     // if currentUser is greater than users.length then stop
// })

const sendEmail = async () => {
  // get all the lessons
   const lessons = await fetch('http://localhost:5000/lesson').then(res => res.json()).then(data => data)
   const {lesson,solution} = lessons[0]
   const html = await email(`${lesson}<p><h4>Solution</h4><p>${solution}`)

       // get the users
    // let currentUser = 0;
    // const users = await fetch('http://localhost:5000/getusers')
    // .then(res => res.json())
    // .then(data => data)


   const params = {
    Destination: { /* required */
    //   CcAddresses: [
    //     'EMAIL_ADDRESS',
    //     /* more items */
    //   ],
      ToAddresses: [
        'mackw2019@gmail.com',
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Html: {
         Charset: "UTF-8",
         Data: html
        },
        // Text: {
        //  Charset: "UTF-8",
        //  Data: "Hello Max"
        // }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: 'Node + SES Example'
       }
      },
    Source: '"FluencyDaily" <max@fluencydaily.com>', /* required */
    ReplyToAddresses: [
       'max@fluencydaily.com',
      /* more items */
    ],
  };

  //  Create the promise and SES service object
  const sendPromise = new AWS.SES(SESConfig).sendEmail(params).promise();
  
  // Handle promise's fulfilled/rejected states
  sendPromise.then(
    function(data) {
      console.log(data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });

   
}

sendEmail()


  


// for everyday at 8am
    // cron.schedule('0 8 * * *', () => {
    //     console.log('running every day at 8am')
    // })