import React, {useState,useEffect } from 'react'
import {Redirect} from 'react-router-dom'
import DashboardMenu from './DashboardMenu'

const EachLesson = ({match}) => {
    const urlLength = '/dashboard/es/'.length
    const day = match.url.slice(urlLength)
    // this was work around to rendering two navs
    const [menu,setMenu] = useState(false)
    const [id,setId] = useState('')
    const [redirect,setRedirect] = useState(false)
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
    fetch(`/dayspanish${day+1}`)
    .then(res => res.json())
    .then(data => console.log(data))

    fetch(`/questionsspanish${day}`)
    .then(res => res.json())
    .then(data => console.log(data))
        
    
    return true

    
    },[day])

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
            SUP!
        </div>:null}
        </div>
    )
}

export default EachLesson
