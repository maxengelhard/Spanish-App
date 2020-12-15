import React, {useState, useEffect } from 'react'
import NewQuestion from './NewQuestionForm'
import Lesson from './Lesson'
import {Link} from 'react-router-dom'


const EachDay = ({match}) => {
    const location = parseInt(match.url.slice(10))
    let questionArr = []
    const [finished, setFinished] = useState([])
    for (let i=0; i<500;i++) {
        questionArr.push([])
        }
    const [day, setday] = useState(location)
    const [sentences, setSentences] = useState([])
    const [questions, setQuestions] = useState(questionArr)
    const [learnedWords, setLearnedWords] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        // to change the sentences
        const fetchData = async () => {
        if (day >= 0) {
        await fetch(`/day${day+1}`)
        .then(res => res.json())
        .then(data => setSentences(data))

        // to change questions if we have any
        await fetch('/questions')
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


     
        // to change and check if the day is already in the SQL 
        //if it is then we are updating not inserting into SQLs
        await fetch('/lesson')
        .then(res => res.json())
        .then(data => {
            let newArr = Array(500).fill(false)
            data.forEach(day => newArr.splice(day.dayID,1,true))
            setFinished(newArr)
        })

        // this will allow me to higlight all the words we've already had
        await fetch('/words')
        .then(res => res.json())
        .then(data => {
            // slice the array from zero all the way to the new day
            const usedWords = data.slice(0,(day+1)*10).map(obj => obj.word)
            setLearnedWords(usedWords)
        })
    

        setLoading(false)
    }
    }

    fetchData()

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

    const uniqueWords = learnedWords.slice((day*10),(day+1)*10)

    // send lesson
    const sendLesson = () => {
        fetch('/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({day, lesson: questions[day], solution: sentences})
        })
    }

    const updateLesson = () => {
        fetch('/update', {
            headers: {
                'Content-type': 'application/json'
            },
           method: 'PATCH',
           body: JSON.stringify({day, lesson: questions[day], solution: sentences})
        })
    }
    
    return (
    loading ? <div className="spin"></div> : 
    <div>
    <div className='adminRow'>
    <div className='adminColumn'>
    {sentences.map((item,index) => {
        const submited = questions[day][index] ? 'submited': null
    return (<div className={`sentence-${day}-${index} ${submited}`} key={item.id}>
        <p><b>{item.id}:</b> {item.englishS}</p>
        <p>{item.spanishS}</p>
        <p>{item.qform}</p>
        {!submited ? <NewQuestion addQ={addQ} qform={item.qform}/> : null}
    </div>)
    })}
    </div>
    <div className='adminColumn'>
    <div>
        {learnedWords.join(' ')}
        </div>
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
    {questions[day].length > 0 ? 
    <Link to={`/admin`}>
    <button onClick={() => {
        !finished[day] ? sendLesson() : updateLesson()
        }}>
        {!finished[day] ? 'Send Lesson' : 'Update Lesson'}
    </button>
    </Link>
        : null}
    <h3>Explanation</h3>
    {sentences.map(item => {
    return (<div key={item.id}>
        <h3>{item.word}</h3>
        <p>{item.way}</p>
        <p>{item.englishS}</p>
        <p>{item.spanishS}</p>
    </div>)
    })}
    </div>
    
    </div>
        </div>
    )
}

export default EachDay
