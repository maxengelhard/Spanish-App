import React from 'react'
import {Link} from 'react-router-dom'

const DashboardMenu = (props) => {
    const id = props.id
    return (
        <div className='dashButton'>
           <Link to='/dashboard'><button>Dashboard</button></Link>
           <button>Shop</button>
           <button>Language</button>
           <button>Skills</button>
           <button>Streak</button>
           <button>Currency</button>
           <a href={`/profile/${id}`}>Profile</a>
        </div>
    )
}

export default DashboardMenu
