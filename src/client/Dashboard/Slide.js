import React from 'react'

const Slide = (...props) => {

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
    let moreWordsArray = slideObj.wordarray.slice()
    if (moreWordsArray.length < 10) {
        // to add more words to the wordArray for testing
        const randomNew = shuffle(newWords)
        while(moreWordsArray.length<10) {
            const added = randomNew.pop()
            if (!moreWordsArray.includes(added.toUpperCase())) {
                moreWordsArray.push(added)
            }
        }
    }
    let wordIndex = 0;
    let checkArray = []
    const placeWord = (e) => {
        const {wordarray} = props[0].slideObj
        const el = e.target
        const {innerText} = el
        const thisIndex = [...el.parentElement.children].indexOf(el)
        console.log(thisIndex)
        if (checkArray.filter(word => word!=='').length>wordarray.length) {
            shakebutton(el)
        }else {
        el.classList.add('hidden')
        document.getElementsByClassName('opening')[wordIndex].innerText = innerText
        checkArray[wordIndex] = innerText.toUpperCase()
        wordIndex++
        }
    }

    const removeWord = (e) => {
        if (wordIndex>0) {
        const el = e.target
        const {innerText} = el
        // find the matched inner text element of the hidden element and remove the class
        const wordButtons = document.getElementsByClassName('wordButtons')
        for (let i=0; i<wordButtons.length;i++) {
            if (wordButtons[i].innerText === innerText) {
                wordButtons[i].classList.remove('hidden')
            }
        }
        el.innerText = ''
        let firstBlank = 0;
        const openings = document.getElementsByClassName('opening')
        for (let i=0; i<openings.length;i++) {
            if (openings[i].innerText ==='') {
                firstBlank=i
                checkArray[i] = ''
                break
            }
        }
        wordIndex = firstBlank
        }
        
    }

    const shakebutton = (el) => {
        console.log(el)
    }


    const isCorrect = () => {
        console.log(JSON.stringify(checkArray)===JSON.stringify(slideObj.wordarray))
    }

    return (
        <div>
            <h2>{lessonObj.word}: {lessonObj.way}</h2>
            <h5>{lessonObj.englishs}</h5>
            <div className='question'>{slideObj.question.split(' ').map((word,i) => {
                if (word === '_') {
                    return <button className='opening' onClick={(e) => removeWord(e)} key={i}></button>
                } else {
                    return <div key={i}>{word}</div>
                }
            })}</div>
            <div className='wordBank'>
                {shuffle(moreWordsArray.map((word,i) => {
                    return <button key={i} className='wordButtons' onClick={(e) => placeWord(e)}>{word.toLowerCase()}</button>
                }))}
            </div>
            <button style={{height:'30px',width:'60px'}} onClick={() => isCorrect()}>Test</button>
        </div>
    )
}

export default Slide
