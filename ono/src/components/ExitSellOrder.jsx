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

import PencilVector from '@/assets/PencilVector.svg'

import { Slider } from '@/components/ui/slider'
import scrollbarHide from 'tailwind-scrollbar-hide'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useRef, useState } from 'react'
import {
  useFrappeAuth,
  useFrappeCreateDoc,
  useFrappeEventListener,
  useFrappeGetDoc,
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

import CricketIcon from '@/assets/Cricket.svg'
import OrderBookIcon from '@/assets/OrderBook.svg'
import { toast } from 'sonner'

const ExitSellOrder = ({ holding }) => {
  const { createDoc } = useFrappeCreateDoc()

  const { currentUser } = useFrappeAuth()
  const { id } = useParams()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
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

  //   const [isEditing, setIsEditing] = useState(false)
  //   const [tempValue, setTempValue] = useState('')
  //   const inputRef = useRef(null)

  //   useEffect(() => {
  //     if (isEditing && inputRef.current) {
  //       inputRef.current.focus()
  //       inputRef.current.select()
  //     }
  //   }, [isEditing])

  //   const startEditing = () => {
  //     setTempValue(quantity.toString())
  //     setIsEditing(true)
  //   }

  //   const saveValue = () => {
  //     const numValue = parseInt(tempValue)
  //     if (!isNaN(numValue) && numValue > 0 && numValue <= holding.quantity) {
  //       setQuantity(numValue)
  //     }
  //     setIsEditing(false)
  //   }

  //   const cancelEditing = () => {
  //     setIsEditing(false)
  //     setTempValue('')
  //   }

  //   const handleKeyDown = (e) => {
  //     if (e.key === 'Enter') {
  //       saveValue()
  //     } else if (e.key === 'Escape') {
  //       cancelEditing()
  //     }
  //   }

  //   const handleInputChange = (e) => {
  //     // Only allow numbers
  //     const value = e.target.value.replace(/[^0-9]/g, '')
  //     setTempValue(value)
  //   }

  //   const formatToFrappeLDatetime = (dateObj) => {
  //     const yyyy = dateObj.getFullYear()
  //     const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
  //     const dd = String(dateObj.getDate()).padStart(2, '0')
  //     const hh = String(dateObj.getHours()).padStart(2, '0')
  //     const mi = String(dateObj.getMinutes()).padStart(2, '0')
  //     const ss = String(dateObj.getSeconds()).padStart(2, '0')

  //     return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
  //   }

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

  const handleConfirmSell = async () => {
    try {
      const orderData = {
        market_id: holding.market_id,
        user_id: currentUser,
        order_type: 'SELL',
        quantity: holding.quantity,
        opinion_type: holding.opinion_type,
        amount: price,
      }

      const response = await createDoc('Orders', orderData)

      toast.success('Your Sell Order is successfully placed.')

      console.log('Response: ', response)

      setTimeout(() => {
        setIsDrawerOpen(false)
      }, 1000)
    } catch (err) {
      toast.error('Error occured in placing the order.')
    }
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} className="">
      <DrawerTrigger className="">
        <div className="font-medium text-xs text-[#2C2D32] border border-[#CBCBCB] rounded-[20px] py-2.5 px-7">
          Exit
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
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
              className={`${holding.opinion_type === 'YES' ? 'bg-[]' : ''} ${
                holding.opinion_type === 'NO'
                  ? 'bg-[#F6DFDD] text-[#DB342C]'
                  : 'bg-[#DBD4F0] text-[#492C82]'
              } font-normal text-sm p-2.5`}
            >
              {holding.opinion_type}
            </div>
            <div className="flex flex-col gap-2 items-start">
              <p className="font-normal text-xs text-[#5F5F5F]">Investment</p>
              <p className="text-xs font-semibold text-[#2C2D32] font-inter">
                &#8377;{holding.price * holding.quantity}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-start">
              <p className="font-normal text-xs text-[#5F5F5F]">Quantity</p>
              <p className="text-xs font-semibold text-[#2C2D32] font-inter">
                &#8377;{holding.quantity}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-start">
              <p className="font-normal text-xs text-[#5F5F5F]">Buy Price</p>
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
                    <span className="">Price</span>
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
                    {price * quantity > holding.price * holding.quantity && (
                      <span className="text-[#337265] text-xs font-semibold">
                        (&#8377;+
                        {(
                          price * quantity -
                          holding.price * holding.quantity
                        ).toFixed(1)}
                        )
                      </span>
                    )}

                    {price * quantity < holding.price * holding.quantity && (
                      <span className="text-[#DB342C] text-xs font-semibold">
                        (-&#8377;
                        {Math.abs(
                          price * quantity - holding.price * holding.quantity
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
                  <AccordionItem value="order-book" className="border-none">
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
        <DrawerFooter className="mx-auto w-full bg-white sticky bottom-0">
          <button
            className="text-white bg-[#2C2D32] hover:bg-[#2C2D32]/90 rounded-[5px] py-[18.5px] px-[162px] transition-all duration-300"
            onClick={handleConfirmSell}
          >
            Exit
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ExitSellOrder
