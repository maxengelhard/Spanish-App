import React from 'react'
import EditQuestion from './EditQuestion'

const Lesson = ({questions, addQ, editQ, day, singleQ,id}) => {
    const index = parseInt(id)
    const active = questions[day][index].active

    return (
    <div className='lesson'>
        <div className='newQuestion' key={index}> 
            <div>
            {active ? <EditQuestion editQ={editQ} addQ={addQ} prevQuestion={singleQ}/> : <p>{singleQ}</p>}
            </div>
            {!active ? <button className='editBtn' onClick={editQ(index)}>{'Edit'}</button>: null}
        </div>
    
    </div>
    )
}

export default Lesson
