import Dummy from '@/assets/Dummy.svg'
import Hint from '@/assets/Hint.svg'
import DefaultUser from '@/assets/DefaultUser.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import {
  useFrappeEventListener,
  useFrappeGetDoc,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import MarketActivityDrawer from '../components/MarketActivityDrawer'
import Source from '@/assets/Source.svg'
import Research from '@/assets/Research.svg'
import ArrowRight from '@/assets/ArrowRight.svg'
import EventFooterImage from '@/assets/EventFooterImage.svg'
import ShareAndroid from '@/assets/ShareAndroid.svg'
import Back from '@/assets/Back.svg'
import BuyDrawer from '../components/BuyDrawer'
import OrderBook from '../components/OrderBook'
import Rules from '../components/Rules'

const EventDetails = () => {
  const navigate = useNavigate()
  const [market, setMarket] = useState({})
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [activeTab, setActiveTab] = useState('activity')
  const { id } = useParams()

  const { data: marketData, isLoading: marketDataLoading } = useFrappeGetDoc(
    'Market',
    id
  )

  const {
    data: tradesData,
    isLoading: tradesLoading,
    mutate: refetchTrades,
  } = useFrappeGetDocList(
    'Trades',
    {
      fields: [
        'name',
        'creation',
        'first_user_order_id',
        'first_user_price',
        'first_user_id',
        'second_user_order_id',
        'second_user_price',
        'second_user_id',
        'quantity',
      ],
      filters: { market_id: id },
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
      limit: 6,
    },
    activeTab === 'activity' ? undefined : null
  )

  useEffect(() => {
    if (!marketDataLoading && Object.values(marketData)) {
      setMarket(marketData)
    }
  }, [marketData])

  useFrappeEventListener('market_event', (updatedData) => {
    console.log('Hello: ', updatedData)
    if (updatedData.name !== id) return
    console.log('Updated Data: ', updatedData)
    setMarket(updatedData)
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen select-none">
      <div className="h-16 sticky top-0 select-none w-full p-4 border-b flex justify-between items-center gap-4 border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
        <div className="flex items-center gap-3">
          <img
            src={Back}
            alt=""
            className="cursor-pointer h-4 w-4"
            onClick={() => {
              navigate(-1)
            }}
          />
          <p className="font-[500] text-lg">
            Event {market?.name?.split('_')[2]}
          </p>
        </div>

        <div>
          <img src={ShareAndroid} alt="" />
        </div>
      </div>
      {market.status === 'OPEN' && isDrawerOpen && (
        <BuyDrawer
          market={market}
          selectedChoice={selectedChoice}
          setSelectedChoice={setSelectedChoice}
          marketId={id}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 flex flex-col gap-6">
          <div className="flex justify-between">
            <div className="w-[20%]">
              <img src={Dummy} alt="" />
            </div>
            <div className="font-[500] text-sm text-[#337265] w-[80%]">
              {market.question}
            </div>
          </div>
          <div className="flex justify-center items-center ">
            <p className="text-white bg-[#E26F64] px-6 py-2 font-[700] text-sm rounded-[5px]">
              PUNvsBLR
            </p>
          </div>
          <div className="py-2.5 px-[13px] flex items-center rounded-[5px] gap-[13px] bg-[white]">
            <div>
              <img src={Hint} alt="" />
            </div>
            <div className="font-[500] text-[13px] text-[#5F5F5F]">
              <p>H2H last 5 T20 : Punjab 1, Bengaluru 4, Braw 0</p>
            </div>
          </div>
        </div>
        <div className="bg-white pt-2 overflow-x-hidden">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-transparent gap-4 rounded-none p-0 px-4">
              <TabsTrigger
                value="activity"
                className="px-2 font-semibold rounded-none text-[16px] text-[#CBCBCB] data-[state=active]:bg-transparent data-[state=active]:border-x-0 data-[state=active]:border-t-0 data-[state=active]:border-b-[3px] data-[state=active]:border-[#000000] data-[state=active]:text-[#2C2D32] data-[state=active]:shadow-none"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                value="order_book"
                className="px-2 font-semibold rounded-none text-[16px] text-[#CBCBCB] data-[state=active]:bg-transparent data-[state=active]:border-x-0 data-[state=active]:border-t-0 data-[state=active]:border-b-[3px] data-[state=active]:border-[#000000] data-[state=active]:text-[#2C2D32] data-[state=active]:shadow-none"
              >
                Order Book
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity">
              <div className="border-none">
                {tradesData?.slice(0, 5)?.map((_) => {
                  const formatName = (name) =>
                    name?.length > 10
                      ? name?.slice(0, 10) + '…'
                      : name?.slice(0)
                  return (
                    <div
                      key={_.name}
                      className="flex justify-between items-center gap-4 border-b py-4 px-4"
                    >
                      {/* Left Prober */}
                      <div className="flex flex-col w-[25%] gap-2">
                        <div className="flex w-full items-center justify-center">
                          <img src={DefaultUser} alt="" />
                        </div>

                        <div className="text-[#5F5F5F] text-sm font-semibold text-center">
                          {formatName(_.first_user_id) || 'Prober'}
                        </div>
                      </div>

                      {/* Center Content */}
                      <div className="w-[50%] flex flex-col gap-1 items-center justify-center text-center">
                        {_.first_user_price === _.second_user_price ? (
                          <div className="w-full flex items-center">
                            <div
                              style={{ width: `50%` }}
                              className={`font-inter py-[5px] px-[10px] bg-gradient-to-r from-[rgba(255,255,255,0.5)] to-[rgba(73,44,130,0.5)] text-[#492C82] flex justify-start text-xs font-semibold`}
                            >
                              &#8377;
                              {parseFloat(_.first_user_price)?.toFixed(1)}
                            </div>
                            <div
                              style={{ width: `50%` }}
                              className={`font-inter py-[5px] px-[10px] bg-gradient-to-r from-[rgba(226,111,100,0.5)] to-[rgba(255,255,255,0.5)] text-[#B74136] flex justify-end text-xs font-semibold`}
                            >
                              &#8377;
                              {parseFloat(_.second_user_price)?.toFixed(1)}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full flex items-center">
                            <div
                              style={{ width: `${_.first_user_price * 10}%` }}
                              className={`font-inter py-[5px] px-[10px] bg-gradient-to-r from-[rgba(255,255,255,0.5)] to-[rgba(73,44,130,0.5)] text-[#492C82] flex justify-start text-xs font-semibold`}
                            >
                              &#8377;
                              {parseFloat(_.first_user_price)?.toFixed(1)}
                            </div>
                            <div
                              style={{ width: `${_.second_user_price * 10}%` }}
                              className={`font-inter py-[5px] px-[10px] bg-gradient-to-r from-[rgba(226,111,100,0.5)] to-[rgba(255,255,255,0.5)] text-[#B74136] flex justify-end text-xs font-semibold`}
                            >
                              &#8377;
                              {parseFloat(_.second_user_price)?.toFixed(1)}
                            </div>
                          </div>
                        )}
                        <div className="text-[#5F5F5F] text-[11px] font-[500]">
                          a few seconds ago
                        </div>
                      </div>

                      {/* Right Prober */}
                      <div className="flex flex-col w-[25%] gap-2">
                        <div className="flex w-full items-center justify-center">
                          <img src={DefaultUser} alt="" />
                        </div>

                        <div className="text-[#5F5F5F] text-sm font-semibold text-center">
                          {formatName(_.second_user_id) || 'Prober'}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {tradesData?.length > 5 && (
                  <div className="flex justify-center items-center py-6 bg-[#F5F5F5]">
                    <MarketActivityDrawer tradesData={tradesData} />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="order_book">
              <div className="px-4 py-4">
                <OrderBook marketId={id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="bg-white space-y-[4px]">
          <div className="px-4 py-4">
            <p className="font-semibold text-base text-[#2C2D32]">
              Activity the event
            </p>
          </div>
          <div className="px-4 grid grid-cols-2 gap-2">
            <div className="py-[10px] px-[13px] space-y-[4px] bg-[#FFF8F2] rounded-[5px]">
              <p className="font-normal text-xs leading-[22px] text-[#2C2D32]">
                Traders
              </p>
              <p className="font-semibold text-sm text-[#C86605]">
                {market.total_traders}
              </p>
            </div>
            <div className="py-[10px] px-[13px] space-y-[4px] bg-[#FFF8F2] rounded-[5px]">
              <p className="font-normal text-xs leading-[22px] text-[#2C2D32]">
                Volume
              </p>
              <p className="font-semibold font-inter text-sm text-[#C86605]">
                &#8377;{market.total_investment}
              </p>
            </div>
            <div className="py-[10px] px-[13px] space-y-[4px] bg-[#FFF8F2] rounded-[5px]">
              <p className="font-normal text-xs leading-[22px] text-[#2C2D32]">
                Started at
              </p>
              <p className="font-semibold text-sm text-[#C86605]">
                {formatDate(market.creation)}
              </p>
            </div>
            <div className="py-[10px] px-[13px] space-y-[4px] bg-[#FFF8F2] rounded-[5px]">
              <p className="font-normal text-xs leading-[22px] text-[#2C2D32]">
                Ending at
              </p>
              <p className="font-semibold text-sm text-[#C86605]">
                {formatDate(market.closing_time)}
              </p>
            </div>
          </div>
          <div className="space-y-[10px] px-4 py-[15px]">
            <div className="flex items-center justify-between border-[#03B591] bg-gradient-to-r from-[#E8FFFA] to-[#FFFFFF] py-[10px] px-[13px] rounded-[5px]">
              <div className="flex items-center gap-[13px]">
                <img src={Research} alt="" />
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-[#2C2D32]">
                    Overview
                  </p>
                  <p className="font-normal text-xs text-[#5F5F5F]">
                    Information about event
                  </p>
                </div>
              </div>
              <div>
                <img src={ArrowRight} alt="" />
              </div>
            </div>
            <div className="flex items-center justify-between border-[#03B591] bg-gradient-to-r from-[#E8FFFA] to-[#FFFFFF] py-[10px] px-[13px] rounded-[5px]">
              <div className="flex items-center gap-[13px]">
                <img src={Source} alt="" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-[#2C2D32]">
                    Source of Truth
                  </p>
                  <p className="font-normal text-xs text-[#5F5F5F]">
                    Information about source of truth
                  </p>
                </div>
              </div>
              <div>
                <img src={ArrowRight} alt="" />
              </div>
            </div>

            <Rules />
          </div>
          <div className="w-full">
            <img src={EventFooterImage} className="w-full" alt="" />
          </div>
        </div>
      </div>
      {market.status === 'OPEN' ? (
        <div className="bg-white sticky bottom-0 z-[50] pb-4 border-t border-[#DBC5F7]">
          <div className="flex justify-between px-4 py-2.5 gap-2">
            <button
              className="flex gap-2 justify-center items-center bg-[#F2EBFF] text-[#492C82] rounded-[6px] w-[50%] font-[500] text-xs"
              onClick={() => {
                setSelectedChoice('YES')
                setIsDrawerOpen(true)
              }}
            >
              <span>YES</span>
              <span className="font-inter font-medium">
                &#8377;{market.yes_price?.toFixed(1)}
              </span>
            </button>

            <button
              className="py-2 flex gap-2 justify-center items-center bg-[#F6DFDD] text-[#B74136] rounded-[6px] w-[50%] font-[500] text-xs"
              onClick={() => {
                setSelectedChoice('NO')
                setIsDrawerOpen(true)
              }}
            >
              <span>NO</span>
              <span className="font-inter font-medium">
                &#8377;{market.no_price?.toFixed(1)}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default EventDetails
