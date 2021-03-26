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
             <Router>
             <DashboardMenu id={id}/>
             <Switch>
            <Route path='/dashboard' exact component={Lessons} />
            <Routes />
            </Switch>
        </Router>:null}
        </div>
    )
}

export default Dashboard