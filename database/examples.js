const asyncForEach = require('./asyncForEach')
const ruSentences = require('./russian/russianSentences')


const examples = async (arr) => {
    let final = []
    await asyncForEach(arr, async(obj) => {
        // we want to scrape every word
        const {word,word_id} = obj
        const url ='https://en.openrussian.org/ru/' + encodeURI(word) 
        const examples = await ruSentences(url,word_id)
        final.push(examples)
        console.log(`${word} done`)

    })
    const values = [].concat.apply([], final);
    return values
}


module.exports = examples