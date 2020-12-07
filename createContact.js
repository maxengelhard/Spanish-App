const SibApiV3Sdk = require('sib-api-v3-sdk');
const dotenv = require('dotenv');
dotenv.config()
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

let apiInstance = new SibApiV3Sdk.ContactsApi();

let createContact = new SibApiV3Sdk.CreateContact();

createContact.email = 'EMAIL';
createContact.listIds = [2]
createContact.attributes = {
    "FIRSTNAME":"FNAME",
    "LASTNAME":"NAME",
    "OPT_IN": true,
}

apiInstance.createContact(createContact).then(function(data) {
  console.log('API called successfully. Returned data: ' + JSON.stringify(data));
}, function(error) {
  console.error(error);
});


// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error('error:' + err));

// create
// let url = 'https://api.sendinblue.com/v3/contacts';

// let options = {
//   method: 'POST',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//     'api-key': process.env.API_KEY
//   },
//   body: '{"attributes":{"FNAME":"FNAME","LNAME":"LNAME"},"listIds":[2],"updateEnabled":true,"email":"EMAIL"}'
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error('error:' + err));

// update
// let url = 'https://api.sendinblue.com/v3/contacts/identifier';

// let options = {
//   method: 'PUT',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//     'api-key': 'process.env.API_KEY'
//   },
//   body: '{"attributes":{"EMAIL":"EMAIL","FNAME":"FNAME","LNAME":"LNAMe"},"listIds":[2]}'
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error('error:' + err));


// delete
// let url = 'https://api.sendinblue.com/v3/contacts/';

// let options = {
//   method: 'DELETE',
//   headers: {
//     Accept: 'application/json',
//     'api-key': 'process.env.API_KEY'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error('error:' + err));
