import CricketImage from '@/assets/CricketImage.svg'
import DownArrowIcon from '@/assets/DownArrowIcon.svg'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import X from '@/assets/X.svg'
import Back from '@/assets/Back.svg'
import UpArrowIcon from '@/assets/UpArrowIcon.svg'

import CircleCrossIcon from '@/assets/CircleCrossIcon.svg'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetCall,
  useFrappeGetDoc,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import ExitSellOrders from './ExitSellOrders'
import OpenMarketHoldingsBuyDrawer from './OpenMarketHoldingsBuyDrawer'
import OpenMarketHoldingsExitSellOrders from './OpenMarketHoldingsExitSellOrders'
import ExitSellOrder from './ExitSellOrder'
import OpenMarketHoldingsCancelSellOrders from './OpenMarketHoldingsCancelSellOrders'
import OpenMarketHoldingsCancelBuyOrders from './OpenMarketHoldingsCancelBuyOrders'
import ModifyCancelSellOrder from './ModifyCancelSellOrder'
import HoldingCardDrawer from './HoldingCardDrawer'
import { LeafyGreen } from 'lucide-react'

const OpenMarketHoldings = ({ marketPrices, setMarketPrices }) => {
  const { market_id } = useParams()

  const { currentUser } = useFrappeAuth()

  console.log('MArket Prices', marketPrices)

  const [openMarketHoldingsPortfolioTab, setOpenMarketHoldingsPortfolioTab] =
    useState(localStorage.getItem('openMarketHoldingsPortfolioTab') || 'all')

  const { data: { message: openMarketHoldingsOverall } = {} } =
    useFrappeGetCall(
      'rewardapp.engine.get_market_holdings',
      {
        market_id: market_id,
        user_id: currentUser,
      },
      currentUser ? ['open_market_holdings_overall'] : null
    )

  console.log('Overall:', openMarketHoldingsOverall)

  const { data: openMarketHoldings, isLoading: openMarketHoldingsLoading } =
    useFrappeGetDocList(
      'Holding',
      {
        fields: [
          'name',
          'market_id',
          'order_id',
          'price',
          'buy_order',
          'returns',
          'quantity',
          'opinion_type',
          'status',
          'exit_price',
          'market_yes_price',
          'market_no_price',
          'filled_quantity',
        ],
        filters:
          openMarketHoldingsPortfolioTab === 'all'
            ? [
                ['user_id', '=', currentUser],
                ['market_id', '=', market_id],
                ['market_status', '=', 'OPEN'],
              ]
            : openMarketHoldingsPortfolioTab === 'matched'
            ? [
                ['user_id', '=', currentUser],
                ['market_id', '=', market_id],
                ['market_status', '=', 'OPEN'],
                ['status', '=', 'ACTIVE'],
              ]
            : openMarketHoldingsPortfolioTab === 'pending'
            ? [
                ['user_id', '=', currentUser],
                ['market_id', '=', market_id],
                ['market_status', '=', 'OPEN'],
                ['status', '=', `UNMATCHED`],
              ]
            : [
                ['user_id', '=', currentUser],
                ['market_id', '=', market_id],
                ['market_status', '=', 'OPEN'],
                [
                  'status',
                  '=',
                  `${openMarketHoldingsPortfolioTab.toUpperCase()}`,
                ],
              ],
        orderBy: {
          field: 'creation',
          order: 'desc',
        },
      },
      currentUser && market_id
        ? [`${openMarketHoldingsPortfolioTab}_open_market_holdings`]
        : null
    )

  console.log('Open market holdings: ', openMarketHoldings)

  const handleTabChange = (value) => {
    localStorage.setItem('openMarketHoldingsPortfolioTab', value)
    setOpenMarketHoldingsPortfolioTab(value)
  }

  const tabKeys = ['all', 'pending', 'matched', 'exiting', 'exited', 'canceled']
  const tabRefs = useRef({})
  const tabsContainerRef = useRef(null)

  // Initialize refs once
  useEffect(() => {
    tabKeys.forEach((key) => {
      if (!tabRefs.current[key]) {
        tabRefs.current[key] = React.createRef()
      }
    })
  }, [])

  // Scroll into view when tab changes
  useEffect(() => {
    const selectedTab = tabRefs.current[openMarketHoldingsPortfolioTab]?.current
    const container = tabsContainerRef.current

    if (selectedTab && container) {
      selectedTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [openMarketHoldingsPortfolioTab])

  const navigate = useNavigate()
  return (
    <div className="leading-[100%] bg-[#F5F5F5] w-full select-none">
      <div className="h-12 sticky z-[50] top-0 left-0 right-0 flex flex-col font-inter max-w-md mx-auto pt-4 bg-white mb-auto w-full select-none">
        <div className="border-[0.33px] border-x-0 border-t-0 border-b border-[#DBC5F7] w-full flex justify-start items-center pb-4 px-4">
          <h1 className="text-xl font-[500] text-[#2C2D32] ">
            <img
              src={Back}
              alt=""
              onClick={() => {
                navigate(-1)
              }}
              className="cursor-pointer w-4 h-4"
            />
          </h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[0.7px] bg-gray-200 z-10"></div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-4 items-center pb-8 pt-6">
          <div
            className="flex flex-col gap-4 items-center"
            onClick={() => {
              navigate(`/event/${market_id}`)
            }}
          >
            <div>
              <img src={CricketImage} alt="" />
            </div>
            <div>
              <p className="font-normal text-sm text-center text-[#2C2D32] w-[85%] mx-auto">
                {openMarketHoldingsOverall?.question}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs font-normal text-[#5F5F5F]">
              THE MARKET PREDICTS
            </p>
          </div>
          <div>
            <p className="font-normal text-[22px] text-[#492C82]">
              {marketPrices.market_yes_price * 10}% probability of YES
            </p>
          </div>
        </div>
        <div className="p-4 pt-0">
          {(() => {
            const total_investment = openMarketHoldingsOverall?.total_invested

            const yesPrice = marketPrices.market_yes_price || 0
            const noPrice = marketPrices.market_no_price || 0

            const current_value =
              [
                openMarketHoldingsOverall?.ACTIVE,
                openMarketHoldingsOverall?.EXITING,
              ].reduce((positionAcc, position) => {
                if (!position) return positionAcc

                const yesQty =
                  (position?.YES?.total_quantity || 0) -
                  (position?.YES?.total_filled_quantity || 0)

                const noQty =
                  (position?.NO?.total_quantity || 0) -
                  (position?.NO?.total_filled_quantity || 0)

                return positionAcc + yesQty * yesPrice + noQty * noPrice
              }, 0) +
              +(
                (openMarketHoldingsOverall?.UNMATCHED?.YES?.total_invested ||
                  0) +
                (openMarketHoldingsOverall?.UNMATCHED?.NO?.total_invested || 0)
              )

            return (
              <div className="flex flex-col gap-4 items-center p-4 rounded-[5px] bg-white">
                <div className="flex flex-col gap-1 items-center">
                  <p className="font-normal text-xs">Live Returns</p>

                  <p className="flex items-center gap-1">
                    <span>
                      {current_value > total_investment ? (
                        <img className="" src={UpArrowIcon} alt="" />
                      ) : null}
                      {current_value < total_investment ? (
                        <img className="" src={DownArrowIcon} alt="" />
                      ) : null}
                    </span>
                    <span
                      className={`font-inter font-semibold text-sm ${
                        current_value > total_investment
                          ? 'text-[#1C895E]'
                          : null
                      } ${
                        current_value < total_investment
                          ? 'text-[#DB342C]'
                          : null
                      }`}
                    >
                      &#8377;{current_value - total_investment}
                    </span>
                  </p>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <p className="font-normal text-xs text-[#5F5F5F]">
                      Investment
                    </p>
                    <p className="font-inter font-semibold text-xl">
                      &#8377;{total_investment}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-normal text-xs text-[#5F5F5F]">
                      Current Value
                    </p>
                    <p
                      className={`font-inter font-semibold text-xl ${
                        current_value > total_investment
                          ? 'text-[#1C895E]'
                          : null
                      } ${
                        current_value < total_investment
                          ? 'text-[#DB342C]'
                          : null
                      }`}
                    >
                      &#8377;{current_value}
                    </p>
                  </div>
                </div>

                <div className="w-full flex items-center justify-between gap-4 text-xs font-medium">
                  <OpenMarketHoldingsBuyDrawer
                    marketId={market_id}
                    marketPrices={marketPrices}
                    openMarketHoldingsPortfolioTab={
                      openMarketHoldingsPortfolioTab
                    }
                  />
                  <OpenMarketHoldingsExitSellOrders
                    market={openMarketHoldingsOverall}
                    openMarketHoldingsOverall={openMarketHoldingsOverall}
                    marketPrices={marketPrices}
                    openMarketHoldingsPortfolioTab={
                      openMarketHoldingsPortfolioTab
                    }
                  />
                </div>
                <div className="w-full flex justify-between items-center pt-4 border-dashed border-t-[0.7px] text-[#2C2D32]">
                  <span className="font-normal text-xs">Exited Returns</span>
                  <span className="font-inter text-xs font-medium">
                    &#8377;{' '}
                    {openMarketHoldings?.reduce((acc, holding) => {
                      return (acc += holding.returns)
                    }, 0)}
                  </span>
                </div>

                {(openMarketHoldingsOverall?.UNMATCHED ||
                  openMarketHoldingsOverall?.EXITING) && (
                  <div className="border-dashed border-t-[0.7px] pt-4 w-full flex gap-2 items-center">
                    {openMarketHoldingsOverall?.UNMATCHED ? (
                      <div className="flex gap-4 items-center">
                        <OpenMarketHoldingsCancelBuyOrders
                          market={openMarketHoldingsOverall}
                          openMarketHoldingsPortfolioTab={
                            openMarketHoldingsPortfolioTab
                          }
                        />
                      </div>
                    ) : null}

                    {openMarketHoldingsOverall?.EXITING ? (
                      <div className="flex gap-4 items-center">
                        <OpenMarketHoldingsCancelSellOrders
                          market={openMarketHoldingsOverall}
                          openMarketHoldingsPortfolioTab={
                            openMarketHoldingsPortfolioTab
                          }
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>
      <div className={`bg-[#F5F5F5] sticky top-12 z-[50] border-b`}>
        <div
          className="w-full overflow-x-auto scrollbar-hide"
          ref={tabsContainerRef} // Moved ref here from TabsList
        >
          <Tabs
            className="w-full py-6 font-[500] text-xs"
            value={openMarketHoldingsPortfolioTab}
            onValueChange={handleTabChange}
          >
            <div className="bg-[#F5F5F5]">
              <TabsList className="flex flex-nowrap w-max rounded-full space-x-2 bg-[#F5F5F5] text-[#2C2D32] p-0 h-6 pl-4 pr-4">
                {tabKeys.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    ref={tabRefs.current[tab]}
                    className={`flex items-center flex-shrink-0 px-5 py-1.5 space-x-2 rounded-full border-[0.5px] border-[#CBCBCB] bg-white data-[state=active]:border-[0.7px] data-[state=active]:border-[#5F5F5F] text-sm text-[#5F5F5F] font-normal h-auto`}
                  >
                    <span className="whitespace-nowrap capitalize">{tab}</span>
                    {openMarketHoldingsPortfolioTab === tab && (
                      <img src={X} alt="Close" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 min-h-[calc(100vh-122px)] relative z-[30]">
        {!openMarketHoldingsLoading && openMarketHoldings?.length === 0 && (
          <div className="flex flex-col gap-1 items-center pt-12">
            <p className="text-gray-600 text-md">Nothing to see here... yet</p>
            <p className="text-neutral-400 text-sm">
              Your orders will appear here
            </p>
          </div>
        )}
        {openMarketHoldings?.length > 0 &&
          openMarketHoldings.map((holding) => {
            return (
              <HoldingCardDrawer
                key={holding.name}
                marketPrices={marketPrices}
                holding={holding}
                openMarketHoldingsPortfolioTab={openMarketHoldingsPortfolioTab}
              />
            )
          })}
      </div>
    </div>
  )
}

export default OpenMarketHoldings
