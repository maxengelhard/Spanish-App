import React from 'react'
import {Route,Link} from 'react-router-dom'
import EachLesson from './EachLesson'

const Lessons = () => {
    const days = new Array(500).fill('')
    return (
        <div className='dashboard-table'>
           {days.map((string,i) => {
               return  <div key={i} className='dashboardLessons'><Link to={`/dashboard/es/${i}`}>Day {i+1}</Link></div>
           })}
        </div>
    )
}

const Routes = (id) => {
    return new Array(500).fill('').map((route,i) => {
       return <Route key={i} path={`/dashboard/es/${i}`} component={EachLesson}></Route>
        
    })
}

export {
    Lessons,
    Routes
}
