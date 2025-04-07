import React from 'react'
import { Outlet } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'
import Navbar from './Navbar'
import { Briefcase, Home, Newspaper, Search, Wallet } from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Newspaper, label: 'News', path: '/news' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
]

const Layout = () => {
  const { currentUser } = useFrappeAuth()
  return (
    <div>
      <Outlet />
      <div className="">{currentUser && <Navbar items={navItems} />}</div>
    </div>
  )
}

export default Layout
