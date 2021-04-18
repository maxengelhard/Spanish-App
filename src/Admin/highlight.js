const objectPronouns = require('./objectPronouns')

const ending = (num,word) => {
    const prev = ['a','e','i','o']
    const accent = ['á','í','é','ó']
    const end = word.slice(word.length-num,word.length)
    const before = word[word.length-(num+1)]
    const verb = word.slice(0,word.length-num)
    if (word.length > num && objectPronouns[num].includes(end)) {
        const command = prev.includes(before)
        if (command) {
             const has_accent = verb.split('').some(el => accent.includes(el))
            if (has_accent) {
                // off cases
                if (word ==='árboles') {
                    return false
                }
                // try to replace the accent as to check if we already have that verb
                const replace_acc = (match,offset,string) => {
                    const obj = {
                    'á': 'a',
                    'í': 'i',
                    'é': 'e'
                    }
                    return obj[match]
                }
                const og_verb = verb.replace(/á|í|é/g,replace_acc)
    
                return [og_verb,end]
            } else if (verb ==='da' || verb==='esta' || verb==='di') {
                // irregulars
            return [verb,end]
        }

        } else if (before==='r') {
            
    
            // off case
            if (word==='parte' || word==='fuerte' || word==='enorme' || word==='suerte'|| word==='norte'
            || word==='corte' || word==='muerte' || word==='marte' || word==='transporte' || word==='reparte' || word==='arte'
            || word==='duerme' || word==='carlos') {
                return false
            }
            // infinitive
            return [verb,end]
        } else if (before==='n' && verb==='pon') {
            return [verb,end]
        }
    }  else {
        return false
    }

}

const loop_end = (thisWord,learnedWords,solutionArr,withPunc) => {
    const word = thisWord.toLowerCase()
    for (let i=6;i>=2;i--) {
        const result = ending(i,word)
        if (result) {
            const indexi = withPunc ? result.map((word,i) => {
                    const indexOf = withPunc.indexOf(word)
                    // begginging
                    if (i===0) {
                        return withPunc.slice(0,indexOf+word.length)
                    } else {
                    return withPunc.slice(indexOf)
                    }
                }) : null
            let irregular = '&' // something that won't be in learned words
            if (result[0]==='vamo') {
                irregular='va'
            }
            if (i>3) {
                // find where the L is that's the index
                const index = result[1].indexOf('l')
                let front = result[1].slice(0,index)
                let back = result[1].slice(index)
                if (learnedWords.includes(front)) {
                    // this will always have an undercase part of a word
                    solutionArr.push(front)
                    front = front.toUpperCase()
                }
                if (learnedWords.includes(back)) {
                    // the ending might have a punc
                    const puncback = (indexi && (indexi[1].indexOf(back) !== -1)) ? indexi[1] : back
                    solutionArr.push(puncback)
                    back = back.toUpperCase()
                }
                result[1] = front + back
            }
             else if (learnedWords.includes(result[0]) || learnedWords.includes(irregular)) {
                 // to check to see if we have the verb
                 // check if begging has a punc
                    const puncIndex = withPunc ? withPunc.indexOf(result[0]) : 0
                    solutionArr.push(thisWord.slice(0,result[0].length+puncIndex))
                    result[0] = result[0].toUpperCase()
                    
                } else {
                    result[0] = word.slice(0,word.length-i)
                }
                if (learnedWords.includes(result[1])) {
                    // does the ending have a punc
                    const puncIndex = withPunc ? withPunc.indexOf(result[1]) : null
                    const finalEnd = puncIndex ? thisWord.slice(indexi[0].length) : result[1]
                    solutionArr.push(finalEnd)
                    // solutionArr.push(result[1])
                    result[1] = '-' + result[1].toUpperCase()
                    
                }
                return result.join('')

        } else continue

    }

}

const higlight = (str,learnedWords) => {
    const wordArr = str.split(' ')
    let solutionArr = []
    const text = wordArr.reduce((sentence, thisWord,i) => {
        const word = thisWord.toLowerCase()
        let punc = thisWord.match('\\?|\\!|¿|¡|-|;|:|"|\\.|\\,')
        if (punc) {
            let puncWord = ''
            while(punc) {
                puncWord = punc.input.slice(0,punc.index) + punc.input.slice(punc.index+1)
                punc = puncWord.match('\\?|\\!|¿|¡|-|;|:|"|\\.|\\,')
            }
            // endings
            if (learnedWords.includes(puncWord.toLowerCase()) && word!=='-' && word!=='.') {
                solutionArr.push(thisWord)
                return `${sentence + word.toUpperCase()} `
            } else {
                const result = loop_end(puncWord,learnedWords,solutionArr,thisWord)
                if (result) {
                return `${sentence + result} `
                }
            }

        }
        else if (learnedWords.includes(word)) {
            solutionArr.push(thisWord)
        return `${sentence + word.toUpperCase()} `
        }
        // check to see the endings
        else {
                const result = loop_end(thisWord,learnedWords,solutionArr)
                if (result) {
                return `${sentence + result} `
                }
        }

    return `${sentence + word} `
    }, '').trim()
    // make all solutionArr uppercase to show the differences
    const upperCaseArr = solutionArr.map(word => word.toUpperCase())
    // console.log(solutionArr)
    return [text,upperCaseArr,solutionArr]

}


module.exports = higlight 