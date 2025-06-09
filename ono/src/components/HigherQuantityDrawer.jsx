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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Ellipsis } from 'lucide-react'
import { useEffect, useState } from 'react'

const HigherQuantityDrawer = ({
  price,
  market,
  userWalletData,
  maxQuantity,
  setMaxQuantity,
  setQuantity,
}) => {
  const [isQuantityDrawer, setIsQuantityDrawer] = useState(false)
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false)
  const [tempLimit, setTempLimit] = useState(null)
  const [limitTab, setLimitTab] = useState(() => {
    if (maxQuantity === 1000) return '1000-qty'

    if (maxQuantity === 20000) return '20000-qty'

    return ''
  })

  return (
    <Drawer open={isQuantityDrawer} onOpenChange={setIsQuantityDrawer}>
      <DrawerTrigger>
        <button className="border rounded-5px bg-white border-[#D9D9D980] p-1 cursor-pointer leading-[100%]">
          <Ellipsis className="w-5 h-5" strokeWidth={2} />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full bg-[#F5F5F5] px-[10px] flex flex-col gap-2">
        <DrawerHeader className="p-0">
          <DrawerTitle className="text-left font-inter font-[500] text-2xl py-[10px]">
            Select quantity limit
          </DrawerTitle>
        </DrawerHeader>

        <Tabs
          value={limitTab}
          onValueChange={(value) => {
            const limit = value === '1000-qty' ? 1000 : 20000
            if (limit <= market.max_allowed_quantity) {
              setTempLimit(limit)
              setLimitTab(value)
              setIsConfirmEnabled(true)
            } else {
              return
            }
          }}
        >
          <TabsList className="w-full max-w-md mx-auto text-[#2C2D32] bg-[#CBCBCB] border border-[#CBCBCB] rounded-full p-0 h-12 justify-center items-center">
            <button className="w-full h-full">
              <TabsTrigger
                value="1000-qty"
                className="w-full rounded-full h-full font-semibold text-xl data-[state=active]:shadow-none"
              >
                1000 qty
              </TabsTrigger>
            </button>
            <button
              className="w-full h-full"
              disabled={userWalletData?.balance < 10000}
            >
              <TabsTrigger
                value="20000-qty"
                className="w-full rounded-full h-full font-semibold text-xl"
              >
                20000 qty
              </TabsTrigger>
            </button>
          </TabsList>
        </Tabs>

        <p
          className={`font-inter font-normal text-[10px] mt-3 text-center ${
            userWalletData?.balance < 10000 && 'bg-yellow-200 p-2 rounded-full'
          }`}
        >
          Minimum balance of Rs.10,000 is required to set a slider limit of
          20000.
        </p>

        <DrawerFooter className="p-0 pb-10 mt-3">
          {isConfirmEnabled ? (
            <button
              className="w-full font-inter font-[500] text-black text-sm tracking-[1px] py-[18px] px-4 border rounded-[5px] transition-all duration-300 hover:bg-white/80"
              onClick={() => {
                setMaxQuantity(tempLimit)
                setQuantity(tempLimit)
                setIsQuantityDrawer(false)
              }}
            >
              CONFIRM
            </button>
          ) : (
            <button
              className="w-full font-inter font-[500] text-black text-sm tracking-[1px] py-[18px] px-4 border rounded-[5px] transition-all duration-300 hover:bg-white/80"
              onClick={() => {
                setIsQuantityDrawer(false)
              }}
            >
              CLOSE
            </button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default HigherQuantityDrawer
