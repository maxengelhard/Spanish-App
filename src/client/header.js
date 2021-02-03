import React , {useState} from 'react'
import ReactLogo from '../FluencyDaily.png'
// import Logo from './getFiles'

const Header = () => {
    
    const [toggle, setToggle] = useState(false)
    

    return (
        <nav>
		<img alt='logo' className='logo' src={ReactLogo}/>
        <div className='menu'>
        {/*to make a burger */}
		<div className={`burger ${toggle ? 'toggle': 'untoggle'}`} onClick={() => setToggle(!toggle)}>
			<div className="line1"></div>
			<div className="line2"></div>
			<div className="line3"></div>
		</div>
		<ul className={`${toggle ? 'nav-active': 'nav-links hide'}`} >
			<li><a href="blog">Blog</a></li>
			<li><a href="signUp">Sign Up</a></li>
			<li><a href="logIn">Log In</a></li>
		</ul>
		</div>
        </nav>
    )
}

export default Header
