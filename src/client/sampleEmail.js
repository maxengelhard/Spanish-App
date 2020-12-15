import React , {useState, useEffect } from 'react'

const SampleEmail = () => {

    const progressDay = [0,7,30]
    const [day,setday] = useState(progressDay[0])
    const [newWords, setNewWords] = useState([])
    const [assignment, setassignment] = useState('')
    const [solution,setSolution] = useState('')
    // const [pro, setPro] = useState(false)

    useEffect(() => {
        fetch('/words')
        .then(res => res.json())
        .then(data => {
            const usedWords = data.slice((day*10),(day+1)*10).map(obj => obj.word)
            setNewWords(usedWords)
        })

        fetch('/lesson')
        .then(res => res.json())
        .then(data => {
            setassignment(data[0].lesson)
            setSolution(data[0].solution)
        })
    }, [day])


    // const idioms = <ul>
    //         <li><b>el que</b></li>
    //         <li><b>la que</b></li>
    //         <li><b>la de</b></li>
    //         <li lang='es'><b>{ES['?']}Por qu{ES['e']}?</b></li>
    //         </ul>

    return (
        <div className='sampleEmail'>
            <h1>Sample Email</h1>
            <div className='sampleButtons'>
            <button className={day===0? 'active': ''} onClick={() => setday(0)}>Day 1</button>
            <button className={day===7? 'active': ''} onClick={() => setday(7)}>After Week 1</button>
            <button className={day===30? 'active': ''} onClick={() => setday(30)}>After One Month</button>
            </div>
            New Words:
            <ol>
                {newWords.map((word,i) => {

                    return <li key={i}>{word}</li>
                })}
            </ol>
            <h1>Assignment: Fill In The Blanks</h1>
            <ul>
            {assignment.split('<p>').map((question,i) => {
                const match = question.match('\\?.|!.')
                return <li key={i}>{match ? question.replaceAll(match[0],match[0][0]) : question}</li>
            })}
            </ul>

            <h1>Solutions: <b>Pro Version</b></h1>
            <ul>
            {solution.split('<p>').map((question,i) => {
                const match = question.match('\\?(?=\\S)|\\!(?=\\S)')
                if (question.includes('<h4>')) {
                    return <li key={i}><h4>{question.substring(5,question.length-5)}</h4></li>
                }
                return <li key={i}>{match ? question.replaceAll('.','. ').replaceAll(match[0], `${match[0]} `): question.replaceAll('.','. ')}</li>
            })}
            </ul>
        </div>
    )
}

// const sampleAssn = 
//                 <ul>
//                 {/* {de} */}
//                 <li>Your view is different from mine. Your view is different __ mine</li>
//                 <li>Are you sure Tom isn't from Boston? Are you sure Tom isn't __ Boston?</li>
//                 <li>This sweater is made of whool. This sweater is made __ whool</li>
//                 <li>Isn't that Emily's car? Isn't that the car __ Emily?</li>
//                 <li>That was Perdo's house. That was the house __ Pedro</li>
//                 <li>I'm going to go to Sam's house. I am going to go to the house __ Sam</li>
//                 {/* {la} */}
//                 <li>The girl was in the kitchen. __ girl was in the kitchen</li>
//                 <li>The milk (feminine) was spoiled. __ milk was spolied</li>
//                 <li>Can you bring her next time? __ can you bring next time?</li>
//                 <li>I don't know her. I don't __ know.</li>
//                 <li>It was the first time. It was __ first time</li>
//                 {/* {la de} */}
//                 <li>Peter's thing is better. __ __ Peter's is better</li>
//                 {/* {por que} */}
//                 <li>Why did she leave? {ES['?']}__ did she leave?</li>
//                 {/* {que} */}
//                 <li>How strange! {ES['!']}__ strange!</li>
//                 <li>Understand that some people are mean. Understand __ some people are mean</li>
//                 <li>It's easier to dance than sing. It's easier to dance __ sing</li>
//                 <li>My brother is taller than me. My brother is taller __ me</li>
//                 <li>I like lettuce more than spinach. I like lettuce more __ spinach</li>
//                 <li>The man who fixed our car is here. __ man __ fixed our car is here</li>
//                 <li>The book (masculine) which bored me the most is right here. __ book __ bored the most is right here</li>
//                 <li>The man that made the most money in 2019 was Jeff Bezos. __ man __ made the most money __ 2019 was Jeff Bezos</li>
//                 <li>I saw somone who worked at my company. I saw someone __ worked at my company</li>
//                 <li>She wants to know which person took the money. She wants to know __ person took the money</li>
//                 <li>That's the cake (masculine) I want. That's __ cake __ I want</li>
//                 {/* {el} */}
//                 <li>The cat (masculine) is on top of the table! __ cat is on top of the table!</li>
//                 <li>The telephon (masculine) is rinning. __ telephone is rinning</li>
//                 {/* {en} */}
//                 <li>There's food in the kitchen (feminie). There's food __ __ kitchen</li>
//                 <li>Can you put my glasses on the table (feminie)? Can you put my glasses __ __ table?</li>
//                 <li>In 1492, Columbus sailed the ocean blue. __ 1492, Columbus sailed __ ocean blue</li>
//                 <li>Stay in line! Stay __ line!</li>
//                 <li>I don't like to travel by plane. I don't like to travel __ plane</li>
//                 {/* {y} */}
//                 <li>I want a pizza and coke. I want a pizza __ coke</li>
//                 <li>He has no job and refuses to work. He has no job __ refuses to work.</li>
//                 <li>The dog(masculine) kepy barking and barking. __ dog kept barking __ barking</li>
//                 <li>So, where is our friend? {ES['?']}__, where is our friend?</li>
//                 <li>And what's the problem (masculine) here? {ES['?']}__ __ is __ problem here</li>
//                 {/* {a} */}
//                 <li></li>
//             </ul>

//             const string = '|?|!|¡|¿'

export default SampleEmail
