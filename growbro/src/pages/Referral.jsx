import React from 'react'
import ReferralHero from '../components/ReferralHero'
import EarningsTracker from '../components/EarningsTracker'
import ReferralCode from '../components/ReferralCode'
import ShareOptions from '../components/ShareOptions'
import TopInviters from '../components/TopInviters'
import HowItWorks from '../components/HowItWorks'

const Referral = () => {
  return (
    <>
      <ReferralHero />
      <div className="mt-6 space-y-6">
        <EarningsTracker />
        <ReferralCode />
        <ShareOptions />
        <TopInviters />
        <HowItWorks />
      </div>
    </>
  )
}

export default Referral
