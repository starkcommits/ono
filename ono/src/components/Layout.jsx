import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Widget from './Widget'

const Layout = () => {
  return (
    <div>
      <div className="">
        <Outlet />
      </div>

      {/* Widget */}
      <div className="fixed left-0 right-0 bottom-0 flex flex-col pb-8 z-[50] bg-white">
        <Widget />
        <Navbar />
      </div>
    </div>
  )
}

export default Layout
