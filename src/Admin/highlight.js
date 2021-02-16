const objectPronouns = require('./objectPronouns')

const ending = (num,word) => {
    const prev = ['a','e','i']
    const accent = ['á','í','é']
    const end = word.slice(word.length-num,word.length)
    const before = word[word.length-(num+1)]
    if (word.length > num && objectPronouns[num].includes(end)) {
        const command = prev.includes(before)
        if (command) {
             const has_accent = word.split('').some(el => accent.includes(el))
            if (has_accent) {
                // try to replace the accent as to check if we already have that verb
                const replace_acc = (match,offset,string) => {
                    const obj = {
                    'á': 'a',
                    'í': 'i',
                    'é': 'e'
                    }
                    return obj[match]
                }
                const og_verb = word.replace(/á|í|é/g,replace_acc).slice(0,word.length-num)
                
                return [og_verb,end]
            }

        } else if (before==='r') {
            // off case
            if (word==='parte') {
                return false
            }
            // infinitive
            return [word.slice(0,word.length-num),end]
        }
    }  else {
        return false
    }

}

const loop_end = (word,learnedWords,solutionArr) => {
    for (let i=6;i>=2;i--) {
        const result = ending(i,word)
        if (result) {
            if (i>3) {
                // find where the L is that's the index
                const index = result[1].indexOf('l')
                let front = result[1].slice(0,index)
                let back = result[1].slice(index)
                if (learnedWords.includes(front)) {
                    front = front.toUpperCase()
                    solutionArr.push(front)
                }
                if (learnedWords.includes(back)) {
                    back = back.toUpperCase()
                    solutionArr.push(back)
                }
                result[1] = front + back
            }
             else if (learnedWords.includes(result[0])) {
                    result[0] = result[0].toUpperCase()
                    solutionArr.push(result[0])
                } else {
                    result[0] = word.slice(0,word.length-i)
                }
                if (learnedWords.includes(result[1])) {
                    result[1] = '-' + result[1].toUpperCase()
                    solutionArr.push(result[1])
                }
                return result.join('')

        } else continue

    }

}

const higlight = (str,learnedWords) => {
    const wordArr = str.toLowerCase().split(' ')
    let solutionArr = []
    const text = wordArr.reduce((sentence, word) => {
        let punc = word.match('\\?|\\!|¿|¡|-|"|\\.|\\,')
        if (punc) {
            let puncWord = ''
            while(punc) {
                puncWord = punc.input.slice(0,punc.index) + punc.input.slice(punc.index+1)
                punc = puncWord.match('\\?|\\!|¿|¡|-|"|\\.|\\,')
            }
            // endings
            if (learnedWords.includes(puncWord)) {    
                solutionArr.push(word.toUpperCase())
                return `${sentence + word.toUpperCase()} `
            } else {
                const result = loop_end(puncWord,learnedWords,solutionArr)
                if (result) {
                return `${sentence + result} `
                }
            }

        }
        else if (learnedWords.includes(word)) {
            solutionArr.push(word.toUpperCase())
        return `${sentence + word.toUpperCase()} `
        }
        // check to see the endings
        else {
                const result = loop_end(word,learnedWords,solutionArr)
                if (result) {
                return `${sentence + result} `
                }
        }

    return `${sentence + word} `
    }, '').trim()
    return [text,solutionArr]

}


module.exports = higlight 