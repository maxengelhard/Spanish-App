import React from 'react'
import ReactLogo from '../logo.png'


const Header = () => {
    return (
        <header>
            <img src={ReactLogo} alt='logo'/>
            <h2>Blog</h2>
            <h2>Sign Up</h2>
            <h2>Log In</h2>
        </header>
    )
}

export default Header
