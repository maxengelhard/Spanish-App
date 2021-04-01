import React,{useState,useEffect} from 'react'

const Slide = (...props) => {
    const [wordBank,setWordBank] = useState([true,true])

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
    const {lessonObj,slideObj,newWords,gotQuestionRight} = props[0]
    useEffect(() => {
        let moreWordsArray = slideObj.wordarray.slice()
    if (moreWordsArray.length < 10) {
        // to add more words to the wordArray for testing
        const randomNew = shuffle(newWords).slice()
        while(moreWordsArray.length<10) {
            const added = randomNew.pop()
            if (!moreWordsArray.includes(added.toUpperCase())) {
                moreWordsArray.push(added)
            }
        }
    }
    const shuffledWordBank = shuffle(moreWordsArray)
    setWordBank([shuffledWordBank,true])
    return true

    },[slideObj,newWords])

    const [checkArray,setCheckArray] = useState([])
    const [wordIndex,setWordIndex] = useState(0)
    const placeWord = (e) => {
        let updateCheckArray = [...checkArray]
        const {wordarray} = props[0].slideObj
        const el = e.target
        const {innerText} = el
        if (checkArray.filter(word => word!=='').length>wordarray.length) {
            shakebutton(el)
        }else {
        el.classList.add('hidden')
        document.getElementsByClassName('opening')[wordIndex].innerText = innerText
        updateCheckArray[wordIndex] = innerText.toUpperCase()
        const openings = document.getElementsByClassName('opening')
        for (let i=0; i<openings.length;i++) {
            if (openings[i].innerText ==='') {
                setWordIndex(i)
                break
            }
        }
        setCheckArray(updateCheckArray)
        }
    }

    const removeWord = (e) => {
        const el = e.target
        const {innerText} = el
        // find the matched inner text element of the hidden element and remove the class
        const wordButtons = document.getElementsByClassName('wordButtons')
        for (let i=0; i<wordButtons.length;i++) {
            if (wordButtons[i].innerText === innerText) {
                wordButtons[i].classList.remove('hidden')
            }
        }
        let updateCheckArray = [...checkArray]
        el.innerText = ''
        const openings = document.getElementsByClassName('opening')
        for (let i=0; i<openings.length;i++) {
            if (openings[i].innerText ==='') {
                updateCheckArray[i] = ''
                setWordIndex(i)
                setCheckArray(updateCheckArray)
                break
            }
        }
        
    }

    const shakebutton = (el) => {
        console.log(el)
    }

    const textChange = () => {
        const newBank = [...wordBank]
        newBank[1] = !newBank[1]
        setWordBank(newBank)
    }

   

    const buttonText = (shouldText,key) => {
        if (shouldText) {
            return <input key={key} type='text' className='opening' required onChange={(e) => setAnswer(e)}></input>
        } else {
            return <button className='opening' onClick={(e) => removeWord(e)} key={key}></button> 
        }
    }

    const setAnswer = (e) => {
        const element = e.target
        const text = e.target.value
        let updateCheckArray = [...checkArray]
        const openings = document.getElementsByClassName('opening')
        for (let i=0;i<openings.length;i++) {
            if (openings[i] ===element) {
                updateCheckArray[i] = text.toUpperCase()
                element.setAttribute('value',text)
            }
        }
        setCheckArray(updateCheckArray)
    }

    const isCorrect = () => {
        console.log(slideObj.wordarray)
        if (JSON.stringify(checkArray)===JSON.stringify(slideObj.wordarray)) {
            gotQuestionRight()
        }
    }

    return (
        <div>
            <div className='correct'>Correct</div>
            <h2>{lessonObj.word}: {lessonObj.way}</h2>
            <h5>{lessonObj.englishs}</h5>
            <div className='question'>{slideObj.question.split(' ').map((word,i) => {
                if (word === '_') {
                    return buttonText(!wordBank[1],i)
                } else if (word.includes('_')) {
                
                    return <div style={{display:'inline-flex'}}key={i}>{word.split('_').map((part,j) =>{
                    if (part==='') {
                        return buttonText(!wordBank[1],i)
                    } else {
                        return <div key={j}>{part}</div> 
                    }
                })}</div>
                }
                else {
                    return <div key={i}>{word}</div>
                }
            })}</div>
            {(wordBank[0].length===10 && wordBank[1] ===true)?
            <div className='wordBank'>
                {wordBank[0].map((word,i) => {
                return <button key={i} className='wordButtons' onClick={(e) => placeWord(e)}>{word.toLowerCase()}</button>
                })}
            </div> :null}
            <button style={{height:'30px',width:'60px'}} onClick={() => textChange()}>{!wordBank[1] ? 'Use Word Bank' : 'Use Text'}</button>
            <button style={{height:'30px',width:'60px'}} onClick={() => isCorrect()}>Test</button>
        </div>
    )
}

export default Slide
