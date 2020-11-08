import React from 'react'

const ES = {
    'a': 'á',
    'e': 'é',
    'i': 'í',
    'n': 'ñ',
    'o': 'ó',
    'u': 'ú',
    '?': '¿',
    '!':'¡',
    'U': 'ü',
}

const sampleEmail = () => {
    return (
        <div className='sampleEmail'>
            <h1>Sample Email</h1>
            New Words:
            <ol>
                <li>de</li>
                <li>la</li>
                <li>que</li>
                <li>el</li>
                <li>en</li>
                <li>y</li>
                <li>a</li>
                <li>los</li>
                <li>se</li>
                <li>del</li>
            </ol>
            New Idioms:
            <ul>
                <li><b>el que</b></li>
                <li><b>la que</b></li>
                <li><b>la de</b></li>
    <li lang='es'><b>{ES['?']}Por qu{ES['e']}?</b></li>
            </ul>
            <h1>Assignment 1: Fill In The Blanks</h1>
            <ul>
                {/* {de} */}
                <li>Your view is different from mine. Your view is different __ mine</li>
                <li>Are you sure Tom isn't from Boston? Are you sure Tom isn't __ Boston?</li>
                <li>This sweater is made of whool. This sweater is made __ whool</li>
                <li>Isn't that Emily's car? Isn't that the car __ Emily?</li>
                <li>That was Perdo's house. That was the house __ Pedro</li>
                <li>I'm going to go to Sam's house. I am going to go to the house __ Sam</li>
                {/* {la} */}
                <li>The girl was in the kitchen. __ girl was in the kitchen</li>
                <li>The milk (feminine) was spoiled. __ milk was spolied</li>
                <li>Can you bring her next time? __ can you bring next time?</li>
                <li>I don't know her. I don't __ know.</li>
                <li>It was the first time. It was __ first time</li>
                {/* {la de} */}
                <li>Peter's thing is better. __ __ Peter's is better</li>
                {/* {por que} */}
                <li>Why did she leave? {ES['?']}__ did she leave?</li>
                {/* {que} */}
                <li>How strange! {ES['!']}__ strange!</li>
                <li>Understand that some people are mean. Understand __ some people are mean</li>
                <li>It's easier to dance than sing. It's easier to dance __ sing</li>
                <li>My brother is taller than me. My brother is taller __ me</li>
                <li>I like lettuce more than spinach. I like lettuce more __ spinach</li>
                <li>The man who fixed our car is here. __ man __ fixed our car is here</li>
                <li>The book (masculine) which bored me the most is right here. __ book __ bored the most is right here</li>
                <li>The man that made the most money in 2019 was Jeff Bezos. __ man __ made the most money __ 2019 was Jeff Bezos</li>
                <li>I saw somone who worked at my company. I saw someone __ worked at my company</li>
                <li>She wants to know which person took the money. She wants to know __ person took the money</li>
                <li>That's the cake (masculine) I want. That's __ cake __ I want</li>
                {/* {el} */}
                <li>The cat (masculine) is on top of the table! __ cat is on top of the table!</li>
                <li>The telephon (masculine) is rinning. __ telephone is rinning</li>
                {/* {en} */}
                <li>There's food in the kitchen (feminie). There's food __ __ kitchen</li>
                <li>Can you put my glasses on the table (feminie)? Can you put my glasses __ __ table?</li>
                <li>In 1492, Columbus sailed the ocean blue. __ 1492, Columbus sailed __ ocean blue</li>
                <li>Stay in line! Stay __ line!</li>
                <li>I don't like to travel by plane. I don't like to travel __ plane</li>
                {/* {y} */}
                <li>I want a pizza and coke. I want a pizza __ coke</li>
                <li>He has no job and refuses to work. He has no job __ refuses to work.</li>
                <li>The dog(masculine) kepy barking and barking. __ dog kept barking __ barking</li>
                <li>So, where is our friend? {ES['?']}__, where is our friend?</li>
                <li>And what's the problem (masculine) here? {ES['?']}__ __ is __ problem here</li>
                {/* {a} */}
                <li></li>
            </ul>
        </div>
    )
}

export default sampleEmail
