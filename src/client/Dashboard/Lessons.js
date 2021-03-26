import React from 'react'
import {Route,Link} from 'react-router-dom'
import EachLesson from './EachLesson'

const Lessons = () => {
    const days = new Array(500).fill('')
    return (
        <div>
           {days.map((string,i) => {
               return  <Link key={i} to={`/dashboard/es/${i}`}>Day {i+1}</Link>
           })}
        </div>
    )
}

const Routes = () => {
    return new Array(500).fill('').map((route,i) => {
       return <Route key={i} path={`/dashboard/es/${i}`} component={EachLesson}></Route>
        
    })
}

export {
    Lessons,
    Routes
}
