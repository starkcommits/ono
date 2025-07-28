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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import CancelAnimation from '@/assets/CancelAnimation.json'

import { Slider } from '@/components/ui/slider'

import { useEffect, useRef, useState } from 'react'
import {
  FrappeContext,
  useFrappeAuth,
  useFrappeCreateDoc,
  useFrappeEventListener,
  useFrappeGetDoc,
  useFrappePostCall,
  useFrappeUpdateDoc,
  useSWRConfig,
} from 'frappe-react-sdk'
import { useParams } from 'react-router-dom'
import {
  AlertTriangle,
  Clock,
  Edit3,
  Ellipsis,
  Minus,
  Plus,
} from 'lucide-react'

import OrderBook from './OrderBook'
import CircleCrossIcon from '@/assets/CircleCrossIcon.svg'
import CricketIcon from '@/assets/Cricket.svg'
import OrderBookIcon from '@/assets/OrderBook.svg'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import Lottie from 'lottie-react'

const CancelBuyOrder = ({ holding, openMarketHoldingsPortfolioTab }) => {
  const { mutate } = useSWRConfig()
  const { updateDoc } = useFrappeUpdateDoc()
  const { call: cancelBuyOrder } = useFrappePostCall(
    'rewardapp.engine.cancel_order'
  )

  // const { call: fetchHolding } = useFrappePostCall('frappe.client.')

  const [showAnimation, setShowAnimation] = useState(false)
  const [buttonState, setButtonState] = useState('idle')

  const { currentUser } = useFrappeAuth()
  const { id } = useParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [market, setMarket] = useState({})
  const { data: marketData, isLoading: marketDataLoading } = useFrappeGetDoc(
    'Market',
    holding.market_id
  )

  useEffect(() => {
    if (!marketDataLoading && marketData) {
      setMarket(marketData)
    }
  }, [marketData])

  const handleCancelBuyOrder = async () => {
    try {
      setButtonState('processing')

      await updateDoc('Orders', holding.buy_order, {
        status: 'CANCELED',
      })

      setButtonState('done')
      setShowAnimation(true)

      setTimeout(() => {
        mutate((key) => Array.isArray(key) && key[0] === 'open_market_holdings')
        mutate(
          (key) =>
            Array.isArray(key) && key[0] === 'open_market_holdings_overall'
        )
        if (openMarketHoldingsPortfolioTab === 'pending')
          mutate(
            (key) => Array.isArray(key) && key[0] === 'pending_market_holdings'
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
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} className="">
        <DrawerTrigger className="w-full h-full">
          <div className="flex items-center gap-2 border rounded-full cursor-pointer w-full text-[#2C2D32] hover:bg-[#2C2D32]/5">
            <span className="font-normal font-inter text-[10px] text-[#2C2D32] group px-1 pl-3.5">
              {holding.quantity - holding.filled_quantity} unmatched
            </span>
            <Separator orientation="vertical" className="h-8" />
            <span className="flex items-center justify-center px-1 pr-4">
              <img src={CircleCrossIcon} alt="" />
            </span>
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
          {showAnimation ? (
            <div className="flex flex-col items-center justify-center px-4 py-10">
              <Lottie animationData={CancelAnimation} loop={false} />
              <span className="text-xl mt-2 text-[#2C2D32] font-medium">
                Cancel request submitted
              </span>
            </div>
          ) : (
            <>
              <DrawerHeader className="space-y-4 px-4 py-4">
                <div className="flex justify-between items-center gap-4">
                  <DrawerTitle className="font-normal font-inter text-left text-[13px] leading-[18px] w-[90%]">
                    {market.question}
                  </DrawerTitle>
                  <DrawerDescription className="w-[10%]">
                    <img src={CricketIcon} alt="" />
                  </DrawerDescription>
                </div>
                <div
                  className="flex justify-between items-center gap-2 p-[13px] w-full border border-dashed border-[#CBCBCB] rounded-[5px]"
                  style={{ borderDasharray: '2,2' }}
                >
                  <div
                    className={`${
                      holding.opinion_type === 'YES' ? 'bg-[]' : ''
                    } ${
                      holding.opinion_type === 'NO'
                        ? 'bg-[#F6DFDD] text-[#DB342C]'
                        : 'bg-[#DBD4F0] text-[#492C82]'
                    } font-normal text-sm p-2.5`}
                  >
                    {holding.opinion_type}
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="font-normal text-xs text-[#5F5F5F]">
                      Investment
                    </p>
                    <p className="text-xs font-semibold text-[#2C2D32] font-inter">
                      &#8377;{holding.price * holding.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="font-normal text-xs text-[#5F5F5F]">
                      Quantity
                    </p>
                    <p className="text-xs font-semibold text-[#2C2D32] font-inter">
                      &#8377;{holding.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-start">
                    <p className="font-normal text-xs text-[#5F5F5F]">
                      Buy Price
                    </p>
                    <p className="text-xs font-semibold text-[#2C2D32] font-inter">
                      &#8377;{holding.price}
                    </p>
                  </div>
                </div>
              </DrawerHeader>

              <div className="overflow-y-auto flex-1 scrollbar-hide">
                <div className="flex flex-col gap-0">
                  <div className="p-4">
                    <div className="rounded-[5px] p-4 bg-white flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-[#2C2D32]">
                        Quantity
                      </span>
                      <div className="flex items-center">
                        <span className="font-inter font-bold text-sm text-[#181818]">
                          {holding.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="bg-white border flex flex-col rounded-[10px] px-4 leading-[100%]">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value="order-book"
                          className="border-none"
                        >
                          <AccordionTrigger className="hover:no-underline py-2">
                            <div className="flex gap-2.5 items-center">
                              <span className="bg-[#F6F6F6] p-2 rounded-[5px]">
                                <img src={OrderBookIcon} alt="" />
                              </span>
                              <span className="font-semibold text-sm">
                                Order Book
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <OrderBook marketId={holding.market_id} />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
                {/* Floating Swipe Button (Footer) */}
              </div>
              <DrawerFooter className="mx-auto w-full bg-white sticky bottom-0 flex flex-col">
                <button
                  className="text-white bg-[#2C2D32] rounded-[5px] py-[16px] text-sm font-medium tracking-[1px] transition-all duration-300"
                  onClick={handleCancelBuyOrder}
                >
                  Cancel
                </button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default CancelBuyOrder
