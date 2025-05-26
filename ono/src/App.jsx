import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/Layout'

import News from './pages/News'
import Portfolio from './pages/Portfolio'
import Profile from './pages/Profile'
import Search from './pages/Search'
import PortfolioRedirect from './components/PortfolioRedirect'
import Login from './pages/Login'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <div className="max-w-md mx-auto relative">
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/news" element={<News />} />
          <Route path="/portfolio" element={<PortfolioRedirect />} />
          <Route path="/portfolio/:status" element={<Portfolio />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
