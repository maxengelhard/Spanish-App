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
    }, [])

    return (
        <div className='adminPage'> {
            !completed ? <div className ='spin'></div> :
            completed.map((complete,i) => {
                const green = complete ? 'active' : null
                return <Link to={`/admin/${lang}/day${i}`} key={i}>
                    <button className={`adminBtn ${green}`}>Day {i}</button>
                    </Link>
            })
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
