const solution = (wordArr,sentence) => {
    // itereate over the sentence
    // if the sentence has a _ replace it with the wordArr
    let count = 0;
    const sentenceArr = sentence.split(' ')
    return sentenceArr.reduce((acum,value) => {
        if (value ==='_') {
            const regex=value.replace(/_/g,wordArr[count])
            count++
            return acum+=regex + ' '
        } else if (value.includes('__')) {
            const regex=value.replace(/__/g,wordArr[count]+wordArr[count+1]).replace(/-/g,'')
            count+=2
            return acum+=regex + ' '
        }
        else if (value.includes('_')) {
            const regex=value.replace(/_/g,wordArr[count]).replace(/-/g,'')
            count++
            return acum+=regex + ' '
        } else {
           return acum+=value + ' '
        }

    },'')
}

module.exports = solution