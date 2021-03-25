import React , {useState} from 'react'
import {Redirect,Link} from 'react-router-dom'


const Login = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [alert,setAltert] = useState(false)
    const [redirect,setRedirect] = useState(false)
  
    const checkLogin = async (e) => {
        e.preventDefault();
        fetch('/userlogin', {
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Origin': ''
            },
           method: 'POST',
           body: JSON.stringify({username,password})
        })
        .then(response => response.json())
        .then(data => {
            if (typeof data ==='string') {
                setAltert(data)
            }else {
                setRedirect(data)
            }
        })
    }

    const myAlert = (message) => {
        window.alert(message)
        setAltert(false)
    }
    const renderRedirect = () => {
        const render = <Redirect to={{pathname:`/dashboard`, state: {id: redirect}}} />
        if (redirect) {
            localStorage.user_id = redirect.id
        return render 
        } else if (localStorage.user_id) {
            return render
        }
    }

    return (
        <div>
            {renderRedirect()}
            {alert ? myAlert(alert): null}
           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css" integrity="sha512-EZLkOqwILORob+p0BXZc+Vm3RgJBOe1Iq/0fiI7r/wJgzOFZMlsqTa29UEl6v6U6gsV4uIpsNZoV32YZqrCRCQ==" crossOrigin="anonymous" />
       <Link to='/'>Go Home</Link>
        <h1>Login HERE!</h1>
        <form onSubmit={checkLogin}>
            <input type='text' id='username' name='username' placeholder='username/email' required onChange={(e) => setUsername(e.target.value)}>
            </input>
            <input type='password' id='password' name='password' placeholder='password' required onChange={(e) => setPassword(e.target.value)}></input>
            <input type='submit' value="Login"></input>
            </form>
        <a href='/signup'>Not A Memebr Yet? Register Here</a>
        </div>
    )
}


export default Login
