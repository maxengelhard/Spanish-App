import React from 'react'
import Header from './header'
import MainBody from './mainBody'
import SampleEmail from './sampleEmail'
import MailForm from './mailForm'
import HowEmail from './HowEmail'
import CallToAction from './CallToAction'
import {Redirect} from 'react-router-dom'
import Stripe from './Stripe'

const HomePage = () => {
    if (localStorage.user_id) {
        return <Redirect to={{pathname:`/dashboard`, state: {id: localStorage.user_id}}} />
    }
    return (
        <div>
       <Header />
       <div className='spacer'></div>
       <CallToAction />
      <MainBody />
      <HowEmail />
      <SampleEmail />
      <MailForm /> 
      <Stripe />
        </div>
    )
}

export default HomePage
