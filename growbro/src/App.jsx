import { Home, Search, Newspaper, Briefcase, Wallet } from 'lucide-react'
import Navbar from './components/Navbar'
import HomePage from './pages/Home'
import WalletPage from './pages/Wallet'
import EventDetails from './pages/EventDetails'
import Portfolio from './pages/Portfolio'
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
import PublicRoute from './components/PublicRoute'
import { useFrappeAuth } from 'frappe-react-sdk'
import { Route, Routes } from 'react-router-dom'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
]

function App() {
  const { currentUser } = useFrappeAuth()
  return (
    <div className="App">
      <div className="min-h-screen w-full bg-gray-50">
        <div className="max-w-lg mx-auto">
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/kyc" element={<KYC />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/news" element={<News />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </div>
        {currentUser && <Navbar items={navItems} />}
      </div>
    </div>
  )
}

export default App
