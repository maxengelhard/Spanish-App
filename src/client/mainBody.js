import React from 'react'
import MailForm from './mailForm'

const mainBody = () => {
    return (
        <div>
            <h1>Daily Spanish Pratice. It's Free</h1>
            <p>Join self-taught Spanish teacher and lover of learning Max Engelhard 
            with daily Spanish quizes, learning, and more!</p>
            <h3>Here's how it works</h3>
            <ul>
                <li>Sign up to recieved a daily email of fun and engaged exercises</li>
                <li>Try to solve the problems! It's fun and sharpens your mind</li>
                <li><b>(Pro)</b> Get access to interactive playground, recieve solutions with analysis, track your progress, get access to all excersises, and recieve additional nmeonmic ways to memorize it after each practice</li>
            </ul>
            <MailForm />
        </div>
    )
}

export default mainBody
