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

    const [loading1,setLoading1] = useState(false)
    const [loading2,setLoading2] = useState(false)

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
            
            console.log(data)
            setQuizWords(data)

        })

        await fetch(`/questionsspanish${day}`)
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a,b) => {
                return (a.id.split('-')[1] - b.id.split('-')[1])
            })
            // console.log(sorted)
            setSlides(sorted)
        })

        await fetch(`/wordsspanish${+day+1}`)
        .then(res => res.json())
        .then(data => {
            const newWords = data.map((word => {
                    return word.word
            })).filter((word,i) => (i>=((+day)*10) && i<((+day+1)*10)) ? true:false)
            const verbIds = [...new Set(data.map(word => word.vid))].filter(num => Number.isInteger(num))
            setNewWords(newWords)
        
            // to get verbs
            fetch(`/verbsspanish`)
            .then(res => res.json())
            .then(data => {
                // filter only the vids
                const usingVerbs = data.filter(obj => {
                    return verbIds.includes(obj.vid)
                })
                console.log(usingVerbs)
            })
        })

        await fetch(`/nounsspanish${day}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })

        await fetch(`/adjectivesspanish${day}`)
        .then(res => res.json())
        .then(data => {
                console.log(data)
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

    const gotQuestionRight = () => {
        fetch(`/gotquestionright`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({day,id,todayProgress})
        })
        setTodayProgress(todayProgress+1)
        window.location.reload()
    }

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
                    <ul style={{display:'flex'}}>
                    {newWords.map((word,i) => {
                        return <li key={i}>{word}</li>
                    })}
                    </ul>
                    <Slide newWords={newWords}slideObj={slides[todayProgress]} 
                    lessonObj={quizWords[todayProgress]} gotQuestionRight={gotQuestionRight}
                    />
                    </div>
            :null:null
            }
        </div>:null}
        </div>
    )
}

export default EachLesson
