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

    useEffect(() => {
    fetch('/userdashboard')
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
    fetch(`/dayspanish${+day+1}`)
    .then(res => res.json())
    .then(data => {
        
        console.log(data)
        setQuizWords(data)

    })

    fetch(`/questionsspanish${day}`)
    .then(res => res.json())
    .then(data => {
        const sorted = data.sort((a,b) => {
            return (a.id.split('-')[1] - b.id.split('-')[1])
        })
        // console.log(sorted)
        setSlides(sorted)
    })

    fetch(`/wordsspanish${+day+1}`)
    .then(res => res.json())
    .then(data => {
        const newWords = data.map((word => {
                return word.word
        })).filter((word,i) => (i>=(+(day)*10) && i<((+day+1)*10)) ? true:false)
        console.log(newWords)
        const verbs = [...new Set(data.map(word => word.vid))].filter(num => Number.isInteger(num))
        setNewWords(newWords)
        console.log(verbs)
        // to get verbs
        fetch(`/verbsspanish`)
        .then(res => res.json())
        .then(data => {
            // filter only the vids
            const usingVerbs = data.filter(obj => {
                return verbs.includes(obj.vid)
            })
            console.log(usingVerbs)
        })
    })

    fetch(`/nounsspanish${day}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })

    fetch(`/adjectivesspanish${day}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })

    


        
    
    return true

    
    },[day])

    useEffect(() => {
        if (id && day>=0) {
        fetch(`/getprogress/${id}/${day}`)
        .then(res => res.json())
        .then(data => {
            const {completed} = data[0]
            completed ? setTodayProgress(completed) : setTodayProgress(0)
        })
        }
        return true
    }, [id,day])

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
            {(slides && todayProgress>=0 && quizWords[todayProgress]) ?
                <div>
                    <ul style={{display:'flex'}}>
                    {newWords.map((word,i) => {
                        return <li key={i}>{word}</li>
                    })}
                    </ul>
                    <Slide newWords={newWords}slideObj={slides[todayProgress]} 
                    lessonObj={quizWords[todayProgress]}
                    />
                    </div>
            :null}
        </div>:null}
        </div>
    )
}

export default EachLesson
