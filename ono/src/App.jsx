import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'

import News from './pages/News'
import Portfolio from './pages/Portfolio'
import Profile from './pages/Profile'
import Search from './pages/Search'
import PortfolioRedirect from './components/PortfolioRedirect'
import Login from './pages/Login'
import { Toaster } from 'sonner'
import OTPScreen from './pages/OTPScreen'
import EventDetails from './pages/EventDetails'
import CategoryDetails from './pages/CategoryDetails'
import FixtureDetails from './pages/FixtureDetails'
import ScrollToTop from './components/ScrollToTop'
import Leaderboard from './pages/Leaderboard'

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
          <Route path="/portfolio" element={<PortfolioRedirect />} />
          <Route path="/portfolio/:status" element={<Portfolio />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/category/:id" element={<CategoryDetails />} />
          <Route path="/fixture/:id" element={<FixtureDetails />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
