import React, { Component } from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicies from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsletterBox'
import Footer from '../components/Footer'

const HomeN = () => {
  return (
    <div>
      <Hero/>
      <LatestCollection/>
      <BestSeller/>
      <OurPolicies/>
      <NewsLetterBox/>
    </div>
  )
}

export default HomeN
