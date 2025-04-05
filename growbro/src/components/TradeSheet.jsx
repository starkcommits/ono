import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Book, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useFrappeCreateDoc, useFrappeUpdateDoc } from 'frappe-react-sdk'
import { Slider } from '@/components/ui/slider'
import OrderBook from './OrderBook'
import toast from 'react-hot-toast'

const TradeSheet = ({
  marketId,
  marketPrice,
  choice,
  onClose,
  tradeAction,
  sellQuantity,
  previousOrderId,
  refetchActiveOrders,
}) => {
  console.log('Refetch: ', refetchActiveOrders)
  const { createDoc, isLoading: createDocLoading } = useFrappeCreateDoc()
  const { updateDoc } = useFrappeUpdateDoc()
  const { id } = useParams()

  const sheetRef = useRef(null)
  const dragRef = useRef({
    isDragging: false,
    startY: 0,
    currentY: 0,
  })

  const [sheetState, setSheetState] = useState({
    translateY: 0,
    isClosing: false,
    isDragging: false,
  })
  const [price, setPrice] = useState(marketPrice)
  const [quantity, setQuantity] = useState(
    tradeAction === 'SELL' ? sellQuantity : 10
  )

  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [isClosing, setIsClosing] = useState(false)

  const maxPrice = 9.5
  const minPrice = 0.5
  const maxQuantity = 100
  const commission = 0.2
  const availableBalance = 214.86

  const handleConfirmBuy = async () => {
    try {
      const orderData = {
        market_id: marketId,
        order_type: tradeAction,
        quantity: quantity,
        opinion_type: choice,
        amount: price,
      }

      await createDoc('Orders', orderData)
      toast.success(`Buy Order Placed.`)
      console.log(orderData)

      onClose()
    } catch (err) {
      toast.error(`Error in placing buy order.`)
      console.error('Order creation error:', err)
    }
  }

  const handleConfirmSell = async () => {
    try {
      const orderData = {
        market_id: marketId,
        order_type: tradeAction,
        quantity: quantity,
        opinion_type: choice,
        amount: price,
        filled_quantity: 0,
        status: 'UNMATCHED',
      }

      console.log('90th:', orderData)

      const newSellOrder = await createDoc('Orders', orderData)
      console.log('sell order', newSellOrder)
      await updateDoc('Orders', previousOrderId, {
        sell_order_id: newSellOrder.name,
      })
      refetchActiveOrders()

      toast.success(`Sell Order Placed.`)

      onClose()
    } catch (err) {
      console.error('Order creation error:', err)
      toast.error(`Error in placing the order.`)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Optimized touch handlers that don't cause re-renders during dragging
  const handleTouchStart = useCallback((e) => {
    dragRef.current.isDragging = true
    dragRef.current.startY = e.touches[0].clientY
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!dragRef.current.isDragging) return

    const touch = e.touches[0]
    const diff = touch.clientY - dragRef.current.startY

    if (diff > 0) {
      dragRef.current.currentY = diff
      // Apply transform directly to DOM instead of through state
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${diff}px)`
        sheetRef.current.style.transition = 'none'
      }
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    const currentY = dragRef.current.currentY

    if (currentY > 150) {
      // Only set state once when closing
      setSheetState((prev) => ({ ...prev, isClosing: true }))

      // Apply closing animation directly to DOM
      if (sheetRef.current) {
        sheetRef.current.style.opacity = '0'
        sheetRef.current.style.transform = `translateY(${currentY + 100}px)`
        sheetRef.current.style.transition =
          'transform 0.2s ease-out, opacity 0.2s ease-out'
      }

      setTimeout(onClose, 200)
    } else {
      // Reset without state update
      if (sheetRef.current) {
        sheetRef.current.style.transform = 'translateY(0)'
        sheetRef.current.style.transition = 'transform 0.2s ease-out'
      }
    }

    dragRef.current.isDragging = false
    dragRef.current.currentY = 0
  }, [onClose])

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        setSheetState((prev) => ({ ...prev, isClosing: true }))

        if (sheetRef.current) {
          sheetRef.current.style.opacity = '0'
          sheetRef.current.style.transform = 'translateY(100px)'
          sheetRef.current.style.transition =
            'transform 0.2s ease-out, opacity 0.2s ease-out'
        }

        setTimeout(onClose, 200)
      }
    },
    [onClose]
  )
  const adjustPrice = (newPrice) => {
    // Round to nearest 0.5
    const rounded = Math.round(newPrice * 2) / 2
    return Math.min(Math.max(rounded, minPrice), maxPrice)
  }

  const handlePriceChange = (newPrice) => {
    setPrice(adjustPrice(newPrice))
  }

  const totalCost = price * quantity
  const potentialWinnings =
    choice === 'yes'
      ? totalCost * (1 / price) * (1 - commission)
      : totalCost * (1 / (10 - price)) * (1 - commission)

  const stopPropagation = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${currentY}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          opacity: isClosing ? 0 : 1,
        }}
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden"
        onClick={stopPropagation}
      >
        {/* Rest of the existing code remains the same */}
        <div className="p-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium">Price</span>
              <div className="flex items-center">
                <span className="text-lg font-medium">₹{price}</span>
                {/* <span className="text-sm text-gray-500 ml-2">
                  109 qty available
                </span> */}
              </div>
            </div>
            {/* <ReactSlider
              className="horizontal-slider"
              min={minPrice}
              max={maxPrice}
              step={0.5}
              value={price}
              onChange={handlePriceChange}
            /> */}

            <div className="flex justify-between mt-2">
              <button
                onClick={() => handlePriceChange(price - 0.5)}
                className="p-2 active:bg-gray-100 rounded-lg transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePriceChange(price + 0.5)}
                className="p-2 active:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {tradeAction === 'BUY' && (
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
          )}
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

          <OrderBook marketId={marketId} />

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>Available Balance: ₹{availableBalance}</span>
            <span>Commission: {(commission * 100).toFixed(1)}%</span>
          </div>

          {tradeAction === 'BUY' && (
            <button
              onClick={handleConfirmBuy}
              disabled={createDocLoading}
              className={`w-full bg-blue-500 text-white py-4 rounded-xl font-medium transition-colors 
        ${
          createDocLoading
            ? 'opacity-50 cursor-not-allowed'
            : 'active:bg-blue-600'
        }`}
            >
              {createDocLoading
                ? 'Processing...'
                : `Confirm ${choice === 'YES' ? 'YES' : 'NO'}`}
            </button>
          )}
          {tradeAction === 'SELL' && (
            <button
              onClick={handleConfirmSell}
              disabled={createDocLoading}
              className={`w-full bg-blue-500 text-white py-4 rounded-xl font-medium transition-colors 
        ${
          createDocLoading
            ? 'opacity-50 cursor-not-allowed'
            : 'active:bg-blue-600'
        }`}
            >
              {createDocLoading
                ? 'Processing...'
                : `Confirm ${choice === 'YES' ? 'YES' : 'NO'}`}
            </button>
          )}
          <p className="text-xs text-gray-500 text-center mt-4">
            Sale or purchase of Crypto Currency or Digital Assets is neither
            encouraged nor allowed on this platform
          </p>
        </div>
      </div>
    </div>
  )
}

export default TradeSheet

// import React, { useState, useRef, useEffect } from 'react'
// import { Book, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react'
// // import ReactSlider from 'react-slider'

// const TradeSheet = ({ market, choice, onClose }) => {
//   const sheetRef = useRef(null)
//   const [price, setPrice] = useState(4.5)
//   const [quantity, setQuantity] = useState(10)
//   const [isDragging, setIsDragging] = useState(false)
//   const [startY, setStartY] = useState(0)
//   const [currentY, setCurrentY] = useState(0)
//   const [isClosing, setIsClosing] = useState(false)

//   const maxPrice = 9.5
//   const minPrice = 0.5
//   const maxQuantity = 100
//   const commission = 0.2
//   const availableBalance = 214.86

//   const orderBook = [
//     { price: 4.5, yesQty: 109, noQty: 80 },
//     { price: 5.5, yesQty: 78, noQty: 325 },
//     { price: 6.0, yesQty: 5, noQty: 168 },
//   ]

//   useEffect(() => {
//     document.body.style.overflow = 'hidden'
//     return () => {
//       document.body.style.overflow = ''
//     }
//   }, [])

//   const handleTouchStart = (e) => {
//     setIsDragging(true)
//     setStartY(e.touches[0].clientY)
//   }

//   const handleTouchMove = (e) => {
//     if (!isDragging) return
//     const touch = e.touches[0]
//     const diff = touch.clientY - startY
//     if (diff > 0) {
//       setCurrentY(diff)
//     }
//   }

//   const handleTouchEnd = () => {
//     if (currentY > 150) {
//       setIsClosing(true)
//       setTimeout(onClose, 200)
//     } else {
//       setCurrentY(0)
//     }
//     setIsDragging(false)
//   }

//   const adjustPrice = (newPrice) => {
//     // Round to nearest 0.5
//     const rounded = Math.round(newPrice * 2) / 2
//     return Math.min(Math.max(rounded, minPrice), maxPrice)
//   }

//   const handlePriceChange = (newPrice) => {
//     setPrice(adjustPrice(newPrice))
//   }

//   const totalCost = price * quantity
//   const potentialWinnings =
//     choice === 'yes'
//       ? totalCost * (1 / price) * (1 - commission)
//       : totalCost * (1 / (10 - price)) * (1 - commission)

//   return (
//     <div className="fixed inset-0 z-50 bg-black/50">
//       <div
//         ref={sheetRef}
//         onTouchStart={handleTouchStart}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleTouchEnd}
//         style={{
//           transform: `translateY(${currentY}px)`,
//           transition: isDragging ? 'none' : 'transform 0.2s ease-out',
//           opacity: isClosing ? 0 : 1,
//         }}
//         className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden"
//       >
//         <div className="p-4">
//           <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-lg font-medium">Price</span>
//               <div className="flex items-center">
//                 <span className="text-lg font-medium">
//                   ₹ {price.toFixed(1)}
//                 </span>
//                 <span className="text-sm text-gray-500 ml-2">
//                   109 qty available
//                 </span>
//               </div>
//             </div>
//             {/* <ReactSlider
//               className="horizontal-slider"
//               min={minPrice}
//               max={maxPrice}
//               step={0.5}
//               value={price}
//               onChange={handlePriceChange}
//             /> */}
//             <div className="flex justify-between mt-2">
//               <button
//                 onClick={() => handlePriceChange(price - 0.5)}
//                 className="p-2 active:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <Minus className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={() => handlePriceChange(price + 0.5)}
//                 className="p-2 active:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <Plus className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-lg font-medium">Quantity</span>
//               <span className="text-lg font-medium">{quantity}</span>
//             </div>
//             {/* <ReactSlider
//               className="horizontal-slider"
//               min={1}
//               max={maxQuantity}
//               value={quantity}
//               onChange={setQuantity}
//             /> */}
//           </div>

//           <div className="flex justify-between mb-4 text-lg">
//             <div>
//               <p className="text-gray-500">You put</p>
//               <p className="font-medium">₹{totalCost.toFixed(1)}</p>
//             </div>
//             <div className="text-right">
//               <p className="text-gray-500">You get</p>
//               <p className="font-medium text-green-600">
//                 ₹{potentialWinnings.toFixed(1)}
//               </p>
//             </div>
//           </div>

//           <div className="mb-4">
//             <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
//               <div className="flex items-center px-4 py-3 bg-gray-50">
//                 <Book className="h-5 w-5 mr-2" />
//                 <span className="font-medium">Order Book</span>
//               </div>
//               <div className="divide-y divide-gray-100">
//                 <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 text-sm font-medium">
//                   <span>Price</span>
//                   <span className="text-blue-600">Qty at YES</span>
//                   <span className="text-rose-600">Qty at NO</span>
//                 </div>
//                 {orderBook.map((entry, index) => (
//                   <div
//                     key={index}
//                     className="grid grid-cols-3 gap-4 px-4 py-3 text-sm"
//                   >
//                     <span>₹{entry.price}</span>
//                     <span className="text-blue-600">{entry.yesQty}</span>
//                     <span className="text-rose-600">{entry.noQty}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//             <span>Available Balance: ₹{availableBalance}</span>
//             <span>Commission: {(commission * 100).toFixed(1)}%</span>
//           </div>

//           <button
//             onClick={() => {
//               console.log('Trade confirmed:', {
//                 market: market.title,
//                 choice,
//                 amount: price * quantity,
//                 potentialWinnings,
//               })
//               onClose()
//             }}
//             className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium active:bg-blue-600 transition-colors"
//           >
//             Confirm {choice === 'yes' ? 'Yes' : 'No'}
//           </button>

//           <p className="text-xs text-gray-500 text-center mt-4">
//             Sale or purchase of Crypto Currency or Digital Assets is neither
//             encouraged nor allowed on this platform
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TradeSheet
