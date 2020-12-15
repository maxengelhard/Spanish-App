import React from 'react'
import { Link } from 'react-router-dom'

const AdminHome = () => {
    let adminBtns = []
    for (let i=0; i<500;i++) {
        // const green = finished[i] ? 'green': null
        adminBtns.push(<Link to={`/admin/day${i}`} key={i}><button className='green'>{i+1}</button></Link>)
        }

    return (
        <div>
            {adminBtns}
        </div>
    )
}

export default AdminHome
