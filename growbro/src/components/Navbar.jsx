import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ items }) => {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
      <div className="max-w-lg mx-auto px-6">
        <div className="flex justify-between py-4">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="h-5 w-5" />
                <span className="nav-text">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
