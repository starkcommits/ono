import {
  Drawer,
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
import { useState } from 'react'
import ExitSellOrdersPriceDrawer from './ExitSellOrdersPriceDrawer'
import {
  useFrappeAuth,
  useFrappeCreateDoc,
  useFrappeGetCall,
  useFrappePostCall,
  useSWRConfig,
} from 'frappe-react-sdk'
import { toast } from 'sonner'
const CancelBuyOrders = ({ market }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { call: cancelBuyOrders } = useFrappePostCall(
    'rewardapp.engine.cancel_order'
  )
  const { currentUser } = useFrappeAuth()

  const [isYesChecked, setIsYesChecked] = useState(
    market?.UNMATCHED?.YES ? true : false
  )
  const [isNoChecked, setIsNoChecked] = useState(
    market?.UNMATCHED?.NO ? true : false
  )

  const handleCancelBuyOrders = async () => {
    try {
      if (!isYesChecked && !isNoChecked) {
        toast.error('Please select at least one opinion type to cancel.')
        return
      }
      if (isYesChecked) {
        await cancelBuyOrders({
          order_type: 'BUY',
          market_id: market.market_id,
          user_id: currentUser,
          opinion_type: 'YES',
        })
      }
      if (isNoChecked) {
        await cancelBuyOrders({
          order_type: 'BUY',
          market_id: market.market_id,
          user_id: currentUser,
          opinion_type: 'NO',
        })
      }
      toast.success('Orders cancelled successfully')
    } catch (error) {
      toast.error(`Error occured in cancelling unmatched orders`)
    }
  }

  console.log(currentUser)
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger
          className="font-semibold text-xs flex items-center cursor-pointer"
          onClick={(e) => {
            setIsDrawerOpen(true)
          }}
        >
          Cancel <ChevronRight className="h-4 w-4" />
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto w-full max-h-full">
          <DrawerHeader className="p-0">
            <div className="flex justify-between items-center gap-4 p-4">
              <DrawerTitle className="font-normal font-inter text-left text-[13px] leading-[18px] w-[90%]">
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
                  Select orders to cancel
                </span>
              </div>
              {market?.UNMATCHED?.NO && (
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
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                        &#8377;
                        {market?.UNMATCHED?.NO?.total_invested.toFixed(1)}
                      </span>
                      <span className="font-normal text-xs text-[#5F5F5F]">
                        Investment
                      </span>
                    </div>
                    <div className=" flex items-start gap-3">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-semibold text-sm font-inter text-[#2C2D32]`}
                        >
                          {(
                            market?.UNMATCHED?.NO?.total_quantity -
                            market?.UNMATCHED?.NO?.total_filled_quantity
                          ).toFixed(1)}
                        </span>

                        <span className="font-normal text-xs text-[#5F5F5F]">
                          Qty
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {market?.UNMATCHED?.YES && (
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
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                        &#8377;
                        {market?.UNMATCHED?.YES?.total_invested.toFixed(1)}
                      </span>
                      <span className="font-normal text-xs text-[#5F5F5F]">
                        Investment
                      </span>
                    </div>
                    <div className=" flex items-start gap-3">
                      <div className="flex flex-col items-end">
                        <span
                          className={`font-semibold text-sm font-inter text-[#2C2D32]`}
                        >
                          {(
                            market?.UNMATCHED?.YES?.total_quantity -
                            market?.UNMATCHED?.YES?.total_filled_quantity
                          ).toFixed(1)}
                        </span>
                        <span className="font-normal text-xs text-[#5F5F5F]">
                          Qty
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DrawerFooter>
            <div className="flex items-center justify-between w-full">
              <div className="rounded-[5px] px-20 py-2.5 bg-[#2C2D32] text-[#FFFFFF] cursor-pointer w-full text-center">
                <span
                  className="font-[500] text-sm"
                  onClick={handleCancelBuyOrders}
                >
                  CANCEL
                </span>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default CancelBuyOrders
