import InfoDrawer from '@/assets/InfoDrawer.svg'
import WalletDrawer from '@/assets/WalletDrawer.svg'
import WinningDrawer from '@/assets/WinningDrawer.svg'
import PromotionalDrawer from '@/assets/PromotionalDrawer.svg'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useState } from 'react'

const BalanceUsage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} className="">
      <DrawerTrigger>
        <span className="cursor-pointer">
          <img src={InfoDrawer} alt="" />
        </span>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
        <DrawerHeader className="p-0 pb-2">
          <div className="flex justify-between items-center gap-4 px-4">
            <p className="text-[#2C2D32] text-[24px] font-medium leading-normal">
              Balance Usage
            </p>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-6 px-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-[13px] items-center">
              <div className="rounded-[5px] bg-white shadow-[0_1px_1px_0_rgba(0,0,0,0.25)] p-[9px]">
                <img src={WalletDrawer} alt="" />
              </div>
              <div className="text-[#2C2D32]">
                <p className=" text-sm font-medium leading-normal">Deposit</p>
                <p className="text-[10px] font-normal">100% usable per trade</p>
              </div>
            </div>
            <div>
              <p className="text-[#2C2D32] text-xs font-semibold leading-normal font-inter">
                &#8377;0.0
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-[13px] items-center">
              <div className="rounded-[5px] bg-white shadow-[0_1px_1px_0_rgba(0,0,0,0.25)] p-[9px]">
                <img src={WinningDrawer} alt="" />
              </div>
              <div className="text-[#2C2D32]">
                <p className=" text-sm font-medium leading-normal">Winnings</p>
                <p className="text-[10px] font-normal">100% usable per trade</p>
              </div>
            </div>
            <div>
              <p className="text-[#2C2D32] text-xs font-semibold leading-normal font-inter">
                &#8377;0.0
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-[13px] items-center">
              <div className="rounded-[5px] bg-white shadow-[0_1px_1px_0_rgba(0,0,0,0.25)] p-[9px]">
                <img src={PromotionalDrawer} alt="" />
              </div>
              <div className="text-[#2C2D32]">
                <p className=" text-sm font-medium leading-normal">
                  Promotional
                </p>
                <p className="text-[10px] font-normal">100% usable per trade</p>
              </div>
            </div>
            <div>
              <p className="text-[#2C2D32] text-xs font-semibold leading-normal font-inter">
                &#8377;0.0
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm font-normal leading-normal text-black">
              total usable balance
            </p>
            <p className="text-[#2C2D32] text-xs font-semibold leading-normal font-inter">
              &#8377;0.0
            </p>
          </div>
          <div className="pb-4">
            <button
              className="w-full py-[18px] px-[16px] bg-[#2C2D32] text-white rounded-[5px]"
              onClick={() => {
                setIsDrawerOpen(false)
              }}
            >
              OKAY
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default BalanceUsage
