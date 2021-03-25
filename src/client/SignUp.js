import React,{useState} from 'react'
import {Redirect} from 'react-router-dom'

const Signup = () => {
    const [username,setUserName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [password2,setPassword2] = useState('')
    const [name,setName] = useState('')
    const [alert,setAlert] = useState(false)
    const [redirect,setRedirect] = useState(false)

    const register = () => {

        // first check if username /email/password is greater than
        if (username==='') {
            setAlert('Please Fill Out User Name')
            return false
        }
        if (username.includes('@')) {
            setAlert("Username Cannot Include @")
            return false
        }
        if (email==='' || !email.includes('@') || !email.includes('.') || email[email.length-1]==='.') {
            setAlert('Please Fill Out Valid Email')
            return false
        }
    fetch('/register', {
            headers: {
                'Content-type': 'application/json'
            },
           method: 'POST',
           body: JSON.stringify({username,email,password,password2,name})
        })
        .then(res => res.json())
        .then(data => {
           typeof data==='object' ? setAlert(data[0].message) : setRedirect(true)
        })

    }

    const myAlert = (message) => {
        window.alert(message)
        setAlert(false)
    }

    const myRedirect = () => {
        if (redirect) {
            return <Redirect to='/login' />
        } else if (localStorage.user_id) {
            return <Redirect to={{pathname:`/dashboard`, state: {id: redirect}}} />
        }
    }

    return (
        <div>
            {myRedirect()}
            {alert ? myAlert(alert): null}
           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" integrity="sha512-EZLkOqwILORob+p0BXZc+Vm3RgJBOe1Iq/0fiI7r/wJgzOFZMlsqTa29UEl6v6U6gsV4uIpsNZoV32YZqrCRCQ==" crossOrigin="anonymous" />
        <h1>Sign UP HERE!</h1>
            <input type='text' id='username' name='username' placeholder='username' required onChange={(e) => setUserName(e.target.value)}/>
            <input type='email' id='email' name='email' placeholder='email' required onChange={(e) => setEmail(e.target.value)}></input>
            <input type='password' id='password' name='password' placeholder='password' required onChange={(e) => setPassword(e.target.value)}></input>
            <input type='password' id='password2' name='password2' placeholder='confirm password' required onChange={(e) => setPassword2(e.target.value)}></input>
            <input type='name' id='name' name='name' placeholder='name' onChange={(e) => setName(e.target.value)}></input>
            <input type='submit' value="Register" onClick={() => register()}></input>
        <a href='/login'>Already Have An Account</a>
        </div>
    )
}


export default Signup