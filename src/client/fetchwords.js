import React from 'react'

class fetchwords extends React.Component {
    constructor() {
        super()
        this.state = {
            words: []
        }
    }

    componentDidMount() {
        fetch('/api/frequent/1')
        .then(res => res.json())
        .then(data => this.setState({words: data})) 
    }
    render() {
    const sentences = (arr) => arr.map(object => 
    <div key={object.sId}>
        <p>{object.usage}</p>
        <p>Spanish: {object.spanish}</p>
        <p>English: {object.english}</p>
        </div>)   
    const words = this.state.words.map(newWord => <li key={newWord.id}>{newWord.word}{sentences(newWord.sentences)}</li>)
    return (
        <div>
            <ul>{words}</ul>
        </div>
    )
    }

    }

export default fetchwords
