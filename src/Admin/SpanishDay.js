import React ,{useState,useEffect } from 'react'

const SpanishDay = ({...props}) => {
    const {lang,usedVerbs,setUsedVerbs,setVerbs,verbs,adjectives,setAdjectives,fields,usedAdjectives,
    setUsedAdjectives,nouns,setNouns,usedNouns,setUsedNouns} = props

    

    const keepVerb = (obj) => {
        // insert into day verbs
        const verb = obj.grammar.split('-')[1] +','
        const addedVerbs = usedVerbs+verb
        setUsedVerbs(addedVerbs)
        setVerbs([...verbs].filter(allObjs => allObjs!==obj)) // then take it out of the verbs
    }


    const outVerb = (obj) => {

        fetch(`/out${lang}verb`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({obj})
        })
        setVerbs([...verbs].filter(allObjs => allObjs!==obj)) // then take out the verbs
    }

    const completeAdj = (e) => {
        e.preventDefault()
        const adj = Object.keys(usedAdjectives)[0]
        fetch(`/update${lang}adjectives${adj}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({...usedAdjectives,completed:0})
        })

    }

    const completeNoun = (e) => {
        e.preventDefault()
        const noun = Object.keys(usedNouns)[0]
        fetch(`/update${lang}nouns${noun}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({...usedNouns,completed:0})
        })
    }

    const subAdj = (adj) => {
        const theseAdj = {...usedAdjectives[adj],completed:1}
        fetch(`/update${lang}adjectives${adj}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({[adj]:theseAdj})
        })
        const closed = [...adjectives].filter(word => word!==adj)
        setAdjectives(closed)
    }

    const subNoun = (noun) => {
        const theseNouns = {...usedNouns[noun],completed:1}
        fetch(`/update${lang}nouns${noun}`, {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify({[noun]:theseNouns})
        })
        const closed = [...nouns].filter(word => word!==noun)
        setNouns(closed)
    }
 
    return (
    <div className='SpanishDay'>
    {verbs.length > 0 ?
    <div className='newAdds' style={{display: 'flex'}}>
        <h3>New Verbs</h3>
        {verbs.map((obj,i) => {
            const verb = obj.grammar.split('-')[1]
         return <div key={i} style={{display: 'flex', width:'15%'}}>
             <div style={{width:'50px', margin:'auto'}}>{verb}</div>
             <button 
             onClick={() => keepVerb(obj)}
             style={{background: 'green',width:'50px'}}>
                  Keep</button>
             <button 
             onClick={() => outVerb(obj)}
             style={{background:'red',width:'50px'}}>
                 Out</button>
             </div>
         })}
    </div> : null}
    {adjectives.length > 0 ?
    <div className='newAdds' style={{display: 'flex'}}>
        <h3>New Adjectives</h3>
        {adjectives.map((adjective,i) => {
         return <div key={i} style={{display: 'flex'}}>
             <div style={{width:'50px', margin:'auto'}}>{adjective}</div>
             {fields[0].map((field,i) => {
                 return (
        <form style={{width:'50px'}}key={i} onSubmit={completeAdj}>
        <label>{field}</label>
        <input type="text" required onChange={(e) =>{
            let prevAdjectives = {...usedAdjectives[adjective]}
            prevAdjectives[field]= e.target.value
            setUsedAdjectives({[adjective]: prevAdjectives})
        }}/>
        </form>)
             })}
             <button 
             onClick={() => subAdj(adjective)}
             style={{background:'green',maxWidth:'90px',marginBottom:'6px'}}>
                 Complete</button>
             </div>
         })}
    </div> : null}
    {nouns.length > 0 ?
    <div className='newAdds' style={{display: 'flex'}}>
        <h3>New Nouns</h3>
        {nouns.map((noun,i) => {
         return <div key={i} style={{display: 'flex'}}>
             <div style={{width:'50px', margin:'auto'}}>{noun}</div>
             {fields[1].map((field,j) => {
                 return (
        <form key={j} style={{width:'50px'}}onSubmit={completeNoun}>
        <label>{field}</label>
        <input type="text" required onChange={(e) => {
            let prevNouns = {...usedNouns[noun]}
            prevNouns[field]= e.target.value
            setUsedNouns({[noun]: prevNouns})
        } 
        }/>
        </form>)
             })}
             <button
             onClick={() => subNoun(noun)}
             style={{background:'green',maxWidth:'90px',marginBottom:'6px'}}>
                Complete
              </button>
             </div>
         })}
    </div> : null}
    </div>
    )
   }

export default SpanishDay