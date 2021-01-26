import React from 'react'
import {BrowserRouter as Router, Route } from 'react-router-dom'
import {AdminHome,Routes} from './AdminHome'
import Languages from './Languages'



const AdminJS = ({match}) => {
    // to make all the admins
    const lang = match.url.slice(7)
   
    return (
    
    <div style={{display:'block', height: '100%'}}>
    {
    <Router>
    <div className='dayButtons'>
    <Route path={`/admin/${lang}`} exact component={AdminHome}/>
    <Route path={'/admin'} exact component={Languages}/>
    <Routes lang={lang}/>
    </div>
    </Router>
    }
    </div>
    )
}

export default AdminJS