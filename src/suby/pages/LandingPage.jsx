import React from 'react'
import TopBar from '../components/TopBar'
import ItemsDisplay from '../components/ItemsDisplay'
import FirmCollection from '../components/FirmCollection'
import AiRecommadation from '../components/AiRecommadation'
import TopRankings from '../components/TopRankings'

const LandingPage = () => {
  return (
    <div>
      <TopBar/>
      <AiRecommadation/>
      <div className="landingSection">
      <ItemsDisplay/>
      <TopRankings/>
      <FirmCollection/>
      </div>
    </div>
  )
}

export default LandingPage
