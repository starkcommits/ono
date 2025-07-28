import CricketImage from '@/assets/CricketImage.svg'
import DownArrowIcon from '@/assets/DownArrowIcon.svg'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import X from '@/assets/X.svg'
import Back from '@/assets/Back.svg'
import UpArrowIcon from '@/assets/UpArrowIcon.svg'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  useFrappeAuth,
  useFrappeGetCall,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import ResolvedYesOpinion from '@/assets/ResolvedYesOpinion.svg'
import ResolvedNoOpinion from '@/assets/ResolvedNoOpinion.svg'
import AutoClosedIcon from '@/assets/AutoClosedIcon.svg'

import OpenMarketHoldingsBuyDrawer from './OpenMarketHoldingsBuyDrawer'
import OpenMarketHoldingsExitSellOrders from './OpenMarketHoldingsExitSellOrders'
import OpenMarketHoldingsCancelSellOrders from './OpenMarketHoldingsCancelSellOrders'
import OpenMarketHoldingsCancelBuyOrders from './OpenMarketHoldingsCancelBuyOrders'
import HoldingCardDrawer from './HoldingCardDrawer'

const ResolvedMarketHoldings = ({ marketPrices, setMarketPrices }) => {
  const { market_id } = useParams()

  const { currentUser } = useFrappeAuth()

  console.log('MArket Prices', marketPrices)

  const [
    resolvedMarketHoldingsPortfolioTab,
    setResolvedMarketHoldingsPortfolioTab,
  ] = useState(
    localStorage.getItem('resolvedMarketHoldingsPortfolioTab') || 'all'
  )

  const {
    data: resolvedMarketHoldings,
    isLoading: resolvedMarketHoldingsLoading,
  } = useFrappeGetDocList(
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
      filters: [
        ['user_id', '=', currentUser],
        ['market_id', '=', market_id],
        ['market_status', 'in', ['CLOSED', 'RESOLVED']],
      ],
    },
    currentUser && market_id && resolvedMarketHoldingsPortfolioTab === 'all'
      ? ['closed_market_holdings']
      : null
  )

  console.log(resolvedMarketHoldingsPortfolioTab)

  const {
    data: settledResolvedMarketHoldings,
    isLoading: settledResolvedMarketHoldingsLoading,
  } = useFrappeGetDocList(
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
      filters: [
        ['user_id', '=', currentUser],
        ['market_id', '=', market_id],
        ['market_status', 'in', ['CLOSED', 'RESOLVED']],
        ['status', '=', 'SETTLED'],
      ],
    },
    currentUser && market_id && resolvedMarketHoldingsPortfolioTab === 'settled'
      ? ['settled_closed_market_holdings']
      : null
  )

  const {
    data: canceledResolvedMarketHoldings,
    isLoading: canceledResolvedMarketHoldingsLoading,
  } = useFrappeGetDocList(
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
      filters: [
        ['user_id', '=', currentUser],
        ['market_id', '=', market_id],
        ['market_status', 'in', ['CLOSED', 'RESOLVED']],
        ['status', '=', 'CANCELED'],
      ],
    },
    currentUser &&
      market_id &&
      resolvedMarketHoldingsPortfolioTab === 'canceled'
      ? ['canceled_closed_market_holdings']
      : null
  )

  console.log('Open market holdings: ', resolvedMarketHoldings)

  const handleTabChange = (value) => {
    localStorage.setItem('resolvedMarketHoldingsPortfolioTab', value)
    setResolvedMarketHoldingsPortfolioTab(value)
  }

  const tabKeys = ['all', 'settled', 'canceled']
  const tabRefs = tabKeys.reduce((acc, key) => {
    acc[key] = useRef(null)
    return acc
  }, {})

  useEffect(() => {
    if (tabRefs[resolvedMarketHoldingsPortfolioTab]?.current) {
      tabRefs[resolvedMarketHoldingsPortfolioTab].current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [resolvedMarketHoldingsPortfolioTab])

  const navigate = useNavigate()
  return (
    <div className="leading-[100%] bg-[#F5F5F5] w-full select-none">
      <div className="sticky h-12 z-[50] top-0 left-0 right-0 flex flex-col font-inter max-w-md mx-auto pt-4 bg-white mb-auto w-full select-none">
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
          <div className="absolute bottom-0 left-0 right-0 h-[0.7px] bg-gray-200 z-10"></div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-4 items-center pb-8 pt-6">
          <div>
            <img src={CricketImage} alt="" />
          </div>
          <div>
            <p className="font-medium text-base text-[#337265] w-[90%] text-center mx-auto">
              {marketPrices.market_question}
            </p>
          </div>
          <div>
            {marketPrices.market_result === 'YES' ? (
              <img src={ResolvedYesOpinion} alt="" />
            ) : null}
            {marketPrices.market_result === 'NO' ? (
              <img src={ResolvedNoOpinion} alt="" />
            ) : null}
          </div>
          <div className="px-4 w-full">
            <div className="bg-[#DBDEFF4D] p-4 flex items-center gap-2 w-full">
              <div>
                <img src={AutoClosedIcon} alt="" />
              </div>
              <div className="flex items-center gap-1">
                <p className="text-[#2C2D32] font-medium text-xs">
                  Auto closed at price{' '}
                  {marketPrices.market_result === 'YES'
                    ? marketPrices.market_yes_price.toFixed(1)
                    : marketPrices.market_no_price.toFixed(1)}
                  .
                </p>
                <span className="text-[#337265] font-semibold text-xs">
                  Know more
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 pt-0">
          <div className="flex flex-col gap-4 p-4 rounded-[5px] bg-white">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2 items-start text-[#5F5F5F]">
                <p className="text-sm font-medium">Investment</p>
                <p className="text-[16px] font-bold font-inter">
                  &#8377;
                  {resolvedMarketHoldings?.reduce((acc, holding) => {
                    acc =
                      acc +
                      holding.price *
                        (holding.quantity - holding.filled_quantity)
                    return acc
                  }, 0)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 text-[#5F5F5F]">
                <p className="text-sm font-medium">Settled Value</p>
                <p className="text-[16px] font-bold font-inter">
                  &#8377;
                  {resolvedMarketHoldings?.reduce((acc, holding) => {
                    acc =
                      acc +
                      holding.exit_price *
                        (holding.quantity - holding.filled_quantity)
                    return acc
                  }, 0)}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-between items-center pt-4 border-dashed border-t-[1px] text-[#5F5F5F]">
              <span className="font-medium text-sm">Settled Returns</span>
              <span className="text-sm font-bold font-inter">
                &#8377;
                {resolvedMarketHoldings?.reduce((acc, holding) => {
                  acc = acc + holding.returns
                  return acc
                }, 0)}
              </span>
            </div>
            <div className="w-full flex justify-between items-center pt-4 border-dashed border-t-[1px] text-[#5F5F5F]">
              <span className="font-medium text-sm">Rank</span>
              <span className="text-sm font-bold font-inter">---</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#F5F5F5] sticky top-12 z-[50] border-b">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <Tabs
            className="w-full font-[500] text-xs py-6 overflow-x-auto scrollbar-hide"
            value={resolvedMarketHoldingsPortfolioTab}
            onValueChange={handleTabChange}
          >
            <div className="bg-[#F5F5F5]">
              <TabsList className="flex flex-nowrap w-max rounded-full space-x-2 bg-transparent text-[#2C2D32] p-0 h-6 pl-4 pr-4">
                {['all', 'settled', 'canceled'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    ref={tabRefs[tab]}
                    className={`flex items-center flex-shrink-0 px-5 py-1.5 space-x-2 rounded-full border-[0.5px] border-[#CBCBCB] bg-white data-[state=active]:border-[0.7px] data-[state=active]:border-[#5F5F5F] text-sm text-[#5F5F5F] font-normal h-auto`}
                  >
                    <span className="whitespace-nowrap capitalize">{tab}</span>
                    {resolvedMarketHoldingsPortfolioTab === tab && (
                      <img src={X} alt="Close" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 min-h-[calc(100vh-124px)] relative">
        {resolvedMarketHoldingsPortfolioTab === 'all' &&
          !resolvedMarketHoldingsLoading &&
          resolvedMarketHoldings?.length === 0 && (
            <div className="flex flex-col gap-1 items-center pt-12">
              <p className="text-gray-600 text-md">
                Nothing to see here... yet
              </p>
              <p className="text-neutral-400 text-sm">
                Your orders will appear here
              </p>
            </div>
          )}
        {resolvedMarketHoldingsPortfolioTab === 'all' &&
          resolvedMarketHoldings?.length > 0 &&
          resolvedMarketHoldings.map((holding) => {
            return (
              <HoldingCardDrawer
                key={holding.name}
                marketPrices={marketPrices}
                holding={holding}
                resolvedMarketHoldingsPortfolioTab={
                  resolvedMarketHoldingsPortfolioTab
                }
              />
            )
          })}

        {resolvedMarketHoldingsPortfolioTab === 'settled' &&
          !settledResolvedMarketHoldingsLoading &&
          settledResolvedMarketHoldings?.length === 0 && (
            <div className="flex flex-col gap-1 items-center pt-12">
              <p className="text-gray-600 text-md">
                Nothing to see here... yet
              </p>
              <p className="text-neutral-400 text-sm">
                Your matched orders will appear here
              </p>
            </div>
          )}
        {resolvedMarketHoldingsPortfolioTab === 'settled' &&
          settledResolvedMarketHoldings?.length > 0 &&
          settledResolvedMarketHoldings.map((holding) => {
            return (
              <HoldingCardDrawer
                key={holding.name}
                marketPrices={marketPrices}
                holding={holding}
                resolvedMarketHoldingsPortfolioTab={
                  resolvedMarketHoldingsPortfolioTab
                }
              />
            )
          })}
        {resolvedMarketHoldingsPortfolioTab === 'canceled' &&
          !canceledResolvedMarketHoldingsLoading &&
          canceledResolvedMarketHoldings?.length === 0 && (
            <div className="flex flex-col gap-1 items-center pt-12">
              <p className="text-gray-600 text-md">
                Nothing to see here... yet
              </p>
              <p className="text-neutral-400 text-sm">
                Your canceled orders will appear here
              </p>
            </div>
          )}
        {resolvedMarketHoldingsPortfolioTab === 'canceled' &&
          canceledResolvedMarketHoldingsLoading?.length > 0 &&
          canceledResolvedMarketHoldings.map((holding) => {
            return (
              <HoldingCardDrawer
                key={holding.name}
                marketPrices={marketPrices}
                holding={holding}
                resolvedMarketHoldingsPortfolioTab={
                  resolvedMarketHoldingsPortfolioTab
                }
              />
            )
          })}
      </div>
    </div>
  )
}

export default ResolvedMarketHoldings
