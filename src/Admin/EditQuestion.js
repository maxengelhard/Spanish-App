import React, {useState } from 'react'

const EditQuestionForm = ({addQ, prevQuestion}) => {
    const [question, setQuestion] = useState(prevQuestion);
    const handleSumbit = (e) => {
        e.preventDefault();
        addQ(question)
        setClear(true)
    }
    const [clear, setClear] = useState(false)

    return (
        clear ? null : 
        <form onSubmit={handleSumbit}>
        <textarea value={question} required onChange={(e) => setQuestion(e.target.value)} />
        <input type='submit' value='Submit' />
        </form>
        
        
    )
}

export default EditQuestionForm