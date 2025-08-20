import HomeIcon from '@/assets/HomeNavbar.svg'
import SearchIcon from '@/assets/SearchNavbar.svg'
import NewsIcon from '@/assets/NewsNavbar.svg'
import BriefcaseIcon from '@/assets/BriefcaseNavbar.svg'
import UserIcon from '@/assets/UserNavbar.svg'
import ActiveHomeNavbar from '@/assets/ActiveHomeNavbar.svg'
import ActiveSearchNavbar from '@/assets/ActiveSearchNavbar.svg'
import ActiveNewsNavbar from '@/assets/ActiveNewsNavbar.svg'
import ActivePortfolioNavbar from '@/assets/ActivePortfolioNavbar.svg'
import ActiveProfileNavbar from '@/assets/ActiveProfileNavbar.svg'

import { useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  console.log('Location', location.pathname)
  const handleNavigatePage = (route) => {
    navigate(route)
  }
  return (
    <div className="select-none flex justify-between max-w-md mx-auto border-t-2 text-[#606060] text-[11px] leading-[100%] font-normal w-full pt-4 px-4">
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          handleNavigatePage('/')
        }}
      >
        {location.pathname === '/' ? (
          <>
            <img src={ActiveHomeNavbar} alt="" className="" />
            <p className="text-[#0819D4]">Home</p>
          </>
        ) : (
          <>
            <img src={HomeIcon} alt="" className="" />
            <p className="">Home</p>
          </>
        )}
      </div>
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          handleNavigatePage('/search')
        }}
      >
        {location.pathname === '/search' ? (
          <>
            <img src={ActiveSearchNavbar} alt="" />
            <p className="text-[#0819D4]">Search</p>
          </>
        ) : (
          <>
            <img src={SearchIcon} alt="" />
            <p>Search</p>
          </>
        )}
      </div>
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          handleNavigatePage('/news')
        }}
      >
        {location.pathname === '/news' ? (
          <>
            <img src={ActiveNewsNavbar} alt="" />
            <p className="text-[#0819D4]">News</p>
          </>
        ) : (
          <>
            <img src={NewsIcon} alt="" />
            <p>News</p>
          </>
        )}
      </div>
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          const portfolioTab = localStorage.getItem('currentPortfolioTab')

          handleNavigatePage(`/portfolio`)
        }}
      >
        {location.pathname === '/portfolio' ? (
          <>
            <img src={ActivePortfolioNavbar} alt="" />
            <p className="text-[#0819D4]">Portfolio</p>
          </>
        ) : (
          <>
            <img src={BriefcaseIcon} alt="" />
            <p>Portfolio</p>
          </>
        )}
      </div>
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          handleNavigatePage('/profile')
        }}
      >
        {location.pathname === '/profile' ? (
          <>
            <img src={ActiveProfileNavbar} alt="" />
            <p className="text-[#0819D4]">Profile</p>
          </>
        ) : (
          <>
            <img src={UserIcon} alt="" />
            <p>Profile</p>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar
