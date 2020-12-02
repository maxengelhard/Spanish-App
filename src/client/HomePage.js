import React from 'react'
import Header from './header'
import MainBody from './mainBody'
import SampleEmail from './SampleEmail'
import MailForm from './mailForm'

const HomePage = () => {
    return (
        <div>
      <Header />
      <div className='spacer'></div>
      <MainBody />
      <SampleEmail />
      <MailForm /> 
        </div>
    )
}

export default HomePage
