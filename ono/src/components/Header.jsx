import HamburgerIcon from '@/assets/HamburgerHeader.svg'
import WalletIcon from '@/assets/WalletHeader.svg'
import BellIcon from '@/assets/BellHeader.svg'

const Header = () => {
  return (
    <div className="select-none w-full p-4 border-b flex justify-between items-center gap-4 border-[#8D8D8D80]/50 fixed z-[50] top-0 left-0 right-0 max-w-md mx-auto bg-white">
      <div className="flex items-center gap-2.5">
        <img src={HamburgerIcon} alt="" className="" />
        <span className="text-[#E26F64] text-lg">ONO</span>
      </div>

      <div className="flex gap-2.5 items-center">
        <div className="rounded-[20px] px-[11px] py-1.5 flex gap-2.5 border">
          <img src={WalletIcon} alt="" />
          <span className="text-md">&#8377;1,250.56</span>
        </div>
        <div>
          <img src={BellIcon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Header
