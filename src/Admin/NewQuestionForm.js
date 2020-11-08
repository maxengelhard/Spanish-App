import React, {useState } from 'react'

const NewQuestionForm = ({addQ}) => {
    const [question, setQuestion] = useState('');
    const handleSumbit = (e) => {
        e.preventDefault();
        addQ(question)
        setQuestion('')
    }
    return (
        <form onSubmit={handleSumbit}>
        <label>New Question:</label>
        <input type="text" value={question} required onChange={(e) => setQuestion(e.target.value)} />
        <input type='submit' value='Submit' />
        </form>
    )
}

export default NewQuestionForm
