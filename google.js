const dotenv = require('dotenv');
dotenv.config()

const {Translate} = require('@google-cloud/translate').v2;

const CREDENTIALS = JSON.parse(process.env.REACT_APP_GOOGLE_TRANSLATE)

const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id   
});
 
async function translatethis(text) {
 
  // The target language
  const target = 'en';
 
  // Translates some text into english
  const [translation] = await translate.translate(text, target);
//   console.log(`Text: ${lesson}`);
  return translation
}


module.exports = translatethis
 
