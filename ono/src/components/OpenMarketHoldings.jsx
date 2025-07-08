import CricketImage from '@/assets/CricketImage.svg'
import DownArrowIcon from '@/assets/DownArrowIcon.svg'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import X from '@/assets/X.svg'
import Back from '@/assets/Back.svg'

import CircleCrossIcon from '@/assets/CircleCrossIcon.svg'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetDoc,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import ExitSellOrders from './ExitSellOrders'

const OpenMarketHoldings = ({ marketPrices }) => {
  const { market_id } = useParams()

  const { currentUser } = useFrappeAuth()

  const [openMarketHoldingsPortfolioTab, setOpenMarketHoldingsPortfolioTab] =
    useState(localStorage.getItem('openMarketHoldingsPortfolioTab') || 'all')

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
        filters: [
          ['user_id', '=', currentUser],
          ['market_id', '=', market_id],
          ['market_status', '=', 'OPEN'],
        ],
      },
      currentUser && market_id ? undefined : null
    )

  const {
    data: pendingOpenMarketHoldings,
    isLoading: pendingOpenMarketHoldingsLoading,
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
        ['market_status', '=', 'OPEN'],
        ['status', '=', 'UNMATCHED'],
      ],
    },
    currentUser && market_id && openMarketHoldingsPortfolioTab === 'pending'
      ? undefined
      : null
  )

  const {
    data: matchedOpenMarketHoldings,
    isLoading: matchedOpenMarketHoldingsLoading,
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
        ['market_status', '=', 'OPEN'],
        ['status', '=', 'MATCHED'],
      ],
    },
    currentUser && market_id && openMarketHoldingsPortfolioTab === 'matched'
      ? undefined
      : null
  )

  const {
    data: exitingOpenMarketHoldings,
    isLoading: exitingOpenMarketHoldingsLoading,
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
        ['market_status', '=', 'OPEN'],
        ['status', '=', 'EXITING'],
      ],
    },
    currentUser && market_id && openMarketHoldingsPortfolioTab === 'exiting'
      ? undefined
      : null
  )

  const {
    data: exitedOpenMarketHoldings,
    isLoading: exitedOpenMarketHoldingsLoading,
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
        ['market_status', '=', 'OPEN'],
        ['status', '=', 'EXITED'],
      ],
    },
    currentUser && market_id && openMarketHoldingsPortfolioTab === 'exited'
      ? undefined
      : null
  )

  const {
    data: canceledOpenMarketHoldings,
    isLoading: canceledOpenMarketHoldingsLoading,
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
        ['market_status', '=', 'OPEN'],
        ['status', '=', 'CANCELED'],
      ],
    },
    currentUser && market_id && openMarketHoldingsPortfolioTab === 'canceled'
      ? undefined
      : null
  )

  console.log('Open :', openMarketHoldings)
  console.log('market: ', marketPrices)

  const handleTabChange = (value) => {
    localStorage.setItem('openMarketHoldingsPortfolioTab', value)
    setOpenMarketHoldingsPortfolioTab(value)
  }

  const tabKeys = ['all', 'matched', 'exiting', 'exited', 'cancelled']
  const tabRefs = tabKeys.reduce((acc, key) => {
    acc[key] = useRef(null)
    return acc
  }, {})

  useEffect(() => {
    if (tabRefs[openMarketHoldingsPortfolioTab]?.current) {
      tabRefs[openMarketHoldingsPortfolioTab].current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [openMarketHoldingsPortfolioTab])

  const navigate = useNavigate()
  return (
    <div className="leading-[100%] bg-[#F5F5F5] w-full">
      <div className="sticky z-[50] top-0 left-0 right-0 flex flex-col font-inter max-w-md mx-auto pt-4 bg-white mb-auto w-full select-none">
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
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-4 items-center pb-8 pt-6">
          <div>
            <img src={CricketImage} alt="" />
          </div>
          <div>
            <p className="font-normal text-sm text-[#2C2D32]">
              Hyderabad to win the match vs Mumbai?
            </p>
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
          <div className="flex flex-col gap-4 items-center p-4 rounded-[5px] bg-white">
            <div className="flex flex-col gap-1 items-center">
              <p className="font-normal text-xs">Live Returns</p>
              <p className="flex items-center gap-1">
                <span>
                  <img src={DownArrowIcon} alt="" />
                </span>
                <span className="font-inter font-semibold text-sm">
                  &#8377;
                  {openMarketHoldings
                    ?.reduce((acc, holding) => {
                      if (holding.opinion_type === 'YES') {
                        acc =
                          acc +
                          marketPrices.market_yes_price *
                            (holding.quantity - holding.filled_quantity) -
                          holding.price *
                            (holding.quantity - holding.filled_quantity)
                      } else {
                        acc =
                          acc +
                          marketPrices.market_no_price *
                            (holding.quantity - holding.filled_quantity) -
                          holding.price *
                            (holding.quantity - holding.filled_quantity)
                      }
                      return acc
                    }, 0)
                    .toFixed(1)}
                </span>
              </p>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex flex-col items-start">
                <p className="font-normal text-xs text-[#5F5F5F]">Investment</p>
                <p className="font-inter font-semibold text-xl">
                  &#8377;
                  {openMarketHoldings
                    ?.reduce(
                      (acc, holding) =>
                        acc +
                        holding.price *
                          (holding.quantity - holding.filled_quantity),
                      0
                    )
                    .toFixed(1)}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-normal text-xs text-[#5F5F5F]">
                  Current Value
                </p>
                <p className="font-inter font-semibold text-xl">
                  &#8377;
                  {openMarketHoldings
                    ?.reduce((acc, holding) => {
                      if (holding.opinion_type === 'YES') {
                        acc =
                          acc +
                          marketPrices.market_yes_price *
                            (holding.quantity - holding.filled_quantity)
                      } else {
                        acc =
                          acc +
                          marketPrices.market_no_price *
                            (holding.quantity - holding.filled_quantity)
                      }
                      return acc
                    }, 0)
                    .toFixed(1)}
                </p>
              </div>
            </div>
            <div className="w-full flex items-center justify-between gap-4 text-xs font-medium">
              <div className="w-[50%] text-center rounded-[20px] border py-2.5 px-4 bg-white text-[#2C2D32] cursor-pointer">
                INVEST
              </div>
              <div className="w-[50%] text-center rounded-[20px] border py-2.5 px-4 bg-[#2C2D32] text-white cursor-pointer">
                EXIT
              </div>
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

            {(() => {
              const unmatchedHoldings = openMarketHoldings
                ?.filter((holding) => holding.status === 'UNMATCHED')
                ?.reduce(
                  (acc, holding) =>
                    acc + holding.quantity - holding.filled_quantity,
                  0
                )

              if (unmatchedHoldings === 0) return null

              return (
                <div className="w-full flex gap-4 items-center border-dashed border-t-[0.7px] pt-4">
                  <div className="flex items-center gap-2 border rounded-full cursor-pointer">
                    <span className="font-normal font-inter text-[10px] text-[#2C2D32] px-1 pl-3.5">
                      {unmatchedHoldings} unmatched
                    </span>
                    <Separator orientation="vertical" className="h-8" />
                    <span className="flex items-center justify-center px-1 pr-4">
                      <img src={CircleCrossIcon} alt="" />
                    </span>
                  </div>
                </div>
              )
            })()}
            {(() => {
              const exitingHoldings = openMarketHoldings
                ?.filter((holding) => holding.status === 'EXITING')
                ?.reduce(
                  (acc, holding) =>
                    acc + holding.quantity - holding.filled_quantity,
                  0
                )
              if (exitingHoldings === 0) return null
              return (
                <div className="w-full flex gap-4 items-center border-dashed border-t-[0.7px] pt-4">
                  <div className="flex items-center gap-2 border rounded-full cursor-pointer">
                    <span className="font-normal font-inter text-[10px] text-[#2C2D32] px-1 pl-3.5">
                      {exitingHoldings} exiting
                    </span>
                    <Separator orientation="vertical" className="h-8" />
                    <span className="flex items-center justify-center px-1 pr-4">
                      <img src={CircleCrossIcon} alt="" />
                    </span>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        <div className="w-full overflow-x-auto scrollbar-hide">
          <Tabs
            className="w-full py-4 font-[500] text-xs"
            value={openMarketHoldingsPortfolioTab}
            onValueChange={handleTabChange}
          >
            <div className="bg-[#F5F5F5]">
              <TabsList className="flex flex-nowrap w-max rounded-full space-x-2 bg-transparent text-[#2C2D32] p-0 h-6 pl-4 pr-4">
                {[
                  'all',
                  'pending',
                  'matched',
                  'exiting',
                  'exited',
                  'canceled',
                ].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    ref={tabRefs[tab]}
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

        <div className="flex flex-col gap-4 p-4">
          {  openMarketHoldings?.length > 0 &&
            openMarketHoldings.map((holding) => {
              return (
                <div    
                  key={holding.name}
                  className="bg-white rounded-[5px] p-4 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    {holding.opinion_type === 'YES' && (
                      <p className="font-semibold text-xl text-[#492C82]">
                        YES
                      </p>
                    )}
                    {holding.opinion_type === 'NO' && (
                      <p className="font-semibold text-xl text-[#E26F64]">NO</p>
                    )}
                    {holding.status === 'UNMATCHED' && (
                      <div className="flex items-center gap-2 border rounded-full cursor-pointer">
                        <span className="font-normal font-inter text-[10px] text-[#2C2D32] px-1 pl-3.5">
                          {holding.quantity - holding.filled_quantity} unmatched
                        </span>
                        <Separator orientation="vertical" className="h-8" />
                        <span className="flex items-center justify-center px-1 pr-4">
                          <img src={CircleCrossIcon} alt="" />
                        </span>
                      </div>
                    )}
                    {holding.status === 'EXITING' && (
                      <div className="flex items-center gap-2 border rounded-full cursor-pointer">
                        <span className="font-normal font-inter text-[10px] text-[#2C2D32] px-1 pl-3.5">
                          {holding.quantity - holding.filled_quantity} exiting
                        </span>
                        <Separator orientation="vertical" className="h-8" />
                        <span className="flex items-center justify-center px-1 pr-4">
                          <img src={CircleCrossIcon} alt="" />
                        </span>
                      </div>
                    )}
                    {holding.status === 'ACTIVE' && (
                      <div className="font-medium text-xs text-[#2C2D32] border border-[#CBCBCB] rounded-[20px] py-2.5 px-7">
                        Exit
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1 items-start">
                      <p className="font-normal text-xs text-[#5F5F5F]">
                        Investment
                      </p>
                      <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                        &#8377;
                        {holding.price *
                          (holding.quantity - holding.filled_quantity)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <p className="font-normal text-xs text-[#5F5F5F]">
                        Current Value
                      </p>
                      {holding.opinion_type === 'YES' ? (
                        <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                          &#8377;
                          {marketPrices.market_yes_price *
                            (holding.quantity - holding.filled_quantity)}
                        </p>
                      ) : null}
                      {holding.opinion_type === 'NO' ? (
                        <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                          &#8377;
                          {marketPrices.market_no_price *
                            (holding.quantity - holding.filled_quantity)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default OpenMarketHoldings
