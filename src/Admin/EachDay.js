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
    const [uniqueWords,setUniqueWords] = useState([])
    const [verbs,setVerbs] = useState([])
    const [usedVerbs,setUsedVerbs] = useState('')

    useEffect(() => {
        // to change the sentences
        const fetchData = async () => {
        if (day >= 0) {
        // check if we've done something that day
        // if we haven't then update the qforms so we only have to do it once    
        await fetch(`/completed${lang}`)
        .then(res => res.json())
        .then(async (completed) => {
        let thisDay = false
        let usedVerbs = []
        for (let i=0; i<completed.length;i++) {
            const {dayID,verbs} = completed[i]
            if (dayID ===day) {
                if (verbs) {
                usedVerbs = verbs.split(',')
                setUsedVerbs(verbs)
                } else {
                    setUsedVerbs('')
                }
                thisDay=true
                break
            }
        }
        
        // this will allow me to higlight all the words we've already had
        await fetch(`/words${lang}${day+1}`)
        .then(res => res.json())
        .then(async (data) => {
            // slice the array from zero all the way to the new day
            let uniqueWords = []
            let uniqueVerbs = []
            const usedWords = data.map((obj,i) => {
                if (i>=(day*10) && i<=((day+1)*10)) {
                    uniqueWords.push(obj.word)
                    if (obj.vID !==null) {
                        // itereate over the usedVerbs to see if we already have it
                        const infinitive = obj.grammar.split('-')[1]
                        if (usedVerbs.indexOf(infinitive) ===-1) {
                            uniqueVerbs.push(obj)
                        } 
                    }
                }
                return obj.word
            })
            setUniqueWords(uniqueWords)
            setVerbs(uniqueVerbs)
        // this will check to see if we have a verb
        // if we do we want the last index of that and all other verbs will be pushed into to usedWords
            const verbId = data.filter(obj => obj.vID !== null)
            
            // const adjectives = data.filter(obj => obj.aID !==null)
            // const nouns = data.filter(obj => obj.nID !==null)

            // if adjectives or nouns isn't nothing then fetch the adjectives and verbs
            // if (adjectives.length >0) {
            //     console.log('adjectives here')
                
            // }

            // if (nouns.length) {
            //     console.log('nouns here')
            // }
            
           await fetch(`/verbs${lang}`)
            .then(res => res.json())
            .then(async (verbs) => {
                let verbArr = []
                // get all the data of the vId's
                // itereate over the verbs we have the index is the verb id
                verbId.forEach(obj => {
                    const id = obj.vID -1
                    // check to see if we already have the verb first
                    const arr = Object.values(verbs[id]).slice(1)
                    verbArr.push(arr)
                    // does it include it and if it does then show what form it is of the verb
                    
                })
                // to make the verbs conjugation and used words into one big array
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

    const keepVerb = (obj) => {
        // insert into day verbs
        const verb = obj.grammar.split('-')[1] +','
        const addedVerbs = usedVerbs+verb
        fetch(`/keep${lang}verb`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({verb:addedVerbs,day})
        })
        
        setVerbs([...verbs].filter(allObjs => allObjs!==obj)) // then take it out of the verbs
    }


    const outVerb = (obj) => {

        fetch(`/out${lang}verb`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({obj,day})
        })
        setVerbs([...verbs].filter(allObjs => allObjs!==obj)) // then take out the verbs
    }
    
    return (
    loading ? <div className="spin"></div> :
    <div style={{width: '100%', overflowX: 'hidden'}}> 
    <div className='words'>
        <h3>New Words</h3>
    {uniqueWords.map((word,i) => <div key={i}>{word}</div>)}
    </div>
    {verbs.length > 0 ?
    <div className='newVerbs' style={{display: 'flex'}}>
        <h3>New Verbs</h3>
        {verbs.map((obj,i) => {
            const verb = obj.grammar.split('-')[1]
         return <div key={i} style={{display: 'flex', width:'15%'}}>
             <div style={{width:'50px', margin:'auto'}}>{verb}</div>
             <button 
             onClick={() => keepVerb(obj)}
             style={{background: 'green',width:'50px'}}>
                  Keep</button>
             <button 
             onClick={() => outVerb(obj)}
             style={{background:'red',width:'50px'}}>
                 Out</button>
             </div>
         })}
    </div> : null
}
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
