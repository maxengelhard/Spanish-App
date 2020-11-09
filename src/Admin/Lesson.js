import React from 'react'
import EditQuestion from './EditQuestion'

const Lesson = ({questions, addQ, editQ, day,setday}) => {
    return (
        <div className='lesson'>
    <h3>Assignment 1: Fill In The Blanks</h3>
    {questions[day].map((question,index) => {
        return (<div key={question.id}> 
            {question.active ? <EditQuestion editQ={editQ} addQ={addQ} prevQuestion={question}/> : <p>{question.question}</p>}
            {!question.active ? <button onClick={editQ(index)}>{'Edit'}</button>: null}
        </div>)
    })}
    {questions[day].length >0 ?  <button onClick={() => setday(-1)}>Send lesson</button>: null}
    </div>
    )
}

export default Lesson
