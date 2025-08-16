import Navbar from './Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Widget from './Widget'
import HomeHeader from './HomeHeader'
import { useFrappeEventListener } from 'frappe-react-sdk'
import { MarketEventListener } from './MarketEventListener'
import { OrderBookEventListener } from './OrderBookEventListener'
import { useEffect } from 'react'
import posthog from 'posthog-js'

const Layout = () => {
  const location = useLocation()

  const path = location.pathname

  // Define paths or patterns where Header should be hidden
  const homeRoute = path === '/' // dynamically hide for /event/:id
  const searchRoute = path === '/search'
  const portfolioRoute = path === '/portfolio' // dynamically hide for /event/:id
  const eventRoute = path.startsWith('/event/')
  const newsRoute = path === '/news'

  useFrappeEventListener('market_event', (event) => {
    MarketEventListener.emit(event)
  })

  useFrappeEventListener('order_book_event', (event) => {
    OrderBookEventListener.emit(event)
  })

  useEffect(() => {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_API_KEY, {
      api_host: 'https://apps.paymegas.com',
    })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col">
      {homeRoute && (
        <div className="sticky top-0 left-0 right-0 z-[51] bg-white">
          <HomeHeader />
        </div>
      )}
      {/* {eventRoute && (
        <div className="mb-auto sticky z-[50] top-0 left-0 right-0">
          <EventHeader />
        </div>
      )} */}
      <div className="flex-1 bg-[#F5F5F5]">
        <Outlet />
      </div>
      {/* Widget */}
      {homeRoute && (
        <div className="sticky left-0 right-0 bottom-0 flex flex-col pb-8 z-[50] bg-white mt-auto">
          <Widget />
          <Navbar />
        </div>
      )}
      {(portfolioRoute || searchRoute || newsRoute) && (
        <div className="sticky left-0 right-0 bottom-0 flex flex-col pb-8 z-[50] bg-white mt-auto">
          <Navbar />
        </div>
      )}
    </div>
  )
}

export default Layout
