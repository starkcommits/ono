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

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SwipeButton } from './SwipeButton'
import { Slider } from '@/components/ui/slider'
import scrollbarHide from 'tailwind-scrollbar-hide'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEffect, useRef, useState } from 'react'
import {
  useFrappeAuth,
  useFrappeCreateDoc,
  useFrappeEventListener,
  useFrappeGetDoc,
  useSWRConfig,
} from 'frappe-react-sdk'
import { useLocation, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  Clock,
  Edit3,
  Ellipsis,
  Minus,
  Pencil,
  Plus,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import OrderBook from './OrderBook'

import CricketIcon from '@/assets/Cricket.svg'
import OrderBookIcon from '@/assets/OrderBook.svg'
import { DateTimePicker } from './ui/date-picker'
import { toast } from 'sonner'
import HigherQuantityDrawer from './HigherQuantityDrawer'
import { trackEvent } from '../analytics/ga'

const BuyDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  selectedChoice,
  setSelectedChoice,
  marketId,
}) => {
  const { createDoc, isLoading } = useFrappeCreateDoc()
  const { currentUser } = useFrappeAuth()
  const { id } = useParams()
  const location = useLocation()
  const { mutate } = useSWRConfig()
  const [market, setMarket] = useState({})
  const { data: marketData, isLoading: marketDataLoading } = useFrappeGetDoc(
    'Market',
    marketId || id
  )

  const { data: userWalletData, isLoading: userWalletDataLoading } =
    useFrappeGetDoc('User Wallet', currentUser, currentUser ? undefined : null)

  const [price, setPrice] = useState(
    selectedChoice === 'YES' ? marketData?.yes_price : marketData?.no_price
  )

  const [quantity, setQuantity] = useState(2)

  const [selectedDateTime, setSelectedDateTime] = useState(null)
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const [bookProfitEnabled, setBookProfitEnabled] = useState(false)
  const [autoCancelEnabled, setAutoCancelEnabled] = useState(false)

  const [stopLossValue, setStopLossValue] = useState(price - 0.5)
  const [bookProfitValue, setBookProfitValue] = useState(price + 0.5)

  const [stopLossError, setStopLossError] = useState('')
  const [bookProfitError, setBookProfitError] = useState('')

  // Added state to control the swipe button from this component
  const [isSwipeSwiped, setIsSwipeSwiped] = useState(false)
  const [isOrderProcessing, setIsOrderProcessing] = useState(false)
  const [hasOrderError, setHasOrderError] = useState(false)

  /*handling quantity adjustment logic */
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState('')
  const inputRef = useRef(null)

  const [maxQuantity, setMaxQuantity] = useState(market.max_allowed_quantity)

  useEffect(() => {
    setMaxQuantity(market.max_allowed_quantity || 5)
  }, [market.max_allowed_quantity])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const startEditing = () => {
    setTempValue(quantity.toString())
    setIsEditing(true)
  }

  const saveValue = () => {
    const numValue = parseInt(tempValue)
    if (
      !isNaN(numValue) &&
      numValue > 0 &&
      numValue <= market.max_allowed_quantity
    ) {
      setQuantity(numValue)
    }
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setTempValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveValue()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  const handleInputChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '')
    setTempValue(value)
  }

  const handleBadgeClick = (minutes) => {
    // Calculate future time based on current time + minutes
    const futureTime = new Date()
    futureTime.setMinutes(futureTime.getMinutes() + minutes)
    setSelectedDateTime(futureTime)
  }

  const formatToFrappeLDatetime = (dateObj) => {
    const yyyy = dateObj.getFullYear()
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
    const dd = String(dateObj.getDate()).padStart(2, '0')
    const hh = String(dateObj.getHours()).padStart(2, '0')
    const mi = String(dateObj.getMinutes()).padStart(2, '0')
    const ss = String(dateObj.getSeconds()).padStart(2, '0')

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
  }

  useEffect(() => {
    if (!marketDataLoading && Object.values(marketData)) {
      setMarket(marketData)
    }
  }, [marketData])

  useEffect(() => {
    setPrice(
      selectedChoice === 'YES' ? marketData?.yes_price : marketData?.no_price
    )
  }, [marketData])

  useFrappeEventListener('market_event', (updatedData) => {
    console.log('Hello: ', updatedData)
    if (updatedData.name !== market.name) return
    console.log('Updated Data: ', updatedData)
    setMarket(updatedData)
  })

  useEffect(() => {
    // Reset stop loss value when price changes
    setStopLossValue(price - 0.5)

    // Reset book profit value when price changes
    setBookProfitValue(price + 0.5)
  }, [price, selectedChoice])

  console.log(maxQuantity)

  const handleConfirmBuy = async () => {
    if (isOrderProcessing) return // Prevent multiple submissions

    setIsOrderProcessing(true)
    setHasOrderError(false)
    setIsOrderProcessing(true)

    try {
      const orderData = {
        market_id: marketId,
        user_id: currentUser,
        order_type: 'BUY',
        quantity: quantity,
        opinion_type: selectedChoice,
        amount: price,
      }

      if (stopLossEnabled) {
        orderData.stop_loss = true
        orderData.loss_price = stopLossValue
      }

      // Add book profit if enabled
      if (bookProfitEnabled) {
        orderData.book_profit = true
        orderData.profit_price = bookProfitValue
      }

      if (autoCancelEnabled) {
        orderData.auto_cancel = autoCancelEnabled
        orderData.cancel_time = formatToFrappeLDatetime(selectedDateTime)
      }

      console.log('asdasdasdasd', orderData)

      await createDoc('Orders', orderData)

      if (location.pathname.startsWith('/fixture'))
        mutate(
          (key) => Array.isArray(key) && key[0] === 'open_marketwise_holdings'
        )

      setIsSwipeSwiped(true)

      toast.success('Your Order is successfully placed.')

      console.log(orderData)

      setTimeout(() => {
        setIsDrawerOpen(false)
      }, 1000)
      trackEvent({
        category: 'Order',
        action: 'Placed Buy Order',
        label: `Market: ${market.name}, Choice: ${selectedChoice}, Price: ${price}, Quantity: ${quantity}, User: ${currentUser}`,
      })
    } catch (err) {
      setHasOrderError(true)
      toast.error('Error occured in placing the order.')
      console.error('Order creation error:', err)
    } finally {
      setIsOrderProcessing(false)
    }
  }

  const handleErrorReset = () => {
    setHasOrderError(false)
  }

  console.log('selectedChoice: ', selectedChoice)

  useEffect(() => {
    if (!isDrawerOpen) {
      setIsSwipeSwiped(false)
      setHasOrderError(false)
      setIsOrderProcessing(false)
    }
  }, [isDrawerOpen])
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} className="">
      <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
        <DrawerHeader className="p-0 pb-2">
          <div className="flex justify-between items-center gap-4 px-4">
            <DrawerTitle className="font-normal font-inter text-left text-[13px] leading-[18px] w-[90%]">
              {market.question}
            </DrawerTitle>
            <DrawerDescription className="w-[10%]">
              <img src={CricketIcon} alt="" />
            </DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="p-4">
          <Tabs defaultValue={selectedChoice} className="w-full">
            <TabsList className="w-full rounded-full text-[#2C2D32] p-0 h-8">
              <TabsTrigger
                value="YES"
                className="w-full font-inter px-10 py-[5px] rounded-l-full data-[state=active]:text-[#EFF0FF] data-[state=active]:bg-[#492C82] text-[13px] font-light h-auto"
                onClick={() => {
                  setSelectedChoice('YES')
                }}
              >
                YES &#8377;{market.yes_price}
              </TabsTrigger>
              <TabsTrigger
                value="NO"
                className="w-full font-inter px-10 py-[5px] rounded-r-full data-[state=active]:text-[#EFF0FF] data-[state=active]:bg-[#E26F64] text-[13px] font-light"
                onClick={() => {
                  setSelectedChoice('NO')
                }}
              >
                NO &#8377;{market.no_price}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="overflow-y-auto scrollbar-hide mb-36">
          <div className="flex flex-col gap-0">
            <div className="p-4">
              <div className="flex flex-col gap-8 border rounded-[10px] bg-white p-4 text-sm leading-[100%] font-inter font-semibold">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="">Price</span>
                    <div className="flex items-center">
                      <span className="">₹{price?.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    <button
                      className="border rounded-5px bg-white border-[#D9D9D980] p-1 cursor-pointer"
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
                      className="border rounded-5px bg-white border-[#D9D9D980] p-1 cursor-pointer disabled:cursor-not-allowed"
                      onClick={() => {
                        setPrice(price + 0.5)
                      }}
                      disabled={price >= 9.5}
                    >
                      <Plus className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
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
                        {quantity}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <HigherQuantityDrawer
                      quantity={quantity}
                      setQuantity={setQuantity}
                      market={market}
                      userWalletData={userWalletData}
                      price={price}
                      maxQuantity={maxQuantity}
                      setMaxQuantity={setMaxQuantity}
                    />

                    <Slider
                      max={maxQuantity}
                      min={1}
                      step={1}
                      value={[quantity]}
                      className={`cursor-pointer`}
                      onValueChange={(values) => {
                        // console.log('Value:', values[0])
                        // console.log('Max:', market.max_allowed_quantity)

                        if (values[0] <= market.max_allowed_quantity)
                          setQuantity(values[0])
                      }}
                    />
                    <button
                      className="border rounded-5px bg-white border-[#D9D9D980] p-1 cursor-pointer disabled:cursor-not-allowed"
                      onClick={startEditing}
                    >
                      <Pencil className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div>
                  <Separator />
                </div>

                <div className="flex justify-between px-14 font-inter leading-[100%]">
                  <div className="flex flex-col gap-1 items-center">
                    <span className="font-semibold text-[20px] text-[#2C2D32]">
                      {parseFloat(price * quantity).toFixed(1)}
                    </span>
                    <span className="font-normal text-xs">You put in</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-[#1C895E] font-semibold text-[20px] ">
                      {parseFloat(quantity * 10).toFixed(1)}
                    </span>
                    <span className="font-normal text-xs">You get</span>
                  </div>
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
                      <OrderBook marketId={marketId || id} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="p-0 px-4">
              <div className="flex flex-col leading-[100%] font-inter">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="order-book" className="border-none">
                    <AccordionTrigger className="hover:no-underline flex justify-center gap-2">
                      <div className="flex gap-2.5 items-center">
                        <span className="font-semibold text-sm">
                          Advanced Options
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="bg-white border rounded-[10px] px-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between py-[13px]">
                            <Label htmlFor="stop-loss" className="">
                              <div className="flex items-center gap-[13px]">
                                <span className="bg-[#E1FEF1] text-[#1C895E] font-semibold text-xs px-2 py-[7px]">
                                  SL
                                </span>

                                <span className="text-sm font-semibold">
                                  Stop Loss
                                </span>
                                {/* {stopLossError ? (
                        <div className="flex items-center gap-2 bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-md shadow-sm">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold">{stopLossError}</span>
                        </div>
                      ) : null} */}
                              </div>
                            </Label>
                            <Switch
                              id="stop-loss"
                              checked={stopLossEnabled}
                              onCheckedChange={setStopLossEnabled}
                            />
                          </div>
                          {stopLossEnabled && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-[500]">
                                  Price
                                </span>
                                <span className="text-lg font-medium flex items-center gap-4 justify-between">
                                  <button
                                    className="focus:outline-none w-[30%] rounded-[5px] border border-[#CBCBCB] p-1"
                                    disabled={stopLossValue <= 0.5}
                                    onClick={() => {
                                      if (stopLossValue > 0.5) {
                                        setStopLossValue(stopLossValue - 0.5)
                                      }
                                    }}
                                  >
                                    <Minus
                                      className={`h-4 w-4 ${
                                        stopLossValue <= 0.5
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-[#1A7BFE] cursor-pointer'
                                      }`}
                                      strokeWidth={1.5}
                                    />
                                  </button>
                                  <span className="w-[40%]">
                                    {parseFloat(stopLossValue).toFixed(1)}
                                  </span>
                                  <button
                                    className="focus:outline-none w-[30%] rounded-[5px] border border-[#CBCBCB] p-1"
                                    disabled={stopLossValue + 0.5 >= price}
                                    onClick={() => {
                                      if (stopLossValue + 0.5 < price) {
                                        setStopLossValue(stopLossValue + 0.5)
                                      }
                                    }}
                                  >
                                    <Plus
                                      className={`h-4 w-4 ${
                                        stopLossValue + 0.5 >= price
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-[#1A7BFE] cursor-pointer'
                                      }`}
                                      strokeWidth={1.5}
                                    />
                                  </button>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between py-[13px]">
                            <Label htmlFor="book-profit" className="">
                              <div className="flex items-center gap-[13px]">
                                <span className="bg-[#FFF0F7] text-[#DB342C] font-semibold text-xs px-2 py-[7px]">
                                  BP
                                </span>

                                <span className="text-sm font-semibold">
                                  Book Profit
                                </span>
                                {/* {stopLossError ? (
                        <div className="flex items-center gap-2 bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-md shadow-sm">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold">{stopLossError}</span>
                        </div>
                      ) : null} */}
                              </div>
                            </Label>
                            <Switch
                              id="book-profit"
                              checked={bookProfitEnabled}
                              onCheckedChange={setBookProfitEnabled}
                            />
                          </div>
                          {bookProfitEnabled && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-[500]">
                                  Price
                                </span>
                                <span className="text-lg font-medium flex items-center gap-4 justify-between">
                                  <button
                                    className="focus:outline-none w-[30%] rounded-[5px] border border-[#CBCBCB] p-1"
                                    disabled={bookProfitValue <= price + 0.5}
                                    onClick={() => {
                                      if (bookProfitValue > price + 0.5) {
                                        setBookProfitValue(
                                          bookProfitValue - 0.5
                                        )
                                      }
                                    }}
                                  >
                                    <Minus
                                      className={`h-4 w-4 ${
                                        bookProfitValue <= price + 0.5
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-[#1A7BFE] cursor-pointer'
                                      }`}
                                      strokeWidth={1.5}
                                    />
                                  </button>
                                  <span className="w-[40%]">
                                    {parseFloat(bookProfitValue).toFixed(1)}
                                  </span>
                                  <button
                                    className="focus:outline-none w-[30%] rounded-[5px] border border-[#CBCBCB] p-1"
                                    disabled={bookProfitValue >= 9.5}
                                    onClick={() => {
                                      if (bookProfitValue < 9.5) {
                                        setBookProfitValue(
                                          bookProfitValue + 0.5
                                        )
                                      }
                                    }}
                                  >
                                    <Plus
                                      className={`h-4 w-4 ${
                                        bookProfitValue >= 9.5
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-[#1A7BFE] cursor-pointer'
                                      }`}
                                      strokeWidth={1.5}
                                    />
                                  </button>
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 ">
                          <div className="flex items-center justify-between py-[13px]">
                            <Label htmlFor="auto-cancel" className="">
                              <div className="flex items-center gap-[13px]">
                                <span className="bg-[#E8F1FF] text-[#007AFF] font-semibold text-xs px-2 py-[7px]">
                                  AC
                                </span>

                                <span className="text-sm font-semibold">
                                  Auto Cancel
                                </span>
                                {/* {stopLossError ? (
                        <div className="flex items-center gap-2 bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-md shadow-sm">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="font-semibold">{stopLossError}</span>
                        </div>
                      ) : null} */}
                              </div>
                            </Label>
                            <Switch
                              id="auto-cancel"
                              checked={autoCancelEnabled}
                              onCheckedChange={setAutoCancelEnabled}
                            />
                          </div>

                          {autoCancelEnabled && (
                            <div className="flex flex-col gap-4">
                              <div className="flex justify-between items-center">
                                <span className="font-[500] text-sm text-[#2C2D32]">
                                  Time
                                </span>
                                <div className="flex items-center gap-1">
                                  {selectedDateTime && (
                                    <span className="font-[500] text-sm">
                                      {selectedDateTime.toLocaleDateString(
                                        undefined,
                                        {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                        }
                                      )}
                                      {' | '}
                                      {selectedDateTime.toLocaleTimeString(
                                        undefined,
                                        {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        }
                                      )}
                                    </span>
                                  )}
                                  <div>
                                    <DateTimePicker
                                      value={selectedDateTime}
                                      onChange={setSelectedDateTime}
                                      placeholder="Select date and time..."
                                      disabled={setAutoCancelEnabled}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className=" flex items-center justify-between mb-4">
                                {/*  make three badges here for 1 minute 3 minutes and 5 minutes */}
                                <button
                                  onClick={() => handleBadgeClick(1)}
                                  className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                                >
                                  1 min
                                </button>
                                <button
                                  onClick={() => handleBadgeClick(2)}
                                  className="px-2.5 py-2 text-sm rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                                >
                                  2 min
                                </button>
                                <button
                                  onClick={() => handleBadgeClick(3)}
                                  className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                                >
                                  3 min
                                </button>
                                <button
                                  onClick={() => handleBadgeClick(5)}
                                  className="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                                >
                                  5 min
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
          {/* Floating Swipe Button (Footer) */}
          <DrawerFooter className="mx-auto w-full pb-12 fixed bottom-0 space-y-2 bg-white">
            <div className="flex justify-between items-center font-normal text-[10px] leading-[100%] text-[#5F5F5F] px-4">
              <div className="flex items-center gap-0.5">
                <span className="">Available Balance:</span>
                <span className="font-inter">
                  &#8377; {userWalletData?.balance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <span>Commission: </span>
                <span className="font-inter">20.0%</span>
              </div>
            </div>
            <div className="px-2">
              <SwipeButton
                fullWidth={true}
                text={
                  selectedChoice === 'YES' ? 'Swipe for Yes' : 'Swipe for No'
                }
                className="py-[18px] px-4"
                startColor={selectedChoice === 'YES' ? '#492C82' : '#E26F64'}
                endColor={selectedChoice === 'YES' ? '#34C759' : '#34C759'}
                handleConfirmBuy={handleConfirmBuy}
                swiped={isSwipeSwiped}
                onSwipedChange={setIsSwipeSwiped}
                isProcessing={isOrderProcessing}
                hasError={hasOrderError}
                onErrorReset={handleErrorReset}
              />
            </div>

            {/* <Button>Submit</Button> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default BuyDrawer
