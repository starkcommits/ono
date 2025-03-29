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
    <div key={trade?.name} className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <h3 className="font-medium text-gray-900">{market?.question}</h3>
          {trade.status === 'CANCELED' && (
            <span className="bg-red-200 text-red-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {' '}
              {trade.status}
            </span>
          )}
          {trade.status === 'SETTLED' && (
            <span className="bg-green-100 text-green-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {' '}
              {trade.status}
            </span>
          )}
        </div>
        <div
          className={`flex items-center ${
            trade?.opinion_type === 'YES' ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {trade?.opinion_type === 'YES' ? (
            <CheckCircle className="h-4 w-4 mr-1" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-1" />
          )}
          {/* <span className="font-medium">
            {trade.profitPercentage >= 0 ? '+' : ''}
            {trade.profitPercentage}%
          </span> */}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            trade?.opinion_type === 'YES'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {trade?.opinion_type?.toUpperCase()}
        </span>
        <span>•</span>
        <span>
          {trade?.closing_time?.split(' ')[0].split('-').reverse().join('-')}{' '}
          {trade?.closing_time?.split(' ')[1].split(':').join(':')}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-600 font-medium">Amount</div>
          <div className="font-semibold text-gray-900">
            ₹{trade?.amount * trade?.quantity}
          </div>
        </div>
        <div>
          <div className="text-gray-600 font-medium">Profit/Loss</div>
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
