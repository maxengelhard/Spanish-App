import React, {useEffect, useState} from 'react'
import {BrowserRouter as Router, Route,Redirect, Switch } from 'react-router-dom'
import DashboardMenu from './DashboardMenu'
import {Lessons,Routes} from './Lessons'

const Dashboard = () => {
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
    },[])

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
             <h1>Hello Max your email is max with id {id}</h1>
             <DashboardMenu id={id}/>
            <Router>
            <Routes />
            <Switch>
            <Route path='/dashboard' exact component={Lessons} />
            </Switch>
            </Router>
        </div>:null}
        </div>
    )
}

export default Dashboard