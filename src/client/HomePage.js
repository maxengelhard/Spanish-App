import React from 'react'
import Header from './header'
import MainBody from './mainBody'
import SampleEmail from './sampleEmail'
import MailForm from './mailForm'
import HowEmail from './HowEmail'

const HomePage = () => {
    return (
        <div>
      <Header />
      <div className='spacer'></div>
      <MainBody />
      <HowEmail />
      <SampleEmail />
      <MailForm /> 
        </div>
    )
}

export default HomePage
