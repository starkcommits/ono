import HamburgerIcon from '@/assets/HamburgerHeader.svg'
import WalletIcon from '@/assets/WalletHeader.svg'
import BellIcon from '@/assets/BellHeader.svg'
import { NovuInbox } from './ui/inbox/NovuInbox'
import ONOLogo from '@/assets/ONOLogo.avif'
import { Navigate, useNavigate } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'

const HomeHeader = () => {
  const navigate = useNavigate()
  return (
    <div className="h-16 select-none w-full p-4 border-b flex justify-between items-center gap-4 border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
      <div className="flex items-center gap-2.5">
        <span
          className="cursor-pointer"
          onClick={() => {
            navigate('/')
          }}
        >
          <img src={ONOLogo} width={85} height={40} alt="" />
        </span>
      </div>

      <div className="flex gap-1 items-center">
        <div className="rounded-[20px] px-[11px] py-1.5 flex gap-2.5 border">
          <img src={WalletIcon} alt="" />
          <span className="text-md font-inter">&#8377;1,250.56</span>
        </div>

        <NovuInbox />
      </div>
    </div>
  )
}

export default HomeHeader
