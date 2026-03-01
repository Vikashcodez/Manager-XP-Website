import React from 'react'
import HeroSection from '../components/Hero'
import WhyUsPage from '../components/WhyUs'
import MissionVisionPage from '../components/MissionVisionPage'
import DemoRibbon from '../components/Ribon'

const Home = () => {
  return (
    <div>
        <HeroSection />
        <WhyUsPage />
        <MissionVisionPage />
        <DemoRibbon />
    </div>
  )
}

export default Home