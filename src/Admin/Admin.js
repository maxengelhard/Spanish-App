import React from 'react'
import {BrowserRouter as Router, Route } from 'react-router-dom'
import {AdminHome,Routes} from './AdminHome'
// import LanguageWords from '../Components/SetWords'


const AdminJS = () => {
    // to make all the admins
    return (
    
    <div style={{display:'block', height: '100%'}}>
        <h1>Admin</h1>
    {
    <Router>
    <div className='dayButtons'>
    <Route path='/admin' exact component={AdminHome}/>
    <Routes />
    </div>
    </Router>
    }
    </div>
    )
}

export default AdminJS