import React from 'react'

const Slide = (...props) => {

    const isCorrect = () => {
        console.log('correct!')
    }

    const shuffle = (array)=> {
        let currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
    const {lessonObj,slideObj,newWords} = props[0]
    let wordArray = slideObj.wordarray
    if (wordArray.length < 10) {
        // to add more words to the wordArray for testing
        const randomNew = shuffle(newWords)
        while(wordArray.length<10) {
            const added = randomNew.pop()
            if (!wordArray.includes(added.toUpperCase())) {
            wordArray.push(added)
            }
        }
    }
    return (
        <div>
            <h2>{lessonObj.word}: {lessonObj.way}</h2>
            <h5>{lessonObj.englishs}</h5>
            <p>{slideObj.question}</p>
            <div className='wordBank'>
                {shuffle(wordArray.map((word,i) => {
                    return <button key={i} className='wordButtons'>{word.toLowerCase()}</button>
                }))}
            </div>
            <button style={{height:'30px',width:'60px'}} onClick={() => isCorrect()}>Test</button>
        </div>
    )
}

export default Slide
