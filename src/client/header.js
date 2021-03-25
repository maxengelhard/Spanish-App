import React , {useState,useEffect} from 'react'
import ReactLogo from '../FluencyDaily.png'

const Header = () => {
    const [toggle, setToggle] = useState(false)
	const [scrollPosition, setScrollPosition] = useState(0);
	const handleScroll = () => {
    	const position = window.pageYOffset;
    	setScrollPosition(position);
	};

	useEffect(() => {
    	window.addEventListener('scroll', handleScroll, { passive: true });

    	return () => {
    	    window.removeEventListener('scroll', handleScroll);
    	};
	}, []);

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
		{scrollPosition > 800 ?
		<ul className={`${toggle ? 'nav-active': 'nav-links hide'}`} >
			<li className='access'><a href="signUp">GET STARTED</a></li>
			<li className='access'><a href="logIn">I ALREADY HAVE AN ACCOUNT</a></li>
		</ul>:null}
		</div>
        </nav>
    )
}

export default Header
