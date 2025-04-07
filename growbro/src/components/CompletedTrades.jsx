import { useFrappeGetDocList } from 'frappe-react-sdk'
import { AlertCircle, CheckCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const CompletedTrades = ({ trade }) => {
  const [market, setMarket] = useState({})

  const { data: marketData, isLoading: marketDataLoading } =
    useFrappeGetDocList('Market', {
      /** SWR Configuration Options - Optional **/
      fields: [
        'name',
        'yes_price',
        'no_price',
        'closing_time',
        'end_result',
        'question',
      ], // Specify the fields you want
      filters: [['name', '=', trade.market_id]],
    })

  console.log(trade)

  useEffect(() => {
    if (marketData?.length > 0) setMarket(marketData[0])
  }, [marketDataLoading])

  return (
    <div key={trade.question} className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">{trade.question}</h3>
        <div className="bg-blue-200 text-blue-600 rounded-xl p-1.5">
          {trade.winning_side}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span>
          {trade?.closing_time?.split(' ')[0].split('-').reverse().join('-')}{' '}
          {trade?.closing_time?.split(' ')[1].split(':').join(':')}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600 font-medium">Amount Invested</div>
          <div className="font-semibold text-gray-900">
            ₹{trade?.debited_amount}
          </div>
        </div>
        <div className="grid place-content-end">
          <div className="text-gray-600 font-medium">Returns</div>
          {trade.credited_amount - trade.debited_amount > 0 && (
            <div className={`font-bold text-green-700`}>
              +₹{trade.credited_amount - trade.debited_amount}
            </div>
          )}{' '}
          {trade.credited_amount - trade.debited_amount === 0 && (
            <div className={`font-bold text-neutral-700`}>
              ₹{trade.credited_amount}
            </div>
          )}{' '}
          {trade.credited_amount - trade.debited_amount < 0 && (
            <div className={`font-bold text-red-700`}>
              ₹{trade.credited_amount - trade.debited_amount}
            </div>
          )}{' '}
          {/* <div
            className={`font-semibold ${
              trade.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trade.profit >= 0 ? '+' : ''}₹{Math.abs(trade.profit)}
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default CompletedTrades
