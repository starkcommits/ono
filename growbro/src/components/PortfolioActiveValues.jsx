import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk'
import React from 'react'
import { useParams } from 'react-router-dom'

const PortfolioActiveValues = () => {
  const { currentUser } = useFrappeAuth()
  const { id } = useParams()

  console.log(id)
  const {
    data: holdingData,
    isLoading: holdingDataLoading,
    mutate: refetchHoldingData,
  } = useFrappeGetDocList(
    'Holding',
    {
      fields: [
        'name',
        'market_id',
        'order_id',
        'price',
        'returns',
        'quantity',
        'opinion_type',
        'status',
        'exit_price',
        'market_yes_price',
        'market_no_price',
        'filled_quantity',
      ],
      filters: [
        ['user_id', '=', currentUser],
        ['market_id', '=', id],
        ['status', 'in', 'ACTIVE'],
      ],
    },
    currentUser && id ? undefined : null
  )

  const {
    data: allHoldingData,
    isLoading: allHoldingDataLoading,
    mutate: refetchAllHoldingData,
  } = useFrappeGetDocList(
    'Holding',
    {
      fields: [
        'name',
        'market_id',
        'order_id',
        'price',
        'quantity',
        'opinion_type',
        'status',
        'exit_price',
        'market_yes_price',
        'market_no_price',
        'filled_quantity',
      ],
      filters: [
        ['user_id', '=', currentUser],
        ['status', 'in', 'ACTIVE'],
      ],
    },
    !id ? undefined : null
  )

  if (id)
    return (
      <div className="flex justify-between ">
        <div className="flex flex-col gap-2 items-start">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Invested</span>
          </div>
          <div className="text-3xl font-bold text-white flex items-center gap-4">
            <div>
              ₹
              {holdingData?.length > 0
                ? holdingData.reduce((acc, holding) => {
                    return acc + parseFloat(holding.price * holding.quantity)
                  }, 0)
                : 0}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">Current Value</span>
            {/* <div className="flex items-center bg-emerald-500 bg-opacity-25 backdrop-blur-sm px-2.5 py-1 rounded-full">
        <TrendingUp className="h-4 w-4 text-white mr-1" />
        <span className="text-sm font-semibold text-white">+12.5%</span>
      </div> */}
          </div>
          <div className="text-3xl font-bold text-white flex items-center gap-4">
            <div>
              ₹
              {holdingData?.length > 0
                ? holdingData.reduce((acc, holding) => {
                    acc =
                      acc +
                      (holding.opinion_type === 'YES'
                        ? holding.market_yes_price
                        : holding.market_no_price) *
                        holding.quantity

                    return acc
                  }, 0)
                : 0}
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Invested</span>
          {/* <div className="flex items-center bg-emerald-500 bg-opacity-25 backdrop-blur-sm px-2.5 py-1 rounded-full">
        <TrendingUp className="h-4 w-4 text-white mr-1" />
        <span className="text-sm font-semibold text-white">+12.5%</span>
      </div> */}
        </div>
        <div className="text-3xl font-bold text-white flex items-center gap-4">
          <div>
            ₹
            {allHoldingData?.length > 0
              ? allHoldingData.reduce((acc, holding) => {
                  return acc + parseFloat(holding.price * holding.quantity)
                }, 0)
              : 0}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Current Value</span>
          {/* <div className="flex items-center bg-emerald-500 bg-opacity-25 backdrop-blur-sm px-2.5 py-1 rounded-full">
        <TrendingUp className="h-4 w-4 text-white mr-1" />
        <span className="text-sm font-semibold text-white">+12.5%</span>
      </div> */}
        </div>
        <div className="text-3xl font-bold text-white flex items-center gap-4">
          <div>
            ₹
            {allHoldingData?.length > 0
              ? allHoldingData.reduce((acc, holding) => {
                  acc =
                    acc +
                    (holding.opinion_type === 'YES'
                      ? holding.market_yes_price
                      : holding.market_no_price) *
                      holding.quantity

                  return acc
                }, 0)
              : 0}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioActiveValues
