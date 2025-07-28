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

const ModifyCancelSellOrder = ({ holding, openMarketHoldingsPortfolioTab }) => {
  const { mutate } = useSWRConfig()
  const { updateDoc } = useFrappeUpdateDoc()
  const { call: cancelSellOrder } = useFrappePostCall(
    'rewardapp.engine.cancel_order'
  )

  const [showAnimation, setShowAnimation] = useState(false)
  const [buttonState, setButtonState] = useState('idle')

  const { currentUser } = useFrappeAuth()
  const { id } = useParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [modifyButtonState, setModifyButtonState] = useState('idle')
  const [cancelButtonState, setCancelButtonState] = useState('idle')

  const [market, setMarket] = useState({})
  const { data: marketData, isLoading: marketDataLoading } = useFrappeGetDoc(
    'Market',
    holding.market_id
  )

  const { data: userWalletData } = useFrappeGetDoc(
    'User Wallet',
    currentUser,
    currentUser ? undefined : null
  )

  const [price, setPrice] = useState(
    holding.opinion_type === 'YES' ? market.yes_price : market.no_price
  )

  const [quantity, setQuantity] = useState(2)

  useEffect(() => {
    if (!marketDataLoading && marketData) {
      setMarket(marketData)
    }
  }, [marketData])

  useEffect(() => {
    setPrice(
      holding.opinion_type === 'YES' ? market.yes_price : market.no_price
    )
  }, [market])

  const handleModifySellOrder = async () => {
    try {
      await updateDoc('Holding', holding.name, {
        exit_price: price,
      })

      mutate((key) => Array.isArray(key) && key[0] === 'open_market_holdings')
      mutate(
        (key) => Array.isArray(key) && key[0] === 'open_market_holdings_overall'
      )

      toast.success('Price modified successfully.')

      setTimeout(() => {
        setIsDrawerOpen(false)
      }, 1000)
    } catch (err) {
      toast.error('Error occured in placing the order.')
    }
  }

  const handleCancelSellOrder = async () => {
    try {
      setButtonState('processing')

      await updateDoc('Holding', holding.name, {
        status: 'ACTIVE',
      })

      setButtonState('done')
      setShowAnimation(true)

      setTimeout(() => {
        mutate((key) => Array.isArray(key) && key[0] === 'open_market_holdings')
        mutate(
          (key) =>
            Array.isArray(key) && key[0] === 'open_market_holdings_overall'
        )
        if (openMarketHoldingsPortfolioTab === 'exiting')
          mutate(
            (key) => Array.isArray(key) && key[0] === 'exiting_market_holdings'
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
        <DrawerTrigger className="">
          <div className="flex items-center gap-2 border rounded-full cursor-pointer group hover:bg-[#2C2D32]/5">
            <span className="font-normal font-inter text-[10px] text-[#2C2D32]  px-1 pl-3.5">
              {holding.quantity - holding.filled_quantity} exiting
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
                    <div className="flex flex-col gap-8 border rounded-[10px] bg-white p-4 text-sm leading-[100%] font-inter font-semibold">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="">Exit Price</span>
                          <div className="flex items-center">
                            <span className="">₹{price}</span>
                          </div>
                        </div>

                        <div className="flex justify-between gap-2">
                          <button
                            className="border rounded-[5px] bg-white border-[#D9D9D980] p-1 cursor-pointer"
                            onClick={() => {
                              setPrice(price - 0.5)
                            }}
                            disabled={price <= 0.5}
                          >
                            <Minus className="w-5 h-5" strokeWidth={2} />
                          </button>
                          <Slider
                            max={9.5}
                            min={0.5}
                            step={0.5}
                            value={[price]}
                            className={`cursor-pointer`}
                            onValueChange={(values) => {
                              setPrice(values[0])
                            }}
                          />
                          <button
                            className="border rounded-[5px] bg-white border-[#D9D9D980] p-1 cursor-pointer disabled:cursor-not-allowed"
                            onClick={() => {
                              setPrice(price + 0.5)
                            }}
                            disabled={price >= 9.5}
                          >
                            <Plus className="w-5 h-5" strokeWidth={2} />
                          </button>
                        </div>
                      </div>

                      {/* <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="">Quantity</span>
                    {isEditing ? (
                      <div>
                        <input
                          ref={inputRef}
                          type="text"
                          value={tempValue}
                          onChange={handleInputChange}
                          onBlur={saveValue}
                          onKeyDown={handleKeyDown}
                          className="max-w-min border-none font-semibold bg-white focus:outline-none text-right max-h-min h-[0.8rem]"
                          inputMode="numeric"
                        />
                      </div>
                    ) : (
                      <span onClick={startEditing} className="">
                        {quantity.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={1}
                      max={holding.quantity}
                      step={1}
                      value={[quantity]}
                      className={`cursor-pointer`}
                      onValueChange={(values) => {
                        if (values[0] <= holding.quantity)
                          setQuantity(values[0])
                      }}
                    />
                    <button
                      className="border rounded-[5px] bg-white border-[#D9D9D980] p-2.5 cursor-pointer disabled:cursor-not-allowed"
                      onClick={startEditing}
                    >
                      <img src={PencilVector} alt="" />
                    </button>
                  </div>
                </div> */}

                      <div className="w-full flex justify-between items-center pt-4 border-dashed border-t-[0.7px] text-[#2C2D32]">
                        <span className="font-normal text-xs">Exit Value</span>
                        <span className="font-inter text-xs font-medium space-x-1">
                          <span className="text-[#5F5F5F] text-xs font-semibold">
                            &#8377;{price * holding.quantity}
                          </span>
                          {price * quantity >
                            holding.price * holding.quantity && (
                            <span className="text-[#337265] text-xs font-semibold">
                              (&#8377;+
                              {(
                                price * quantity -
                                holding.price * holding.quantity
                              ).toFixed(1)}
                              )
                            </span>
                          )}

                          {price * quantity <
                            holding.price * holding.quantity && (
                            <span className="text-[#DB342C] text-xs font-semibold">
                              (-&#8377;
                              {Math.abs(
                                price * quantity -
                                  holding.price * holding.quantity
                              ).toFixed(1)}
                              )
                            </span>
                          )}
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
                  className="text-white bg-[#2C2D32] hover:bg-[#2C2D32]/90 rounded-[5px] py-[18.5px] text-sm font-medium tracking-[1px] transition-all duration-300"
                  onClick={handleModifySellOrder}
                >
                  Modify Exit
                </button>
                <button
                  className="text-[#2C2D32] hover:text-[#2C2D32]/70 rounded-[5px] py-[16px] text-sm font-medium tracking-[1px] transition-all duration-300"
                  onClick={handleCancelSellOrder}
                >
                  Cancel Exiting Qty
                </button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ModifyCancelSellOrder
