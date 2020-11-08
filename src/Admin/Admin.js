import React, {useState, useEffect } from 'react'
import NewQuestion from './NewQuestionForm'
import Lesson from './Lesson'

const AdminJS = () => {
    const [day, setday] = useState(0)
    const [sentences, setSentences] = useState([])
    const [questions, setQuestions] = useState([[],[],[],[]])

    useEffect(() => {
        // to change the sentences
        fetch(`/day${day+1}`)
        .then(res => res.json())
        .then(data => setSentences(data))

    }, [day])


    const addQ = (newQuestion) => {
        let newArr = [...questions]
        const lastQ = newQuestion.split('.')
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
            question: lastQ.length >1 ? `${lastQ[0]}. ${lastQ[lastQ.length-1]}`: `${sentences[day].englishS} ${newQuestion}`,
            id: `${day}-${index}`,
            active:false
        } 
        }
        else {
            edited.push({
                question: `${sentences[questions[day].length].englishS} ${newQuestion}`,
                id: `${day}-${questions[day].length}`,
                active:false
            })
            
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

    // highlight any words in spanish that have these unqiue words
    const higlight = (str) => {
        const wordArr = str.toLowerCase().split(' ')
        return wordArr.map((word,i) => {
            if (uniqueWords.includes(word)) {
                return <p key={i}><b>{word}</b></p>
            }
            return <p key={i}>{word}</p>
        })
    }
    return (
    <div style={{display:'block', height: '100%'}}>
        <h1>Admin</h1>
    <div className='dayButtons'>
    <button onClick={() => setday(0)}>1</button>
    <button onClick={() => setday(1)}>2</button>
    <button onClick={() => setday(2)}>3</button>
    <button onClick={() => setday(3)}>4</button>
    </div>
    <Lesson questions={questions} addQ={addQ} editQ={editQ} day={day}/>
    <div className='createLesson'>
    <div className='words'>
        <h3>New Words</h3>
    {uniqueWords.map((word,i) => <div key={i}>{word}</div>)}
    </div>
    {sentences.map((item,index) => {
    return (<div key={item.id}>
        <p><b>{item.id}:</b> {item.englishS}</p>
        <div style={{display: 'flex'}}>{higlight(item.spanishS)}</div>
        <NewQuestion addQ={addQ}/>
    </div>)
    })}
    <h3>Explanation</h3>
    {sentences.map(item => {
    return (<div key={item.id}>
        <h3>{item.word}</h3>
        <p>{item.way}</p>
        <p>{item.spanishS}</p>
        <p>{item.englishS}</p>
    </div>)
    })}
    </div>
    </div>
    )
}

export default AdminJS
