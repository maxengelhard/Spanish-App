import React from 'react'
import { Link, Route } from 'react-router-dom'
import EachDay from './EachDay'

let routes = []
let adminBtns = []
for (let i=0; i<500;i++) {
    routes.push(<Route path={`/admin/day${i}`} key={i} component={EachDay} />)
    adminBtns.push(<Link to={`/admin/day${i}`} key={i}><button className='green'>{i+1}</button></Link>)

}

const AdminHome = () => {
    return (
        <div>
            {adminBtns}
        </div>
    )
}

const Routes = () => {
    return (
        <div>
            {routes}
        </div>
    )
}

export {
    AdminHome,
    Routes
}
