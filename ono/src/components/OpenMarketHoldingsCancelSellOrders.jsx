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
import CancelAnimation from '@/assets/CancelAnimation.json'
import CircleCrossIcon from '@/assets/CircleCrossIcon.svg'

import {
  useFrappeAuth,
  useFrappePostCall,
  useSWRConfig,
} from 'frappe-react-sdk'
import { toast } from 'sonner'
import Lottie from 'lottie-react'

const OpenMarketHoldingsCancelSellOrders = ({ market, exitingHoldings }) => {
  console.log('Holdingsadasdas', market)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { call: cancelSellOrders } = useFrappePostCall(
    'rewardapp.engine.cancel_order'
  )

  const { currentUser } = useFrappeAuth()

  const [isYesChecked, setIsYesChecked] = useState(
    market?.EXITING?.YES ? true : false
  )
  const [isNoChecked, setIsNoChecked] = useState(
    market?.EXITING?.NO ? true : false
  )

  const [showAnimation, setShowAnimation] = useState(false)
  const [buttonState, setButtonState] = useState('idle') // idle | processing | done

  const { mutate } = useSWRConfig()

  const handleCancelSellOrders = async () => {
    try {
      if (!isYesChecked && !isNoChecked) {
        toast.error('Please select at least one opinion type to cancel.')
        return
      }
      setButtonState('processing')
      if (isYesChecked) {
        await cancelSellOrders({
          order_type: 'SELL',
          market_id: market.market_id,
          user_id: currentUser,
          opinion_type: 'YES',
        })
      }
      if (isNoChecked) {
        await cancelSellOrders({
          order_type: 'SELL',
          market_id: market.market_id,
          user_id: currentUser,
          opinion_type: 'NO',
        })
      }

      setButtonState('done')
      setShowAnimation(true)

      setTimeout(() => {
        mutate(
          (key) => Array.isArray(key) && key[0] === 'open_marketwise_holdings'
        )

        setIsDrawerOpen(false)
        setShowAnimation(false)
        setButtonState('idle')
      }, 2000)
    } catch (error) {
      toast.error(`Error occured in cancelling unmatched orders`)
      setButtonState('idle')
    }
  }
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger className="font-semibold text-xs flex items-center">
          <div className="flex items-center gap-2 border rounded-full cursor-pointer hover:bg-[#2C2D32]/5 group">
            <span className="font-normal font-inter text-[10px] text-[#2C2D32] px-1 pl-3.5">
              {exitingHoldings} exiting
            </span>
            <Separator orientation="vertical" className="h-8" />
            <span className="flex items-center justify-center px-1 pr-4">
              <img src={CircleCrossIcon} alt="" />
            </span>
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto w-full max-h-full">
          {showAnimation ? (
            <div className="flex flex-col items-center justify-center px-4 py-10">
              <Lottie animationData={CancelAnimation} loop={false} />
              <span className="text-xl mt-2 text-[#2C2D32] font-medium">
                Cancel request submitted
              </span>
            </div>
          ) : (
            <>
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
                      Exiting Orders
                    </span>
                  </div>
                  {market?.EXITING?.NO && (
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
                            {market?.EXITING?.NO?.total_invested.toFixed(1)}
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
                              &#8377;
                              {(
                                market?.EXITING?.NO?.total_quantity -
                                market?.EXITING?.NO?.total_filled_quantity
                              ).toFixed(1)}
                            </span>

                            <span className="font-normal text-xs text-[#5F5F5F]">
                              Exit Value
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {market?.EXITING?.YES && (
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-5">
                        <Checkbox
                          id="yes"
                          checked={isYesChecked}
                          onCheckedChange={(checked) =>
                            setIsYesChecked(checked)
                          }
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
                            {market?.EXITING?.YES?.total_invested.toFixed(1)}
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
                              &#8377;
                              {(
                                (market?.EXITING?.YES?.total_quantity -
                                  market?.EXITING?.YES?.total_filled_quantity) *
                                market.yes_price
                              ).toFixed(1)}
                            </span>
                            <span className="font-normal text-xs text-[#5F5F5F]">
                              Exit Value
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
                  <div
                    className="rounded-[5px] px-20 py-2.5 bg-[#2C2D32] text-[#FFFFFF] cursor-pointer w-full text-center"
                    onClick={() => {
                      handleCancelSellOrders()
                    }}
                  >
                    <button
                      className="font-[500] text-sm"
                      disabled={buttonState !== 'idle'}
                    >
                      {buttonState === 'idle'
                        ? 'Cancel exit orders'
                        : buttonState === 'processing'
                        ? 'Processing...'
                        : 'Order Placed'}
                    </button>
                  </div>
                </div>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default OpenMarketHoldingsCancelSellOrders
