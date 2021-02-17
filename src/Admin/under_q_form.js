const under_q_form = (str) => {
    const arr = str.split(' ')
    return arr.map(word => {
        if (!isNaN(parseInt(word)) || word==='-' || word==='.') {
            return word
        } 
        if (word===word.toUpperCase()) {
            if (word.includes('-')) {
                return '__'
            }
            return '_'
        } else if (word.match('[A-Z]')) {
            const index = word.match('[A-Z]').index
            if (word.length-index <4) {
                return word.slice(0,index) +'_'
            } else {
                return word.slice(0,index) +'__'
            }
            
        } return word
    }).join(' ')
}


module.exports = under_q_form