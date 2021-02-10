const solution = (wordArr,sentence) => {
    // itereate over the sentence
    // if the sentence has a _ replace it with the wordArr
    let count = 0;
    const sentenceArr = sentence.split(' ')
    return sentenceArr.reduce((acum,value) => {
        if (value.includes('_')) {
            const regex=value.replace(/_/g,wordArr[count])
            acum+=regex + ' '
            count++
        }
        else if (value.includes('__')) {
            const regex=value.replace(/__/g,wordArr[count]+wordArr[count+1])
            acum+=regex + ' '
            count+=2
        } else {
            acum+=value + ' '
        }
        return acum

    },'')
}

module.exports = solution