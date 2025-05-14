import React, { useState, useEffect } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import {
  useFrappeAuth,
  useFrappeCreateDoc,
  useFrappeGetDoc,
} from 'frappe-react-sdk'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import OrderBook from './OrderBook'
import toast from 'react-hot-toast'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Minus, Plus } from 'lucide-react'
import { DateTimePicker } from './ui/date-picker'

const BuyTradeSheet = ({
  marketId,
  market,
  choice,
  setSelectedChoice,
  isSheetOpen,
  setIsSheetOpen,
}) => {
  const { createDoc, isLoading: createDocLoading } = useFrappeCreateDoc()

  const { currentUser } = useFrappeAuth()

  const { data: userData, isLoading: userDataLoading } = useFrappeGetDoc(
    'User Wallet',
    currentUser,
    currentUser ? undefined : null
  )

  console.log('MArket', choice, market)
  const [price, setPrice] = useState(
    choice === 'YES' ? market.yes_price : market.no_price
  )
  const [quantity, setQuantity] = useState(10)
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const [bookProfitEnabled, setBookProfitEnabled] = useState(false)
  const [autoCancelEnabled, setAutoCancelEnabled] = useState(false)

  const [stopLossValue, setStopLossValue] = useState(price - 0.5)
  const [bookProfitValue, setBookProfitValue] = useState(price + 0.5)

  const [stopLossError, setStopLossError] = useState('')
  const [bookProfitError, setBookProfitError] = useState('')

  useEffect(() => {
    // Reset stop loss value when price changes
    setStopLossValue(price - 0.5)

    // Reset book profit value when price changes
    setBookProfitValue(price + 0.5)
  }, [price, choice])

  console.log('heheheheheh', userData?.balance < price * quantity)

  const handleConfirmBuy = async () => {
    try {
      const orderData = {
        market_id: marketId,
        order_type: 'BUY',
        quantity: quantity,
        opinion_type: choice,
        amount: price,
        sell_order_id: '',
        buy_order_id: '',
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

      await createDoc('Orders', orderData)

      toast.success(`Buy Order Placed.`)

      console.log(orderData)

      setIsSheetOpen(false)
    } catch (err) {
      toast.error(`Error in placing buy order.`)
      console.error('Order creation error:', err)
    }
  }

  console.log(price, stopLossValue, bookProfitValue)

  return (
    <Drawer open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <DrawerContent className="max-h-full flex flex-col">
        {/* Rest of the existing code remains the same */}
        <div className="p-4 overflow-y-auto">
          <Tabs defaultValue={choice} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger
                value="YES"
                className="w-[50%]"
                onClick={() => {
                  setSelectedChoice('YES')
                }}
              >
                YES &#8377;{market.yes_price}
              </TabsTrigger>
              <TabsTrigger
                value="NO"
                className="w-[50%]"
                onClick={() => {
                  setSelectedChoice('NO')
                }}
              >
                NO &#8377;{market.no_price}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mb-6 mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium">Price</span>
              <div className="flex items-center">
                <span className="text-lg font-medium">₹{price}</span>
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <Slider
                max={9.5}
                min={0.5}
                step={0.5}
                value={[price]}
                className={``}
                onValueChange={(values) => {
                  setPrice(values[0])
                }}
              />
              {/* <button
                  onClick={() => handlePriceChange(price + 0.5)}
                  className="p-2 active:bg-gray-100 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button> */}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium">Quantity</span>
              <span className="text-lg font-medium">{quantity}</span>
            </div>
            {/* <ReactSlider
                      className="horizontal-slider"
                      min={1}
                      max={maxQuantity}
                      value={quantity}
                      onChange={setQuantity}
                    /> */}
            <Slider
              defaultValue={[1]}
              max={50}
              min={1}
              step={1}
              value={[quantity]}
              className={``}
              onValueChange={(values) => {
                setQuantity(values[0])
              }}
            />
          </div>

          <div className="flex justify-between mb-4 text-lg">
            {/* <div>
                <p className="text-gray-500">You put</p>
                <p className="font-medium">₹{totalCost.toFixed(1)}</p>
              </div> */}
            {/* <div className="text-right">
                <p className="text-gray-500">You get</p>
                <p className="font-medium text-green-600">
                  ₹{potentialWinnings.toFixed(1)}
                </p>
              </div> */}
          </div>

          <Accordion type="multiple" collapsible className="w-full">
            <AccordionItem value="order-book" className="border-none">
              <AccordionTrigger className="hover:no-underline">
                Order Book
              </AccordionTrigger>
              <AccordionContent>
                <OrderBook marketId={marketId} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="advanced-options" className="border-none">
              <AccordionTrigger className="hover:no-underline">
                Advanced Options
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stop-loss" className="text-lg font-medium">
                      <div className="flex items-center gap-4">
                        Stop Loss{' '}
                        {stopLossError ? (
                          <div className="flex items-center gap-2 bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-md shadow-sm">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="font-semibold">
                              {stopLossError}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </Label>
                    <Switch
                      id="stop-loss"
                      checked={stopLossEnabled}
                      onCheckedChange={setStopLossEnabled}
                    />
                  </div>
                  {stopLossEnabled && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-md text-muted-foreground">
                          Set stop Loss Price
                        </span>
                        <span className="text-lg font-medium flex items-center gap-4 justify-between">
                          <button
                            className="p-0 focus:outline-none w-[30%]"
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
                                  : 'text-current cursor-pointer'
                              }`}
                              strokeWidth={1.5}
                            />
                          </button>
                          <span className="w-[40%]">
                            {parseFloat(stopLossValue).toFixed(1)}
                          </span>
                          <button
                            className="p-0 focus:outline-none w-[30%]"
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
                                  : 'text-current cursor-pointer'
                              }`}
                              strokeWidth={1.5}
                            />
                          </button>
                        </span>
                      </div>
                      {/* <Slider
                        max={9.5}
                        min={0.5}
                        step={0.5}
                        value={[stopLossValue]}
                        className={``}
                        onValueChange={(values) => {
                          if (values[0] < price) {
                            setStopLossValue(values[0])
                            setStopLossError('')
                          } else {
                            setStopLossError(
                              "Can't set it above your buy price"
                            )
                          }
                        }}
                      /> */}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 my-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="book-profit"
                      className="text-lg font-medium"
                    >
                      Book Profit
                    </Label>
                    <Switch
                      id="book-profit"
                      checked={bookProfitEnabled}
                      onCheckedChange={setBookProfitEnabled}
                    />
                  </div>
                  {bookProfitEnabled && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-md text-muted-foreground">
                          Set Book Profit Price
                        </span>
                        <span className="text-lg font-medium flex items-center gap-4 justify-between">
                          <button
                            className="p-0 focus:outline-none w-[30%]"
                            disabled={bookProfitValue <= price + 0.5}
                            onClick={() => {
                              if (bookProfitValue > price + 0.5) {
                                setBookProfitValue(bookProfitValue - 0.5)
                              }
                            }}
                          >
                            <Minus
                              className={`h-4 w-4 ${
                                bookProfitValue <= price + 0.5
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-current cursor-pointer'
                              }`}
                              strokeWidth={1.5}
                            />
                          </button>
                          <span className="w-[40%]">
                            {parseFloat(bookProfitValue).toFixed(1)}
                          </span>
                          <button
                            className="p-0 focus:outline-none w-[30%]"
                            disabled={bookProfitValue >= 9.5}
                            onClick={() => {
                              if (bookProfitValue < 9.5) {
                                setBookProfitValue(bookProfitValue + 0.5)
                              }
                            }}
                          >
                            <Plus
                              className={`h-4 w-4 ${
                                bookProfitValue >= 9.5
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-current cursor-pointer'
                              }`}
                              strokeWidth={1.5}
                            />
                          </button>
                        </span>
                      </div>
                    </div>
                  )}
                  {/* {bookProfitEnabled && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-md text-muted-foreground">
                          Book Profit Price
                        </span>
                        <span className="text-lg font-medium">
                          {bookProfitValue}
                        </span>
                      </div>

                      <Slider
                        max={9.5}
                        min={0.5}
                        step={0.5}
                        value={[bookProfitValue]}
                        className={``}
                        onValueChange={(values) => {
                          if (values[0] > price) setBookProfitValue(values[0])
                        }}
                      />
                    </div>
                  )} */}
                </div>

                <div className="flex flex-col gap-2 my-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 w-[30%]">
                      <Checkbox
                        id="auto-cancel"
                        checked={autoCancelEnabled}
                        onCheckedChange={setAutoCancelEnabled}
                      />
                      <Label
                        htmlFor="auto-cancel"
                        className="text-lg font-medium"
                      >
                        Auto Cancel
                      </Label>
                    </div>
                    <div className="w-[20%]">
                      <DateTimePicker disabled={autoCancelEnabled} />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm mb-4 ">
            <div className="text-gray-700 font-medium">
              Available Balance:{' '}
              <span className="text-blue-600 font-semibold">
                ₹{userData?.balance}
              </span>
            </div>
            {userData?.balance < price * quantity && (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
                  />
                </svg>
                <span className="text-sm text-red-600 font-semibold">
                  Insufficient balance. Please add funds to continue.
                </span>
              </div>
            )}
          </div>

          <button
            disabled={userData?.balance < price * quantity || createDocLoading}
            onClick={handleConfirmBuy}
            className={`relative w-full ${
              choice === 'YES' ? 'bg-blue-500' : 'bg-red-500'
            } text-white py-4 rounded-xl font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60
              ${createDocLoading ? `opacity-50 cursor-not-allowed` : ``}`}
          >
            {createDocLoading
              ? 'Processing...'
              : `Confirm ${choice === 'YES' ? 'YES' : 'NO'}`}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default BuyTradeSheet
