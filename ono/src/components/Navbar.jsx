import HomeIcon from '@/assets/HomeNavbar.svg'
import SearchIcon from '@/assets/SearchNavbar.svg'
import NewsIcon from '@/assets/NewsNavbar.svg'
import BriefcaseIcon from '@/assets/BriefcaseNavbar.svg'
import UserIcon from '@/assets/UserNavbar.svg'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const handleNavigatePage = (route) => {
    navigate(route)
  }
  return (
    <div className="flex justify-between max-w-md mx-auto border-t-2 text-[#606060] text-[11px] leading-[100%] font-normal w-full pt-4 px-4">
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          handleNavigatePage('/')
        }}
      >
        <img src={HomeIcon} alt="" className="" />
        <p className="">Home</p>
      </div>
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          handleNavigatePage('/search')
        }}
      >
        <img src={SearchIcon} alt="" />
        <p>Search</p>
      </div>
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          handleNavigatePage('/news')
        }}
      >
        <img src={NewsIcon} alt="" />
        <p>News</p>
      </div>
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          const portfolioTab = localStorage.getItem('currentPortfolioTab')

          handleNavigatePage(`/portfolio/${portfolioTab || 'open'}`)
        }}
      >
        <img src={BriefcaseIcon} alt="" />
        <p>Portfolio</p>
      </div>
      <div
        className="flex flex-col justify-center items-center gap-2 cursor-pointer"
        onClick={() => {
          handleNavigatePage('/profile')
        }}
      >
        <img src={UserIcon} alt="" />
        <p>Profile</p>
      </div>
    </div>
  )
}

export default Navbar
