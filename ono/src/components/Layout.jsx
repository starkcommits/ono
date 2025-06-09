import Navbar from './Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Widget from './Widget'
import HomeHeader from './HomeHeader'

const Layout = () => {
  const location = useLocation()

  const path = location.pathname
  console.log(path)

  // Define paths or patterns where Header should be hidden
  const homeRoute = path === '/' // dynamically hide for /event/:id
  const portfolioRoute = path.startsWith('/portfolio') // dynamically hide for /event/:id
  const eventRoute = path.startsWith('/event/')

  return (
    <div className="min-h-screen flex flex-col">
      {homeRoute && (
        <div className="sticky top-0 left-0 right-0 z-[50] bg-white">
          <HomeHeader />
        </div>
      )}
      {/* {eventRoute && (
        <div className="mb-auto sticky z-[50] top-0 left-0 right-0">
          <EventHeader />
        </div>
      )} */}
      <div className="flex-1">
        <Outlet />
      </div>
      {/* Widget */}
      {(homeRoute || portfolioRoute) && (
        <div className="sticky left-0 right-0 bottom-0 flex flex-col pb-8 z-[50] bg-white mt-auto">
          <Widget />
          <Navbar />
        </div>
      )}
    </div>
  )
}

export default Layout
