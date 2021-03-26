import React, {useState,useEffect } from 'react'
import {Redirect} from 'react-router-dom'

const Profile = ({match}) => {
    const {id} = match.params
    const [username,setUserName] = useState('')
    const [email,setEmail] = useState('')
    const [redirect,setRedirect] = useState(false)

    useEffect(() => {
        if (localStorage.user_id) {
        fetch(`/userprofile/${id}`)
        .then(res => res.json())
        .then(data => {
            const {username,email,error} = data
            setRedirect(error)
            setUserName(username)
            setEmail(email)
        }) }
        return false
    },[id])

    const myRedirect = () => {
        if (redirect) {
            if (localStorage.user_id) {
            return <Redirect to='/dashboard' />
            } else {
                return <Redirect to='/login'/>
            }
        }
    }

    const logout = async () => {
        localStorage.removeItem('user_id')
        await fetch('/logout')
        setRedirect(true)
    }

    return (
        <div>
            {myRedirect()}
            <h1>Hello {username}</h1>
            <h2>Here is your {email}</h2>
        <button onClick={() => logout()}>Logout Here</button>
        </div>
    )
}

export default Profile