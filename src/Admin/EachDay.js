import React, {useState, useEffect } from 'react'
import NewQuestion from './NewQuestionForm'
import Lesson from './Lesson'
import {Link} from 'react-router-dom'
import higlight from './highlight'
import underScore from './underscore'
import translateThis from './translateThis'




const EachDay = ({match}) => {
    const last = match.url.lastIndexOf('/')
    const lang = match.url.slice(7,last)
    const day = parseInt(match.url.slice(last+4))
    let questionArr = []
    for (let i=0; i<500;i++) {
        questionArr.push([])
        }
    const [sentences, setSentences] = useState([])
    const [questions, setQuestions] = useState(questionArr)
    const [learnedWords, setLearnedWords] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        // to change the sentences
        const fetchData = async () => {
        if (day >= 0) {
        // check if we've done something that day
        // if we haven't then update the qforms so we only have to do it once    
        await fetch(`/completed${lang}`)
        .then(res => res.json())
        .then(async (completed) => {
        const thisDay = completed.map(obj => obj.dayID).includes(day)
        // this will allow me to higlight all the words we've already had
        await fetch(`/words${lang}${day+1}`)
        .then(res => res.json())
        .then(async (data) => {
            // slice the array from zero all the way to the new day
            const usedWords = data.map(obj => obj.word)
        // this will check to see if we have a verb
        // if we do we want the last index of that and all other verbs will be pushed into to usedWords
            const verbId = data.filter(obj => obj.vID !== null)
            const adjectives = data.filter(obj => obj.aID !==null)
            const nouns = data.filet(obj => obj.nID !==null)

            // if adjectives or nouns isn't nothing then fetch the adjectives and verbs
            
            
           await fetch(`/verbs${lang}`)
            .then(res => res.json())
            .then(async (verbs) => {
                let verbArr = []
                // get all the data of the vId's
                // itereate over the verbs we have the index is the verb id
                verbId.forEach(obj => {
                    const arr = Object.values(verbs[obj.vID]).slice(1)
                    verbArr.push(arr)

                })
        
                // to make the verbs one big array
                const cleanVerbs = [].concat.apply([], verbArr)
                const ultimate = usedWords.concat(cleanVerbs)
                setLearnedWords(ultimate)


               await fetch(`/day${lang}${day+1}`)
                .then(res => res.json())
                .then(async (sentences) => {
                    
                setSentences(sentences)

        
                // if this day is not true then we need to set the qform to something
                if (!thisDay && lang !=='spanish') {
                const qform = await Promise.all(sentences.map(async (obj) => [obj.id,await translateThis(underScore(obj[`${lang}S`],ultimate))]))
                    fetch(`/setqform${lang}${day}`, {
                    headers: {
                    'Content-type': 'application/json'
                    },
                    method: 'PATCH',
                    body: JSON.stringify({day, qform})
                    })

                }
            })
            })
        })

    })


        

        // to change questions if we have any
        await fetch(`/questions${lang}`)
        .then(res => res.json())
        .then(data => {
            // to change based on the day
            let newArr = Array(500).fill([])
            let dayArr = []
            data.forEach(obj => {
                const arr = obj.id.split('-')
                const inject = arr[0]
                if (inject === day.toString()) {
                    dayArr.push(obj)
                }
            })
            let final = Array(dayArr.length).fill()
            dayArr.forEach(obj => {
                const index = obj.id.split('-')[1]
                final[index] = obj
            })
            newArr[day] = final
            setQuestions(newArr)
        })


     
        // to change and check if the day is already in the SQL 
        //if it is then we are updating not inserting into SQLs
    

        setLoading(false)
    }
    }

    fetchData()
    return 0;

    }, [lang,day])


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
    const updateLesson = () => {
        fetch(`/update${lang}`, {
            headers: {
                'Content-type': 'application/json'
            },
           method: 'PATCH',
           body: JSON.stringify({day, lesson: questions[day], solution: sentences})
        })
    }

    
    return (
    loading ? <div className="spin"></div> :
    <div style={{width: '100%', overflowX: 'hidden'}}> 
    <div className='words'>
        <h3>New Words</h3>
    {uniqueWords.map((word,i) => <div key={i}>{word}</div>)}
    </div>
    <div className='eachDayPage'>
    <table className='adminTable'>
        <thead>
            <tr>
                <th>Questions</th>
                <th>Explanation</th>
                <th>Final</th>
            </tr>
        </thead>
        <tbody>
        {sentences.map((item,index) => {
        const submited = questions[day][index] ? 'submited': null
        const lastSub = questions[day].length
    return (<tr className={`sentence-${day}-${index}`} key={item.id}>
        <td className={submited}>
        <p><b>{item.id}: {item.word}</b></p>
        <p>{item.way}</p>
        <p>{item.englishS}</p>
        </td>
        <td className={submited}>
            {/* check to see if we have translated it yet */}
        <p>{higlight(item[`${lang}S`],learnedWords)}</p>
        {/* this is the form. if it's spanish we've already translated it  else translate the sentences*/}
        {lastSub ===index ? <NewQuestion addQ={addQ} qform={item.qform}/> :null}
        </td>
        {submited ?
        <td>
        <Lesson 
        questions={questions}
        day={day}
        singleQ={questions[day][index].question}
        id={index}
        addQ={addQ} 
        editQ={editQ} 
        />
        { lastSub-1 ===index ?
        <Link to={`/admin/${lang}`}>
    <button onClick={() => { updateLesson()}}>
     Update Lesson
    </button>
    </Link> : null
        }
    </td>
        : null
        }
    </tr>)
    })}
        </tbody>
        </table>
    </div>
        </div>
    )
}

export default EachDay
