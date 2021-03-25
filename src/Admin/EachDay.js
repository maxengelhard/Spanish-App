import React, {useState, useEffect } from 'react'
import NewQuestion from './NewQuestionForm'
import Lesson from './Lesson'
import {Link} from 'react-router-dom'
import higlight from './highlight'
import underScore from './underscore'
import translateThis from './translateThis'
import solution from './solution'
import underQForm from './under_q_form'
// import SpanishDay from './SpanishDay'

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
    const [adjectives,setAdjectives] = useState([])
    const [nouns,setNouns] = useState([])
    const [fields,setFields] = useState([])
    const [usedAdjectives, setUsedAdjectives] = useState([])
    const [usedNouns,setUsedNouns] = useState([])

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
            const {dayid,verbs} = completed[i]
            if (verbs) {
                const arr = verbs.split(',').filter(word => word.length>0)
                usedVerbs.push(arr)
            }
            if (dayid ===day) {
                if (verbs) {
                setUsedVerbs(verbs)
                } else {
                    setUsedVerbs('')
                }
                thisDay=true
                break
            }
        }
        const justVerbs = [...new Set([].concat.apply([],usedVerbs))]
        
        // this will allow me to higlight all the words we've already had
        await fetch(`/words${lang}${day+1}`)
        .then(res => res.json())
        .then(async (data) => {
            // slice the array from zero all the way to the new day
            let uniqueWords = []
            let uniqueVerbs = []
            let dayAdjectives = []
            let dayNouns = []
            const usedWords = data.map((obj,i) => {
                if (i>=(day*10) && i<=((day+1)*10)) {
                    uniqueWords.push(obj.word)
                    if (obj.vid !==null) {
                        // itereate over the usedVerbs to see if we already have it
                        const infinitive = obj.grammar.split('-')[1]
                        if (justVerbs.indexOf(infinitive) ===-1) {
                            uniqueVerbs.push(obj)
                        } 
                    }
                if (obj.grammar==='adjective' || obj.grammar.includes('hasAdj')) {
                    dayAdjectives.push(obj.word)
                }
                if (obj.grammar.includes('noun')) {
                    dayNouns.push(obj.word)
                }
                }
                return obj.word
            })
            setUniqueWords(uniqueWords)
            setVerbs(uniqueVerbs)
            

            let fieldArr = []
            let usedAdjectives = []
            let cleanAdjs = []
            await fetch(`/adjectives${lang}${day}`)
            .then(res => res.json())
            .then(async (adjectives) => {
                if (adjectives.length >0) {
                const fields = Object.keys(adjectives[0]).filter(fields => (fields !=='aid' && fields!=='word' && fields!=='word_id' && fields!=='completed'))
                fieldArr.push(fields)
                const values = adjectives.map(obj => {
                     // to get rid of the adjectives we have already compelted
                     if (obj.completed===1) {
                         const index = dayAdjectives.indexOf(obj.word)
                         if (index >=0) {
                        dayAdjectives.splice(index,1)
                         }
                    }
                    
                    return Object.values(obj).filter(words => isNaN(words)) // only the words
                })
                values.forEach(arr => {
                    usedAdjectives[arr[0]]=fields.reduce((obj,val) => {
                        return {...obj, [val]: ''}
                    },{}) 
                })
                cleanAdjs = [].concat.apply([],values)
                } else {
                    fieldArr.push([])
                }
                
            })

            let usedNouns = {}
            let cleanNouns = []
            await fetch(`/nouns${lang}${day}`)
            .then(res => res.json())
            .then(async (nouns) => {
                if (nouns.length >0) {
                const fields = Object.keys(nouns[0]).filter(fields => (fields !=='nid' && fields!=='word' && fields!=='word_id' && fields!=='completed'))
                fieldArr.push(fields)
                const values = nouns.map(obj => {
                    // this takes out the completed nouns
                    if (obj.completed===1) {
                         const index = dayNouns.indexOf(obj.word)
                         if (index >=0) {
                        dayNouns.splice(index,1)
                         }
                    }
                    return Object.values(obj).filter(words => isNaN(words)) // only the words
                })
                values.forEach(arr => {
                    usedNouns[arr[0]]=fields.reduce((obj,val) => {
                        return {...obj, [val]: ''}
                    },{}) 
                })
                cleanNouns = [].concat.apply([],values)
                } else {
                fieldArr.push([])
                }
            })
           

        // this will check to see if we have a verb
        // if we do we want the last index of that and all other verbs will be pushed into to usedWords
            const verbId = data.filter(obj => obj.vid !== null)
           await fetch(`/verbs${lang}`)
            .then(res => res.json())
            .then(async (verbs) => {
                let verbArr = []
                // get all the data of the vId's
                // itereate over the verbs we have the index is the verb id
                verbId.forEach(obj => {
                    const id = obj.vid -1
                    // check to see if we already have the verb first
                    const arr = Object.values(verbs[id]).slice(1).map(word => {
                        // itereate over that array and see if it has a comma if it does split it
                        const string = word ? word : ''
                        if (string.includes(',')) {
                            return string.split(',')
                     } else if (string.slice(string.length-3)==='ido') {
                         // this is for examples such as habidos
                         return [string,string+'s']
                     }
                     else return string                   
                    })
                    verbArr.push([].concat.apply([],arr)) // to make it one array
                    // does it include it and if it does then show what form it is of the verb
                    
                })
                // to make the verbs conjugation and used words into one big array
                const cleanVerbs = [].concat.apply([], verbArr)
                const ultimate = [...new Set(usedWords.concat(cleanVerbs).concat(cleanAdjs).concat(cleanNouns))]
                setLearnedWords(ultimate)

                // see if we already have a day noun or adjective already in
                // take out the unqieWords from the ultimate and see if there are still in the ultimate
                setNouns(dayNouns)
                setAdjectives(dayAdjectives)
                setFields(fieldArr)
                setUsedAdjectives(usedAdjectives)
                setUsedNouns(usedNouns)
            

               await fetch(`/day${lang}${day+1}`)
                .then(res => res.json())
                .then(async (sentences) => {
                    // sort by id
                    const sorted = sentences.sort((a,b) => a.id - b.id)
                setSentences(sorted)

        
                // if this day is not true then we need to set the qform to something
                if (!thisDay && lang !=='spanish') {
                const qform = await Promise.all(sentences.map(async (obj) => [obj.id,await translateThis(underScore(obj[`${lang}s`],ultimate))]))
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
                const index = obj.id.split('-')[1].trim()
                final[index] = {...obj}
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
        // check to see if we have any upperCase on the ends
        // to check if we are editing
        const index = edited.reduce((value, obj,index) => {
            if (obj.active ===true) {
                value = index
            }
            return value;
        },false)
        

        if (Number.isInteger(index)) {
        const highlitedText = higlight(sentences[index].spanishs,learnedWords)
        const withUpper = solution(highlitedText[1],newQuestion)
            edited[index] = {
            id: `${day}-${index}`,
            question: `${newQuestion}`,
            upper: withUpper,
            active:false
        }
        }
        else {
        const highlitedText = higlight(sentences[questions[day].length].spanishs,learnedWords)
        const withUpper = solution(highlitedText[1],newQuestion)
            edited.push({
                id: `${day}-${questions[day].length}`,
                question: `${newQuestion}`,
                upper: withUpper,
                active:false
            })
            
        }
        newArr[day] = edited
        setQuestions(newArr)
    }


    const editQ = index => (e) => {
        let newArr = [...questions]
        let edited = [...questions[day]]
        edited[index] = {...questions[day][index], active:!newArr[day][index].active}
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
           body: JSON.stringify({day, lesson: questions[day], solution: sentences, usedVerbs})
        })
    }

    const keepVerb = (obj) => {
        // insert into day verbs
        const verb = obj.grammar.split('-')[1] +','
        const addedVerbs = usedVerbs+verb
        setUsedVerbs(addedVerbs)
        setVerbs([...verbs].filter(allObjs => allObjs!==obj)) // then take it out of the verbs
    }


    const outVerb = (obj) => {

        fetch(`/out${lang}verb`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({obj})
        })
        setVerbs([...verbs].filter(allObjs => allObjs!==obj)) // then take out the verbs
    }

    const completeAdj = (e) => {
        e.preventDefault()
        const adj = Object.keys(usedAdjectives)[0]
        fetch(`/update${lang}adjectives${adj}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({...usedAdjectives,completed:0})
        })

    }

    const completeNoun = (e) => {
        e.preventDefault()
        const noun = Object.keys(usedNouns)[0]
        fetch(`/update${lang}nouns${noun}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({...usedNouns,completed:0})
        })
    }

    const subAdj = (adj) => {
        const theseAdj = {...usedAdjectives[adj],completed:1}
        fetch(`/update${lang}adjectives${adj}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({[adj]:theseAdj})
        })
        const closed = [...adjectives].filter(word => word!==adj)
        setAdjectives(closed)
    }

    const subNoun = (noun) => {
        const theseNouns = {...usedNouns[noun],completed:1}
        fetch(`/update${lang}nouns${noun}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({[noun]:theseNouns})
        })
        const closed = [...nouns].filter(word => word!==noun)
        setNouns(closed)
    }

    
    return (
    loading ? <div className="spin"></div> :
    <div style={{width: '100%', overflowX: 'hidden',paddingBottom:'60px',paddingRight:'5px'}}> 
    <div className='words'>
        <h3>New Words</h3>
    {uniqueWords.map((word,i) => <div key={i}>{word}</div>)}
    </div>
   {verbs.length > 0 ?
    <div className='newAdds' style={{display: 'flex'}}>
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
    </div> : null}
    {adjectives.length > 0 ?
    <div className='newAdds' style={{display: 'flex'}}>
        <h3>New Adjectives</h3>
        {adjectives.map((adjective,i) => {
         return <div key={i} style={{display: 'flex'}}>
             <div style={{width:'50px', margin:'auto'}}>{adjective}</div>
             {fields[0].map((field,i) => {
                 return (
        <form style={{width:'50px'}}key={i} onSubmit={completeAdj}>
        <label>{field}</label>
        <input type="text" required onChange={(e) =>{
            let prevAdjectives = {...usedAdjectives[adjective]}
            prevAdjectives[field]= e.target.value
            setUsedAdjectives({[adjective]: prevAdjectives})
        }}/>
        </form>)
             })}
             <button 
             onClick={() => subAdj(adjective)}
             style={{background:'green',maxWidth:'90px',marginBottom:'6px'}}>
                 Complete</button>
             </div>
         })}
    </div> : null}
    {nouns.length > 0 ?
    <div className='newAdds' style={{display: 'flex'}}>
        <h3>New Nouns</h3>
        {nouns.map((noun,i) => {
         return <div key={i} style={{display: 'flex'}}>
             <div style={{width:'50px', margin:'auto'}}>{noun}</div>
             {fields[1].map((field,j) => {
                 return (
        <form key={j} style={{width:'50px'}}onSubmit={completeNoun}>
        <label>{field}</label>
        <input type="text" required onChange={(e) => {
            let prevNouns = {...usedNouns[noun]}
            prevNouns[field]= e.target.value
            setUsedNouns({[noun]: prevNouns})
        } 
        }/>
        </form>)
             })}
             <button
             onClick={() => subNoun(noun)}
             style={{background:'green',maxWidth:'90px',marginBottom:'6px'}}>
                Complete
              </button>
             </div>
         })}
    </div> : null}
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
        const highlitedText = higlight(item[`${lang}s`],learnedWords)
    return (<tr className={`sentence-${day}-${index}`} key={item.id}>
        <td className={submited}>
        <p><b>{item.id}: {item.word}</b></p>
        <p>{item.way}</p>
        <p>{item.englishs}</p>
        </td>
        <td className={submited}>
        {highlitedText[0]}
        {lastSub ===index ? <NewQuestion addQ={addQ} qform={underQForm(highlitedText[0])}/> :null}
        {' ' + item.qform}
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
        <div style={{background: 'yellow'}}>
        {questions[day][index].upper}
        </div>
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
