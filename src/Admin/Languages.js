import React , {useState,useEffect} from 'react'

const Laguages = () => {
    const [langs,setLangs] = useState([])
    useEffect(() => {
        fetch('/languages')
        .then(res => res.json())
        .then(data => setLangs(data))
    },[])
    return (
        <div className='langPage'>
           {langs.map((lang,i) => <button className='language' key={i}>{lang}</button>)}
           <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> 
        </div>
    )
}

export default Laguages
