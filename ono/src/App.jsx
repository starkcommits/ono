import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'

import News from './pages/News'
import Portfolio from './pages/Portfolio'
import Profile from './pages/Profile'
import Search from './pages/Search'

import Login from './pages/Login'
import { Toaster } from 'sonner'
import OTPScreen from './pages/OTPScreen'
import EventDetails from './pages/EventDetails'
import CategoryDetails from './pages/CategoryDetails'
import FixtureDetails from './pages/FixtureDetails'
import ScrollToTop from './components/ScrollToTop'
import Leaderboard from './pages/Leaderboard'
// import { AnalyticsProvider } from './analytics/AnalyticsProvider'

import { useEffect } from 'react'
import TransactionHistory from './pages/TransactionsHistory'
import OpenClosedResolvedMarketHoldings from './pages/OpenClosedResolvedMarketHoldings'

import Balance from './pages/Balance'
import Topics from './components/Topics'
import UserProfile from './pages/UserProfile'
import EditProfile from './components/EditProfile'
import FollowListPage from './pages/FollowListPage'
import Transactions from './pages/Transactions'
import PublicRoute from './components/PublicRoute'
import ProtectedRoute from './components/ProtectedRoute'
import GotReferralCode from './pages/GotReferralCode'
import RateUs from './pages/RateUs'
import PostHogInit from './components/PostHogInit'
import Terms from './pages/Terms'
import Help from './pages/Help'
import FAQDetails from './components/FAQDetails'
import PaymentsRecharges from './pages/PaymentsRecharges'
import TradingSettlement from './pages/TradingSettlement'
import ControlCentre from './pages/ControlCentre'
import TaxRelated from './pages/TaxRelated'
import OtherIssues from './pages/OtherIssues'
import TrustSafety from './pages/TrustSafety'
import ONOAcademy from './pages/ONOAcademy'
import ControlCentreFAQ from './pages/ControlCentreFAQ'
import StatementsCertificate from './pages/StatementsCertificate'
import KYC from './pages/KYC'

function App() {
  return (
    <div className="max-w-md mx-auto relative">
      <Toaster richColors position="top-right" />
      <ScrollToTop />
      {/* <PostHogInit /> */}
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OTPScreen />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/news" element={<News />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route
              path="/portfolio/:market_id"
              element={<OpenClosedResolvedMarketHoldings />}
            />

            <Route path="/topics" element={<Topics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rate" element={<RateUs />} />

            <Route path="/profile/:username" element={<UserProfile />} />
            <Route
              path="/profile/:username/:type"
              element={<FollowListPage />}
            />
            <Route path="/edit/" element={<EditProfile />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/control-centre" element={<ControlCentre />} />
            <Route path="/statements" element={<StatementsCertificate />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/category/:id" element={<CategoryDetails />} />
            <Route path="/fixture/:id" element={<FixtureDetails />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/transactions/:id" element={<Transactions />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/help" element={<Help />} />
            <Route path="/ono-academy" element={<ONOAcademy />} />
            <Route path="/kyc" element={<KYC />} />

            <Route path="/payments" element={<PaymentsRecharges />} />
            <Route path="/trading" element={<TradingSettlement />} />
            <Route path="/control-centre-faq" element={<ControlCentreFAQ />} />
            <Route path="/tax-related" element={<TaxRelated />} />
            <Route path="/other-issues" element={<OtherIssues />} />
            <Route path="/trust-safety" element={<TrustSafety />} />

            <Route path="/faq/:id" element={<FAQDetails />} />
          </Route>
          <Route path="/got-referral-code" element={<GotReferralCode />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
