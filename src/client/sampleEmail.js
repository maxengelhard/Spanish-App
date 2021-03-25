import React , {useState, useEffect } from 'react'
import {words1,words2,words3} from './spanishExamples/words'
import lessons from './spanishExamples/lessons'


const SampleEmail = () => {

    const [day,setday] = useState(1)
    const [newWords,setNewWords] = useState(words1)
    const [lesson,setLesson] = useState(lessons.lesson1)
    const [solution,setSoltion] = useState(lessons.solution1)

    // const [pro, setPro] = useState(false)

    useEffect(() => {
        const ref = {
            1: [words1,lessons.lesson1,lessons.solution1],
            2: [words2,lessons.lesson2,lessons.solution2],
            3: [words3,lessons.lesson3,lessons.solution3]
        }
        setNewWords(ref[day][0])
        setLesson(ref[day][1])
        setSoltion(ref[day][2])
    }, [day])



    return (
        <div className='sampleEmail'>
            <h1>Sample Email</h1>
            <div className='sampleButtons'>
            <button className={day===1? 'active': ''} onClick={() => setday(1)}>Day 1</button>
            <button className={day===2? 'active': ''} onClick={() => setday(2)}>After Week 1</button>
            <button className={day===3? 'active': ''} onClick={() => setday(3)}>After One Month</button>
            </div>
            <div className='newWords'>
            New Words:
            <ol>
                {newWords.map((word,i) => {

                    return <li key={i}>{word} </li>
                })}
            </ol>
            </div>
            <h1>Assignment: Fill In The Blanks</h1>
            <ul>
            {lesson.split('<p>').map((question,i) => {
                const match = question.match(/[!?]/)
                if (question.includes('<h4>')) {
                    const end_h4 = question.match('</h4>').index
                    return <li key={i}><b>{question.substring(4,end_h4)}</b>{question.slice(end_h4+5)}</li>
                }
                return <li key={i}>{match ? question.replaceAll(match[0],match[0][0]) : question}</li>
            })}
            </ul>
            <h1>Solutions: <b>Pro Version</b></h1>
            <ul>
            {solution.split('<p>').map((question,i) => {
                const match = question.match(/[!?]/)
                const start = i ===0 ? 4 : 5 // the first is different
                if (question.includes('<h4>')) {
                    return <li key={i}><h4>{question.substring(start,question.length-5)}</h4></li>
                } 
                if (question.includes('<b>')) {
                    return <li key={i}><b>{question.slice(3)}</b></li>
                }
                return <li key={i}>{match ? question.replaceAll('.','. ').replaceAll(match[0], `${match[0]} `): question.replaceAll('.','. ')}</li>
            })}
            </ul>
        </div>
    )
}


export default SampleEmail
