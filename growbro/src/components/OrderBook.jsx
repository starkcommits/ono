import { useFrappeEventListener, useFrappeGetCall } from 'frappe-react-sdk'
import { Book } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const OrderBook = ({ marketId }) => {
  const [orderBook, setOrderBook] = useState({})

  const { data: orderBookData, isLoading: orderBookLoading } = useFrappeGetCall(
    'rewardapp.engine.get_available_quantity',
    { market_id: marketId }
  )

  console.log(orderBookData)

  useEffect(() => {
    if (!orderBookLoading && Object.values(orderBookData)?.length > 0) {
      setOrderBook(orderBookData.message)
    }
  }, [orderBookData])

  useFrappeEventListener('order_event', (order) => {
    console.log('Gasdasdas')
    if (order.market_id !== marketId) return

    setOrderBook((prevOrderBook) => {
      const priceKey = String(order.amount) // 🔹 Ensure consistent format
      const isYesOrder = order.opinion_type === 'YES'
      const remainingQty = order.quantity - order.filled_quantity

      const updatedOrderBook = { ...prevOrderBook }

      if (!updatedOrderBook[priceKey]) {
        updatedOrderBook[priceKey] = {
          price: parseFloat(priceKey),
          yesQty: 0,
          noQty: 0,
        }
      }

      const orderEntry = updatedOrderBook[priceKey]

      switch (order.status) {
        case 'UNMATCHED':
        case 'EXITING':
          orderEntry.yesQty += isYesOrder ? remainingQty : 0
          orderEntry.noQty += isYesOrder ? 0 : remainingQty
          break

        case 'PARTIAL':
          orderEntry.yesQty = isYesOrder ? remainingQty : orderEntry.yesQty
          orderEntry.noQty = isYesOrder ? orderEntry.noQty : remainingQty
          break

        case 'MATCHED':
        case 'EXITED':
          orderEntry.yesQty = isYesOrder ? 0 : orderEntry.yesQty
          orderEntry.noQty = isYesOrder ? orderEntry.noQty : 0
          break

        case 'CANCELLED':
          orderEntry.yesQty = Math.max(
            0,
            orderEntry.yesQty - (isYesOrder ? remainingQty : 0)
          )
          orderEntry.noQty = Math.max(
            0,
            orderEntry.noQty - (isYesOrder ? 0 : remainingQty)
          )
          break
      }

      if (order.order_type === 'SELL') {
        orderEntry.yesQty = isYesOrder
          ? Math.max(0, orderEntry.yesQty - order.quantity)
          : orderEntry.yesQty
        orderEntry.noQty = isYesOrder
          ? orderEntry.noQty
          : Math.max(0, orderEntry.noQty - order.quantity)
      }

      if (orderEntry.yesQty <= 0 && orderEntry.noQty <= 0) {
        delete updatedOrderBook[priceKey]
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
            .sort((a, b) => b.yesQty + b.noQty - (a.yesQty + a.noQty))
            .map((entry, index) => (
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
