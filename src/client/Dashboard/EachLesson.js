import React, {useState,useEffect } from 'react'
import {Redirect} from 'react-router-dom'
import DashboardMenu from './DashboardMenu'
import Slide from './Slide'

const EachLesson = ({match}) => {
    const urlLength = '/dashboard/es/'.length
    const day = match.url.slice(urlLength)
    // this was work around to rendering two navs
    const [menu,setMenu] = useState(false)
    // to make sure we're still with this person
    const [id,setId] = useState('')
    const [redirect,setRedirect] = useState(false)

    const [newWords,setNewWords] = useState(false)
    const [quizWords,setQuizWords]= useState(false)
    const [slides,setSlides] = useState(false)

    const [todayProgress,setTodayProgress] = useState(false)

    const [adjs,setAdjs] = useState(false)
    const [nouns,setNouns] = useState(false)
    const [verbs,setVerbs] = useState(false)
    const [dropDown,setDropDown] = useState([])

    const [loading1,setLoading1] = useState(false)
    const [loading2,setLoading2] = useState(false)

    // const [fullCorrection,setFullCorrection] = useState(false)
    const [correctStart,setCorrectStart] = useState(false)

    useEffect(() => {
    const fetchData = async () => {
        await fetch('/userdashboard')
        .then(res => res.json())
        .then(data => {
            const {error} = data
            setRedirect(error)
            setId(data)
            return false
        })
        // work around
        const buttons = document.getElementsByClassName('dashButton')
            if (buttons.length ===1) {
                setMenu(false)
            } else {
                setMenu(true)
            }
        await fetch(`/dayspanish${+day+1}`)
        .then(res => res.json())
        .then(data => {
            setQuizWords(data)

        })

        await fetch(`/questionsspanish${day}`)
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a,b) => {
                return (a.id.split('-')[1] - b.id.split('-')[1])
            })
            setSlides(sorted)
        })

        await fetch(`/wordsspanish${+day+1}`)
        .then(res => res.json())
        .then(data => {
            const newWords = data.map((word => {
                    return word
            })).filter((word,i) => (i>=((+day)*10) && i<((+day+1)*10)) ? true:false)
            const verbIds = [...new Set(data.map(word => word.vid))].filter(num => Number.isInteger(num))
            setNewWords(newWords)
            setDropDown(new Array(10).fill(false))
        
            // to get verbs
            fetch(`/verbsspanish`)
            .then(res => res.json())
            .then(data => {
                // filter only the vids
                const usingVerbs = data.filter(obj => {
                    return verbIds.includes(obj.vid)
                })
                setVerbs(usingVerbs)
            })
        })

        await fetch(`/nounsspanish${day}`)
        .then(res => res.json())
        .then(data => {
            setNouns(data)
        })

        await fetch(`/adjectivesspanish${day}`)
        .then(res => res.json())
        .then(data => {
                setAdjs(data)
            })
        setLoading1(true)
    }

    fetchData()
    
    return true

    
    },[day])

    useEffect(() => {
        const fetchData = async () => {
        if (id && day>=0) {
        fetch(`/getprogress/${id}/${day}`)
        .then(res => res.json())
        .then(data => {
            const {completed} = data[0]
            completed ? setTodayProgress(completed) : setTodayProgress(0)
        })
        }
        setLoading2(true)
    }
    fetchData()
        return true
    }, [id,day])

    const dropDownCall = (i) => {
        let prevState = [...dropDown]
        prevState[i] = !prevState[i]
        setDropDown(prevState)
    }

    const gotQuestionRight = React.useCallback((original_words) => {
       
          const correctUI = async () => {
            setCorrectStart(true)
        }

        // if (original_words) {
        //     console.log(quizWords[todayProgress])
        //     console.log(slides[todayProgress])
        // }
        
        fetch(`/gotquestionright`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({day,id,todayProgress})
        })
        setTodayProgress(todayProgress+1)
        
        correctUI()
        
    },[day,id,todayProgress])

    const renderRedirect = () => {
        if (redirect) {
        return <Redirect to="/login" />
        } 
    }
    return (
        <div>
        {renderRedirect()}
        {id ?
        <div className='dashboardMenu'>
            {menu ? <DashboardMenu id={id}/>:null}
            {(loading1 && loading2) ?
            (slides && todayProgress>=0 && quizWords[todayProgress] && newWords.length===10) ?
                <div>
                    <input className='progress' type='range' min={0} max={100} value={(todayProgress/quizWords.length)*100} readOnly/>
                    <ul className='todaysWords' style={{display:'flex'}}>
                    {newWords.map((word,i) => {
                        let adjsList,nounsList,verbsList,callOut
            
                        if (word.aid!==null) {
                            callOut=true
                            adjsList = [...new Set(Object.values(adjs.filter(obj => obj.aid===word.aid)[0]).filter(value => typeof(value) === 'string'))]
                        }
                        if (word.nid!==null) {
                            callOut=true
                            nounsList = [...new Set(Object.values(nouns.filter(obj => obj.nid===word.nid)[0]).filter(value => typeof(value) === 'string'))]
                        }

                        if (word.vid!==null) {
                            callOut=true
                            verbsList = [...new Set(Object.values(verbs.filter(obj => obj.vid=== word.vid)[0]).filter(value => typeof(value) === 'string'))]
                        }

                        return <li className={`${callOut ? 'addedWords' : 'singleWords'}`} key={i} onClick={() => dropDownCall(i)}>
                            <p>{word.word}</p>
                            {(adjsList && dropDown[i]) ? adjsList.map((value,j) => <div key={j}>{value}</div>): null}
                            {(nounsList && dropDown[i]) ? nounsList.map((value,j) => <div key={j}>{value}</div>): null}
                            {(verbsList && dropDown[i]) ? verbsList.map((value,j) => <div key={j}>{value}</div>): null}
                        </li>
                    })}
                    </ul>
                    {!correctStart ?
                    <Slide newWords={newWords.map(obj => obj.word)} slideObj={slides[todayProgress]} 
                    lessonObj={quizWords[todayProgress]} gotQuestionRight={gotQuestionRight}
                    />:
                    <div className='correct'>
                        <h1>Correct!</h1>
                        <p>Full Spanish: {quizWords[todayProgress-1].spanishs}</p>
                        <button onClick={() => window.location.reload()}>Next</button>
                        </div>}
                    </div>
            :null:null
            }
        </div>:null}
        </div>
    )
}

export default EachLesson
