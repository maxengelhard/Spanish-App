const cron = require('node-cron')
const fetch = require('node-fetch');
const dotenv = require('dotenv').config()


let url = 'https://api.sendinblue.com/v3/contacts';

let options = {
  method: 'GET',
  qs: {limit: '5000000', offset: '0'},
  headers: {
    Accept: 'application/json',
    'api-key': process.env.API_KEY
  }
};

let users = []

let lastUserIndex = 0;

const getUsers = async () => {
  await fetch(url, options)
  .then(res => res.json())
  .then(json => users= json.contacts.slice(lastUserIndex))
  .catch(err => console.error('error:' + err));
  lastUserIndex += users.length
  return users;
}



cron.schedule('* * * * * *', async () => {
    const users = await getUsers()

    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const hr = String(today.getHours()).padStart(2,'0');
    const mn = String(today.getMinutes()).padStart(2,'0');
    const ss = String(today.getSeconds()).padStart(2,'0');
    const yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd + ' ' + hr + '-'+ mn+ '-' + ss;
    const newUsers = users.map(obj => {
      return {
        email: obj.email,
        purchased: 0,
        created: obj.createdAt,
        pid: 0,
        lastSent: today,
        unsubcribe: 0,
        deactivated: 0,
      }
    })

    // to then push it into mysql
    if (newUsers.length >0) {
    fetch('http://localhost:5000/testUser', {
  headers: {
      'Content-type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify(newUsers)
})
    }
})