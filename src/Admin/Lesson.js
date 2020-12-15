import React from 'react'
import EditQuestion from './EditQuestion'

const Lesson = ({questions, addQ, editQ, day,setday}) => {
    return (
    <div className='lesson'>
    <h3>Assignment 1: Fill In The Blanks</h3>
    {questions[day].map((question,index) => {
        const split = question.question.split('.')
        return (<div className='newQuestion' key={index}> 
            <div>
            {question.active ? <EditQuestion editQ={editQ} addQ={addQ} prevQuestion={question}/> : split.map((txt,i) => <p key={i}>{txt}</p>)}
            </div>
            {!question.active ? <button className='editBtn' onClick={editQ(index)}>{'Edit'}</button>: null}
        </div>)
    })}
    </div>
    )
}

export default Lesson
