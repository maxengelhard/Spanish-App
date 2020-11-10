import React, {useState, useEffect } from 'react'
import NewQuestion from './NewQuestionForm'
import Lesson from './Lesson'

const AdminJS = () => {
    // to make all the admins
    let adminBtns = []
    let questionArr = []
    for (let i=0; i<500;i++) {
        adminBtns.push(<button key={i} onClick={() => setday(i)}>{i+1}</button>)
        questionArr.push([])
    }
    const [day, setday] = useState(-1)
    const [sentences, setSentences] = useState([])
    const [questions, setQuestions] = useState(questionArr)
    useEffect(() => {
        // to change the sentences
        if (day > -1) {
        fetch(`/day${day+1}`)
        .then(res => res.json())
        .then(data => setSentences(data))

        fetch('/questions')
        .then(res => res.json())
        .then(data => {
            // to change based on the day
            let newArr = Array(500).fill([])
            let dayArr = []
            data.forEach(obj => {
                const inject = obj.id.split('-')[0]
                if (inject === day.toString()) {
                    dayArr.push(obj)
                }
            })
            newArr[day] = dayArr
            setQuestions(newArr)
        })

        }

    }, [day])


    const addQ = (newQuestion) => {
        let newArr = [...questions]
        let edited = questions[day]
        // to check if we are editing
        const index = edited.reduce((value, obj,index) => {
            if (obj.active ===true) {
                value = index
            }
            return value;
        },false)
        if (Number.isInteger(index)) {
            edited[index] = {
            id: `${day}-${index}`,
            question: `${newQuestion}`,
            active:false
        } 
        }
        else {
            edited.push({
                id: `${day}-${questions[day].length}`,
                question: `${sentences[questions[day].length].englishS} ${newQuestion}`,
                active:false
            })

            document.querySelector(`.sentence-${day}-${questions[day].length-1}`).classList.add('submited')
            
        }
        newArr[day] = edited
        setQuestions(newArr)
    }
    const editQ = index => (e) => {
        let newArr = [...questions]
        let edited = [...questions[day]]
        edited[index] = {...questions[day][index], active:!newArr[day][index].active }
        newArr[day] = edited
        setQuestions(newArr)
    }

    // shuffle(() => {

    // })
    const uniqueWords = [...new Set(sentences.map(item => item.word))]

    // is there prepositions?


    // highlight any words in spanish that have these unqiue words
    const higlight = (str) => {
        const wordArr = str.toLowerCase().split(' ')
        return wordArr.reduce((sentence, word) => {
            if (uniqueWords.includes(word)) {
            return `${sentence + word.toUpperCase()} `
            }
        return `${sentence + word} `
        }, '')

    }

    // send lesson
    const sendLesson = () => {
        fetch('/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({day, lesson: questions[day], questions})
        })
    }


    return (
    <div style={{display:'block', height: '100%'}}>
        <h1>Admin</h1>
    {(day >-1) ?
    <div className='adminRow'>
    <div className='adminColumn'>
    {sentences.map((item,index) => {
    return (<div className={`sentence-${day}-${index}`} key={item.id}>
        <p><b>{item.id}:</b> {item.englishS}</p>
        <div style={{display: 'flex'}}>{higlight(item.spanishS)}</div>
        <NewQuestion addQ={addQ}/>
    </div>)
    })}
    </div>
    <div className='adminColumn'>
    <div className='words'>
        <h3>New Words</h3>
    {uniqueWords.map((word,i) => <div key={i}>{word}</div>)}
    </div>
    <Lesson 
    questions={questions} 
    addQ={addQ} 
    editQ={editQ} 
    day={day} 
    setday={setday}/>
    <h3>Explanation</h3>
    {sentences.map(item => {
    return (<div key={item.id}>
        <h3>{item.word}</h3>
        <p>{item.way}</p>
        <p>{item.englishS}</p>
        <p>{item.spanishS}</p>
    </div>)
    })}
    {questions[day].length >0 ?  
    <button onClick={() => {
        sendLesson()
        setday(-1)
        }}>
        Send lesson
    </button>
        : null}
    </div>
    
    </div> : 
    <div className='dayButtons'>
    {adminBtns}
    </div>
    }
    </div>
    )
}

export default AdminJS
