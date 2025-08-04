import React, { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { useFrappeEventListener, useFrappeGetCall } from 'frappe-react-sdk'
import ProfitUpArrow from '@/assets/ProfitUpArrow.svg'
import LossDownArrow from '@/assets/LossDownArrow.svg'
import { MarketEventListener } from './MarketEventListener'

const Widget = () => {
  const [marketwiseActiveHoldings, setMarketwiseActiveHoldings] = useState({})

  const { data: marketwiseActiveHoldingsData } = useFrappeGetCall(
    'rewardapp.engine.get_marketwise_holding',
    {}
  )

  useEffect(() => {
    const id = 'widget'

    MarketEventListener.subscribe(id, (updatedMarket) => {
      setMarketwiseActiveHoldings((prevHoldings) => {
        const marketId = updatedMarket.name

        // Check if market exists in current state
        if (!prevHoldings[marketId]) {
          return prevHoldings
        }

        return {
          ...prevHoldings,
          [marketId]: {
            ...prevHoldings[marketId],
            yes_price: updatedMarket.yes_price,
            no_price: updatedMarket.no_price,
          },
        }
      })
    })

    return () => {
      MarketEventListener.unsubscribe(id)
    }
  }, [])

  useEffect(() => {
    if (marketwiseActiveHoldingsData && marketwiseActiveHoldingsData.message) {
      setMarketwiseActiveHoldings(marketwiseActiveHoldingsData.message)
    }
  }, [marketwiseActiveHoldingsData])

  const total_investment = Object.values(marketwiseActiveHoldings).reduce(
    (acc, marketHolding) => acc + marketHolding.total_invested,
    0
  )

  const current_value = Object.values(marketwiseActiveHoldings).reduce(
    (acc, market) => {
      const yesPrice = market.yes_price || 0
      const noPrice = market.no_price || 0

      // Calculate value from ACTIVE and EXITING positions
      const activeExitingValue = [market.ACTIVE, market.EXITING].reduce(
        (positionAcc, position) => {
          if (!position) return positionAcc

          const yesQty =
            (position?.YES?.total_quantity || 0) -
            (position?.YES?.total_filled_quantity || 0)
          const noQty =
            (position?.NO?.total_quantity || 0) -
            (position?.NO?.total_filled_quantity || 0)

          return positionAcc + yesQty * yesPrice + noQty * noPrice
        },
        0
      )

      const unmatchedYesInvested = market?.UNMATCHED?.YES?.total_invested || 0
      const unmatchedNoInvested = market?.UNMATCHED?.NO?.total_invested || 0

      const unmatchedValue = unmatchedYesInvested + unmatchedNoInvested

      return acc + activeExitingValue + unmatchedValue
    },
    0
  )

  if (total_investment > 0 && current_value > 0)
    return (
      <div className="bg-[#492C82] flex justify-between items-center select-none py-1.5 px-[13px] font-inter w-full max-w-md mx-auto ">
        <div className="flex gap-2 items-center">
          <div className="flex gap-2 text-white items-center">
            <span className="font-normal text-xs">Investment</span>
            <span className="font-semibold text-xs">
              &#8377;{total_investment.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center h-full">
            <Separator orientation="vertical" className="h-5" />
          </div>
          <div className="flex gap-2 text-white items-center">
            <span className="font-normal text-xs">Current</span>
            <span className="font-semibold text-xs text-white">
              &#8377;{current_value.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="text-white flex gap-2">
          <span className="font-normal text-xs">Live Gains</span>
          <span className="text-xs font-semibold flex gap-1.5 items-center">
            {current_value > total_investment && (
              <img src={ProfitUpArrow} alt="" />
            )}
            {current_value < total_investment && (
              <img src={LossDownArrow} alt="" />
            )}
            {current_value - total_investment > 0 ? (
              <span>
                +&#8377;
                {Math.abs(current_value - total_investment).toFixed(1)}
              </span>
            ) : null}
            {current_value - total_investment < 0 ? (
              <span>
                &#8377;{(current_value - total_investment).toFixed(1)}
              </span>
            ) : null}
            {current_value - total_investment === 0 ? (
              <span>
                &#8377;{(current_value - total_investment).toFixed(1)}
              </span>
            ) : null}
          </span>
        </div>
      </div>
    )
}

export default Widget
