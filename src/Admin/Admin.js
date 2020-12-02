import React, {useState, useEffect } from 'react'
import NewQuestion from './NewQuestionForm'
import Lesson from './Lesson'

// import idioms from '../grammar/idioms'


const AdminJS = () => {
    // to make all the admins
    
    let adminBtns = []
    let questionArr = []
    const [finished, setFinished] = useState([])
    for (let i=0; i<500;i++) {
        const green = finished[i] ? 'green': null
        adminBtns.push(<button className={green}key={i} onClick={() => setday(i)}>{i+1}</button>)
        questionArr.push([])
        }
    
    const [day, setday] = useState(-1)
    const [sentences, setSentences] = useState([])
    const [questions, setQuestions] = useState(questionArr)
    const [learnedWords, setLearnedWords] = useState([])
    
    useEffect(() => {
        // to change the sentences
        if (day > -1) {
        fetch(`/day${day+1}`)
        .then(res => res.json())
        .then(data => setSentences(data))

        // to change questions if we have any
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
        // to change and check if the day is already in the SQL 
        //if it is then we are updating not inserting into SQLs
        fetch('/lesson')
        .then(res => res.json())
        .then(data => {
            let newArr = Array(500).fill(false)
            data.forEach(day => newArr.splice(day.dayID,1,true))
            setFinished(newArr)
        })

        // this will allow me to higlight all the words we've already had
        fetch('/words')
        .then(res => res.json())
        .then(data => {
            // slice the array from zero all the way to the new day
            const usedWords = data.slice(0,(day+1)*10).map(obj => obj.word)
            setLearnedWords(usedWords)
        })

        
        
         
        // console.log(Translate('hello world')
        // .then(data => console.log(data)))

      

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

    // shuffle(() => {

    // })
    const uniqueWords = learnedWords.slice(day*10,(day+1)*10)

    // is there prepositions?

    // is there idioms
    // console.log(idioms)
    // const trim = (arr) => {
    //     const index = arr.indexOf('')
    //     if (index > -1) {
    //         arr.splice(index,1)
    //     }
    //     return arr
    // }
    

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
    <div style={{display:'block', height: '100%'}}>
        <h1>Admin</h1>
    {(day >-1) ?
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
        !finished[day] ? sendLesson() : updateLesson()
        setday(-1)
        }}>
        {!finished[day] ? 'Send Lesson' : 'Update Lesson'}
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
