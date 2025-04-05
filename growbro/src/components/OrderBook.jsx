import { useFrappeEventListener, useFrappeGetCall } from 'frappe-react-sdk'
import { Book, LucideMousePointerBan } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const OrderBook = ({ marketId }) => {
  const [orderBook, setOrderBook] = useState({})
  console.log(marketId)

  const { data: orderBookData, isLoading: orderBookLoading } = useFrappeGetCall(
    'rewardapp.engine.get_available_quantity',
    { market_id: marketId }
  )

  console.log(orderBookData)

  useEffect(() => {
    if (
      !orderBookLoading &&
      Object.values(orderBookData?.message)?.length > 0
    ) {
      const normalizedData = Object.fromEntries(
        Object.entries(orderBookData?.message).map(([key, value]) => [
          parseFloat(key).toFixed(1), // Ensure key format
          { ...value, price: parseFloat(key).toFixed(1) },
        ])
      )
      setOrderBook(normalizedData)
    }
  }, [orderBookData])

  console.log('Message: ', orderBookData?.message)

  useFrappeEventListener('order_', (order) => {
    console.log('Received Order:', order)
    if (order.market_id !== marketId) return

    console.log('entered')
    setOrderBook((prevOrderBook) => {
      const priceKey = parseFloat(order.amount).toFixed(1) // Ensure consistent price format
      const isYesOrder = order.opinion_type === 'YES'
      const remainingQty = order.quantity - order.filled_quantity

      console.log('Previous OrderBook:', prevOrderBook)

      // Clone the order book
      const updatedOrderBook = { ...prevOrderBook }

      // Ensure the price entry exists
      if (!updatedOrderBook[priceKey]) {
        updatedOrderBook[priceKey] = { price: priceKey, yesQty: 0, noQty: 0 }
      }

      updatedOrderBook[priceKey] = {
        price: priceKey,
        yesQty:
          order.opinion_type === 'YES'
            ? updatedOrderBook[priceKey].yesQty + order.quantity
            : updatedOrderBook[priceKey].yesQty,
        noQty:
          order.opinion_type === 'NO'
            ? updatedOrderBook[priceKey].noQty + order.quantity
            : updatedOrderBook[priceKey].noQty,
      }

      return updatedOrderBook
    })
  })

  return (
    <div className="mb-4">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center px-4 py-3 bg-gray-50">
          <Book className="h-5 w-5 mr-2" />
          <span className="font-medium">Order Book</span>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 text-sm font-medium">
            <span>Price</span>
            <span className="text-blue-600">Qty at YES</span>
            <span className="text-rose-600">Qty at NO</span>
          </div>
          {Object.values(orderBook)
            ?.sort((a, b) => b.yesQty + b.noQty - (a.yesQty + a.noQty))
            ?.map((entry, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 px-4 py-3 text-sm"
              >
                {console.log('Entry:', entry)}
                <span>₹{entry.price}</span>
                <span className="text-blue-600">{entry.yesQty}</span>
                <span className="text-rose-600">{entry.noQty}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default OrderBook
