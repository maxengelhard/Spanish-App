import React , {useState, useEffect } from 'react'
import { Link, Route } from 'react-router-dom'
import EachDay from './EachDay'

let routes = new Array(500).fill([])

const AdminHome = ({match}) => {
    const lang = match.url.slice(7)
    const [completed,setCompleted] = useState(false)
    useEffect(() => {
        fetch(`/completed${lang}`)
        .then(res => res.json())
        .then(data => {
            let empty = new Array(500).fill(false)
            data.forEach(obj => empty[obj.dayID] = true)
            setCompleted(empty)
        })
    }, [lang])

    return (
        <div className='adminPage'> {
            !completed ? <div className ='spin'></div> :
            <div>
            
        <h1>Admin {lang.toUpperCase()}</h1>
            <Link to={`/admin`}>
            <button>Back To Languages</button>
            </Link>
            {completed.map((complete,i) => {
                const green = complete ? 'active' : null
                return <Link to={`/admin/${lang}/day${i}`} key={i}>
                    <button className={`adminBtn ${green}`}>Day {i}</button>
                    </Link>
            })}
            </div>
        }
            
        </div>
    )
}

const Routes = ({lang}) => {
    return (
        <div>
            {routes.map((route, i) => {
                return <Route path={`/admin/${lang}/day${i}`} key={i} component={EachDay} />
            })}
        </div>
    )
}

export {
    AdminHome,
    Routes
}
