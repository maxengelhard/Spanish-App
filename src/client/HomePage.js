import React from 'react'
import Header from './header'
import MainBody from './mainBody'
import SampleEmail from './sampleEmail'
import FetchedWords from './fetchwords'

const HomePage = () => {
    return (
        <div>
        <Header />
      <MainBody />
      <SampleEmail />
      <FetchedWords />  
        </div>
    )
}

export default HomePage
