import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = ({ items }) => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-gray-100 ">
      <div className="max-w-lg mx-auto px-6">
        <div className="flex justify-between py-4">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <div
                key={item.label}
                className={`nav-item ${
                  isActive ? 'active' : ''
                } cursor-pointer flex flex-col items-center`}
                onClick={() => {
                  if (item.path === '/portfolio') {
                    return navigate(`/portfolio?tab=active`)
                  }
                  if (item.path === '/wallet') {
                    return navigate(`/wallet?tab=all`)
                  }
                  return navigate(item.path)
                }}
              >
                <Icon className="h-5 w-5" />
                <span className="nav-text">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
