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

function App() {
  return (
    <div className="max-w-md mx-auto relative">
      <Toaster richColors position="top-right" />
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTPScreen />} />

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
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/profile/:username/:type" element={<FollowListPage />} />
          <Route path="/edit/" element={<EditProfile />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/category/:id" element={<CategoryDetails />} />
          <Route path="/fixture/:id" element={<FixtureDetails />} />
          <Route path="/transactions" element={<TransactionHistory />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
