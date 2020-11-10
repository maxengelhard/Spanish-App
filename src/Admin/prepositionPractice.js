import React from 'react'

const prepositionPractice = ({prep}) => {
    const practices = {
    'a': <li key='a'>We're going <b>a</b> Spain</li>,
    'al': <li key='al'>He walks <b>al</b> bookstore</li>,
    'de': <li key='de'>He ran <b>de</b> that house</li>,
    'del': <li key='del'>She flew <b>del</b> country</li>,
    'por': <li key='por'>I was worried <b>por</b> my mother</li>,
    'en': <li key='en'>She's going to eat <b>en</b> the park</li>,
    'ante': <li key='ante'>We went <b>ante</b> the show began</li>,
    'bajo': <li key='bajo'>He lives <b>bajo</b> the steps</li>,
    'con': <li key='con'>You are <b>con</b> your cat</li>,
    'contra': <li key='contra'>Real Madrid plays <b>contra</b> Juventus</li>,
    'desde': <li key='desde'>You've been watching TV <b>desde</b> yesterday</li>,
    'detrás': <li key='detras'>He ran <b>detrás</b> the dog</li>,
    'hacia': <li key='hacia'>We walked <b>hacia</b> the soccer field</li>,
    'hasta': <li key='hasta'>I'll wait <b>hasta</b> the bunny arrives</li>,
    'para': <li key='para'>They listened <b>para</b> the timer</li>,
    'según': <li key='segun'>He spoke <b>según</b> his professor</li>,
    'sin': <li key='sin'>They left <b>sin</b> the dog</li>,
    'sobre': <li key='sobre'>We flew <b>sobre</b> New York</li>,
    'tras': <li key='tras'>The house is <b>tras</b> the stadium</li>
    }
    return (
        <div>
            <h3>Assignment: Prepositional Practice</h3>
           <p>Practice this basic sentnece strucutre: Person, action, <b>preposition</b> noun.</p>
           <p>Here are some examples:</p>
           {prep.map(word => {
               return practices[word]
           })}
           <p>Use each of your {prep.length} prepositions at least two times</p>
           {prep.map(word => {
               return <div key={word}><div className='line'></div><div className='line'></div><div className='line'></div></div>
           })}
        </div>
    )
}

export default prepositionPractice
