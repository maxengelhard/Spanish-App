import React, {useState,useEffect} from 'react'

// this was to input all the languages words into SQL

const LanguageWords = () => {
    const [languages,setLanguages] = useState([])
    useEffect(() => {
        fetch('/languagewords')
        .then(res => res.json())
        .then(data => setLanguages(data))
    },[])

    const sendWords = (lang) => {
        fetch(`/words${lang}`)
        .then(res => res.json())
        .then(data => console.log(data))
    }

    return (
        <div>
           {languages.map((lang,i) => {
               return <button key={i} onClick={() => sendWords(lang)}>{lang}</button>
           })} 
        </div>
    )
}

export default LanguageWords
