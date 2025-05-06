import { Home, Search, Newspaper, Briefcase, Wallet } from 'lucide-react'
import Navbar from './components/Navbar'
import HomePage from './pages/Home'
import WalletPage from './pages/Wallet'
import EventDetails from './pages/EventDetails'

import News from './pages/News'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/Search'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Rewards from './pages/Rewards'
import Notifications from './pages/Notifications'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import KYC from './pages/KYC'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import PublicRoute from './components/PublicRoute'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Overview from './pages/Overview'
import Portfolio from './pages/Portfolio'
import ActiveMarketHolding from './pages/ActiveMarketHolding'
import ClosedMarketHolding from './pages/ClosedMarketHolding'
import Referral from './pages/Referral'
import OTPScreen from './pages/OTPScreen'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
]

function App() {
  return (
    <div className="">
      <div className="w-full bg-gray-50">
        <div className="">
          <Toaster />
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/otp" element={<OTPScreen />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* <Route path="/overview" element={<Overview />} /> */}

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                {/* <Route path="/kyc" element={<KYC />} /> */}
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/portfolio" element={<Portfolio />} />
                {/* <Route path="/referral" element={<Referral />} /> */}
                <Route
                  path="/portfolio/active/:id"
                  element={<ActiveMarketHolding />}
                />
                <Route
                  path="/portfolio/closed/:id"
                  element={<ClosedMarketHolding />}
                />

                <Route path="/news" element={<News />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/category/:id" element={<CategoryPage />} />

                {/* <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} /> */}
                {/* <Route path="/rewards" element={<Rewards />} /> */}
                <Route path="/notifications" element={<Notifications />} />
              </Route>
            </Route>
            <Route
              path="*"
              element={
                <div className="w-full h-screen flex justify-center items-center overflow-hidden">
                  <div>404 NOT FOUND</div>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
