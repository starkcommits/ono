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
import CricketIcon from '@/assets/Cricket.svg'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Pencil from '@/assets/Pencil.svg'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import ExitSellOrdersPriceDrawer from './ExitSellOrdersPriceDrawer'
import {
  useFrappeGetCall,
  useFrappeGetDocList,
  useSWRConfig,
} from 'frappe-react-sdk'

const ExitSellOrders = ({ market }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const {
    data: marketwiseActiveHoldings,
    isLoading: marketwiseActiveHoldingsLoading,
  } = useFrappeGetCall('rewardapp.engine.get_marketwise_holding')

  console.log('Exit Sell Orders ?', marketwiseActiveHoldings)

  const [isYesChecked, setIsYesChecked] = useState(
    market?.ACTIVE?.YES ? true : false
  )
  const [isNoChecked, setIsNoChecked] = useState(
    market?.ACTIVE?.NO ? true : false
  )
  const [yesExitPrice, setYesExitPrice] = useState(market.yes_price)
  const [noExitPrice, setNoExitPrice] = useState(market.no_price)

  const { lmao, data, mutate } = useSWRConfig()
  console.log('Hello:', lmao)

  console.log('isYesChecked', isYesChecked)
  console.log('isNoChecked', isNoChecked)
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger>
        <div className="flex items-center">
          <span className="font-semibold text-xs flex">
            Exit <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full">
        <DrawerHeader className="p-0">
          <div className="flex justify-between items-center gap-4 p-4">
            <DrawerTitle className="font-normal font-inter text-left text-[13px] leading-[100%] w-[90%]">
              {market.question}
            </DrawerTitle>
            <DrawerDescription className="w-[10%]">
              <img src={CricketIcon} alt="" />
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="p-4">
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mt-4">
              <span className="font-semibold text-xs text-[#2C2D32]">
                Bigger Sub Heading
              </span>
              <span className="font-semibold text-[10px] text-[#007AFF]">
                View Portfolio
              </span>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <Checkbox
                  id="no"
                  checked={isNoChecked}
                  onCheckedChange={(checked) => setIsNoChecked(checked)}
                />
                <Label
                  htmlFor="no"
                  className="font-semibold text-sm text-[#2C2D32]"
                >
                  NO
                </Label>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex flex-col gap-2 items-center">
                  <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                    &#8377;5.5
                  </span>
                  <span className="font-normal text-xs text-[#5F5F5F]">
                    Investment
                  </span>
                </div>
                <div className=" flex items-start gap-3">
                  <div className="flex flex-col gap-2 items-center">
                    <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                      &#8377;{noExitPrice}
                    </span>
                    <span className="font-normal text-xs text-[#5F5F5F]">
                      Exit Value
                    </span>
                  </div>
                  <ExitSellOrdersPriceDrawer
                    opinion_type="no"
                    price={noExitPrice}
                    setPrice={setNoExitPrice}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-5">
                <Checkbox
                  id="yes"
                  checked={isYesChecked}
                  onCheckedChange={(checked) => setIsYesChecked(checked)}
                />
                <Label
                  htmlFor="yes"
                  className="font-semibold text-sm text-[#2C2D32]"
                >
                  YES
                </Label>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex flex-col gap-2 items-center">
                  <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                    &#8377;5.5
                  </span>
                  <span className="font-normal text-xs text-[#5F5F5F]">
                    Investment
                  </span>
                </div>
                <div className=" flex items-start gap-3">
                  <div className="flex flex-col gap-2 items-center">
                    <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                      &#8377;{yesExitPrice}
                    </span>
                    <span className="font-normal text-xs text-[#5F5F5F]">
                      Exit Value
                    </span>
                  </div>
                  <ExitSellOrdersPriceDrawer
                    opinion_type="yes"
                    price={yesExitPrice}
                    setPrice={setYesExitPrice}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="bg-[#F4F3EF]">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1 font-inter font-semibold text-sm">
                <span className="">&#8377;5.4</span> <span>(-0.1)</span>
              </span>
              <span className="text-xs font-normal text-[#5F5F5F]">
                Exit Value
              </span>
            </div>
            <div className="rounded-[5px] px-20 py-5 bg-[#2C2D32] text-[#FFFFFF] cursor-pointer">
              <span className="font-[500] text-sm">EXIT</span>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ExitSellOrders
