import { useFrappeEventListener, useFrappeGetCall } from 'frappe-react-sdk'
import { Book } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const OrderBook = ({ marketId }) => {
  const [orderBook, setOrderBook] = useState({})
  console.log(marketId)

  const {
    data: orderBookData,
    isLoading: orderBookLoading,
    mutate: refetchOrderBook,
  } = useFrappeGetCall('rewardapp.engine.get_available_quantity', {
    market_id: marketId,
  })

  console.log(orderBookData)

  useEffect(() => {
    // First, handle the case when we have data from API
    if (
      !orderBookLoading &&
      Object.values(orderBookData?.message)?.length > 0
    ) {
      // Normalize the data from API
      const normalizedData = Object.fromEntries(
        Object.entries(orderBookData?.message).map(([key, value]) => [
          parseFloat(key).toFixed(1), // Ensure key format
          { ...value, price: parseFloat(key).toFixed(1) },
        ])
      )

      // Find the range of prices in the current data
      const prices = Object.keys(normalizedData)
        .map((price) => parseFloat(price))
        .filter((price) => price >= 0.5) // Exclude prices below 0.5

      // If no valid prices, set a default minimum price of 0.5
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0.5
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 9.5

      // Filter out 0.0 from the normalized data
      const filteredData = Object.fromEntries(
        Object.entries(normalizedData).filter(([key]) => parseFloat(key) >= 0.5)
      )

      // Ensure we have at least 5 price levels
      const extendedData = { ...filteredData }

      // If we have fewer than 5 price points
      if (Object.keys(extendedData).length < 5) {
        // Add price points starting from 0.5 if needed
        const neededPoints = 5 - Object.keys(extendedData).length

        // Add lower price points if needed, but not below 0.5
        for (let i = 1; i <= neededPoints; i++) {
          let lowerPrice = (minPrice - i * 0.5).toFixed(1)
          if (parseFloat(lowerPrice) < 0.5) {
            lowerPrice = (0.5).toFixed(1)
          }

          if (!extendedData[lowerPrice] && parseFloat(lowerPrice) >= 0.5) {
            extendedData[lowerPrice] = {
              price: lowerPrice,
              yesQty: 0,
              noQty: 0,
            }
          }

          // Add higher price points if needed
          const higherPrice = (maxPrice + i * 0.5).toFixed(1)
          if (!extendedData[higherPrice]) {
            extendedData[higherPrice] = {
              price: higherPrice,
              yesQty: 0,
              noQty: 0,
            }
          }

          // Break if we have at least 5 price points now
          if (Object.keys(extendedData).length >= 5) {
            break
          }
        }
      }

      setOrderBook(extendedData)
    }
    // Handle the case when we have no data or empty data
    else {
      // Create default price points when there's no data
      const defaultData = {}
      // Create 5 default price points from 0.5 to 9.5
      const defaultPrices = [0.5, 2.5, 5.0, 7.5, 9.5]

      defaultPrices.forEach((price) => {
        const priceKey = price.toFixed(1)
        defaultData[priceKey] = {
          price: priceKey,
          yesQty: 0,
          noQty: 0,
        }
      })

      setOrderBook(defaultData)
    }
  }, [orderBookData])

  console.log('Message: ', orderBookData?.message)

  useFrappeEventListener('order_book_event', (order) => {
    console.log('Received Order:', order)
    if (order.market_id !== marketId) return

    console.log('entered')
    console.log('Type Order Price: ', typeof order.price)

    console.log('Type of order:', typeof order.quantity, typeof order.price)

    refetchOrderBook()

    // setOrderBook((prevOrderBook) => {
    //   const priceKey = parseFloat(order.price).toFixed(1) // Ensure consistent price format

    //   console.log('Previous OrderBook:', prevOrderBook)

    //   // Clone the order book
    //   const updatedOrderBook = { ...prevOrderBook }

    //   // Ensure the price entry exists
    //   if (!updatedOrderBook[priceKey]) {
    //     updatedOrderBook[priceKey] = { price: priceKey, yesQty: 0, noQty: 0 }
    //   }
    //   const currentYesQty = Number(updatedOrderBook[priceKey].yesQty) || 0
    //   const currentNoQty = Number(updatedOrderBook[priceKey].noQty) || 0
    //   const orderQuantity = Number(order.quantity) || 0

    //   console.log(currentYesQty, currentNoQty, orderQuantity)

    //   updatedOrderBook[priceKey] = {
    //     price: priceKey,
    //     yesQty:
    //       order.opinion_type === 'YES'
    //         ? currentYesQty + orderQuantity
    //         : currentYesQty,
    //     noQty:
    //       order.opinion_type === 'NO'
    //         ? currentNoQty + orderQuantity
    //         : currentNoQty,
    //   }

    //   console.log('Updated OrderBook:', updatedOrderBook)

    //   return updatedOrderBook
    // })
  })

  useEffect(() => {
    console.log('Order book state changed:', orderBook)
  }, [orderBook])

  // console.log('Sorted Entries:', sortedYesEntries, sortedNoEntries)

  return (
    <div className="mb-4">
      <div className="bg-white rounded-xl border-gray-100 overflow-hidden">
        {/* <div className="flex items-center px-4 py-1 bg-gray-50">
          <Book className="h-5 w-5 mr-2" />
          <span className="font-medium">Order Book</span>
        </div> */}
        <div className="grid grid-cols-2 gap-3 font-inter leading-[100%] text-[#2C2D32]">
          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-2 gap-4 px-0 py-1 font-semibold text-[10px]">
              <span className="">Price</span>
              <span className="text-end">
                Qty at <span className="text-[#492C82]">YES</span>
              </span>
            </div>
            {Object.values(orderBook)
              .sort(
                (a, b) =>
                  b.yesQty - a.yesQty ||
                  parseFloat(a.price) - parseFloat(b.price)
              )
              .slice(0, 5)
              .map((entry) => (
                <div
                  key={entry.price}
                  className="grid grid-cols-2 gap-4 px-0 py-1"
                >
                  {console.log('Entry:', entry)}
                  <span className="font-semibold text-[10px]">
                    ₹{entry.price}
                  </span>
                  <span className="text-center font-normal text-[9px]">
                    {entry.yesQty}
                  </span>
                </div>
              ))}
          </div>
          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-2 gap-4 px-0 py-1 font-semibold text-[10px]">
              <span>Price</span>
              <span className="text-end">
                Qty at <span className="text-[#E26F64]">NO</span>
              </span>
            </div>
            {Object.values(orderBook)
              .sort(
                (a, b) =>
                  b.noQty - a.noQty || parseFloat(a.price) - parseFloat(b.price)
              )
              .slice(0, 5)
              .map((entry) => (
                <div
                  key={entry.price}
                  className="grid grid-cols-2 gap-4 px-0 py-1"
                >
                  <span className="font-semibold text-[10px]">
                    ₹{entry.price}
                  </span>
                  <span className="text-center font-normal text-[9px]">
                    {entry.noQty}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderBook
