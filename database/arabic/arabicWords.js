const fs = require('fs')
const text = fs.readFileSync('../frequentWords/2018/ar/ar_50k.txt').toString('utf-8')
const arr = text.split('\n')

console.log(arr.length)



let frequentWords = []

// using axios

// async function getFrequentWords() {
//     // start the frequent words back to an empty array
//     frequentWords = []
//     const {data} = await axios.get(page_url);
//     const $ = cheerio.load(data)
//     const list = $('#js-repo-pjax-container > div.container-xl.clearfix.new-discussion-timeline.px-3.px-md-4.px-lg-5 > div > div.Box.mt-3.position-relative > div.Box-body.p-0.blob-wrapper.data.type-text.gist-border-0 > table > tbody > tr')
//     console.log(list.length)
//     // list.each((i,word) => {
//     //     const currentWord = $(word).text()
//     //     // need this becuase there is a bug in the html
//     //     if (currentWord.length > 30) {
//     //         return true
//     //     }
//     //     const verb = null
//     //     const pronunciation = null
//     //     const grammar = null
//     //     frequentWords.push({id: i, word: currentWord, vID: verb, pronunciation, grammar})
//     // })

//     return frequentWords
// }


// const call = async () => await getFrequentWords()
// call()
// module.exports = getFrequentWords