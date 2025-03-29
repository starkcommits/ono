import {
  useFrappeEventListener,
  useFrappeGetDoc,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import { Clock, Plus, TrendingDown, TrendingUp, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const ActivePosition = ({ position, handleTradeAction }) => {
  const [market, setMarket] = useState({})
  //   const { data: marketData, isLoading: marketDataLoading } = useFrappeGetDoc(
  //     {
  //       doctype: 'Market',
  //       name: position.market_id,
  //     },

  //     {
  //       fields: [
  //         'name',
  //         position.opinion_type === 'YES' ? 'yes_price' : 'no_price',
  //       ],
  //     }
  //   )
  const { data: marketData, isLoading: marketDataLoading } =
    useFrappeGetDocList('Market', {
      /** SWR Configuration Options - Optional **/
      fields: ['name', 'yes_price', 'no_price', 'closing_time'], // Specify the fields you want
      filters: [['name', '=', position.market_id]],
    })

  useEffect(() => {
    if (marketData?.length > 0) setMarket(marketData[0])
  }, [marketDataLoading])

  useFrappeEventListener('market_event', (updatedMarket) => {
    console.log('Updated Market:', updatedMarket)

    if (updatedMarket.name === position.market_id) {
      if (position.opinion_type === 'YES') {
        setMarket((prevMarket) => ({
          ...prevMarket,
          yes_price: updatedMarket.yes_price,
        }))
      } else {
        setMarket((prevMarket) => ({
          ...prevMarket,
          no_price: updatedMarket.no_price,
        }))
      }
    }
  })

  return (
    <div key={position.name} className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{position.question}</h3>
        <div
          className={`flex items-center ${
            position.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {position.profit >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span className="font-medium">
            {position.profitPercentage >= 0 ? '+' : ''}
            {position.profitPercentage}%
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            position.opinion_type === 'YES'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {position.opinion_type.toUpperCase()}
        </span>
        <span>•</span>
        <span className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" />
          End at{' '}
          {market?.closing_time
            ?.split(' ')[0]
            .split('-')
            .reverse()
            .join('-')}{' '}
          {market?.closing_time?.split(' ')[1].split(':').join(':').slice(0, 5)}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-600 font-medium">Amount</div>
          <div className="font-semibold text-gray-900">
            ₹{position.quantity * position.amount}
          </div>
        </div>
        <div>
          <div className="text-gray-600 font-medium">Qty @ Price</div>
          <div className="font-semibold text-gray-900">
            {position.quantity} @ ₹{position.amount}
          </div>
        </div>
        <div>
          <div className="text-gray-600 font-medium">Current</div>
          <div className="font-semibold text-gray-900">
            ₹
            {position.opinion_type === 'YES'
              ? market?.yes_price
              : market?.no_price}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => handleTradeAction(position, 'exit')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors"
        >
          <XCircle className="h-4 w-4" />
          Exit Position
        </button>
        <button
          onClick={() => handleTradeAction(position, 'invest')}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Invest More
        </button>
      </div>
    </div>
  )
}

export default ActivePosition
