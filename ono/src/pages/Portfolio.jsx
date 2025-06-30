import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BriefcaseIcon from '@/assets/Briefcase.svg'
import ClosedEventsInactiveIcon from '@/assets/ClosedEventsInactiveIcon.svg'
import OpenEventsActiveIcon from '@/assets/OpenEventsActiveIcon.svg'
import OpenEventsInActiveIcon from '@/assets/OpenEventsInactiveIcon.svg'
import ClosedEventsActiveIcon from '@/assets/ClosedEventsActiveIcon.svg'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import InfoIcon from '@/assets/Info.svg'
import CricketIcon from '@/assets/CricketImage.svg'
import ExitDoorIcon from '@/assets/ExitDoorIcon.svg'
import UnmatchedIcon from '@/assets/UnmatchedIcon.svg'
import { ChevronRight, CircleGauge } from 'lucide-react'
import {
  useFrappeGetCall,
  useFrappeGetDocList,
  useSWRConfig,
} from 'frappe-react-sdk'
import Back from '@/assets/Back.svg'
import ExitSellOrders from '../components/ExitSellOrders'
import CancelSellOrders from '../components/CancelSellOrders'
import CancelBuyOrders from '../components/CancelBuyOrders'

const Portfolio = () => {
  // const { status = 'open' } = useParams()

  const navigate = useNavigate()

  const [currentPortfolioTab, setCurrentPortfolioTab] = useState(
    localStorage.getItem('currentPortfolioTab') || 'open'
  )

  // const validTabs = ['open', 'closed']
  // If the status is invalid (e.g. `/events/foo`) → redirect to open

  const {
    data: marketwiseActiveHoldings,
    isLoading: marketwiseActiveHoldingsLoading,
  } = useFrappeGetCall(
    'rewardapp.engine.get_marketwise_holding',
    currentPortfolioTab === 'open' ? ['active_marketwise_holdings'] : null
  )

  console.log('Portfolio: ', marketwiseActiveHoldings)

  const handleTabChange = (value) => {
    localStorage.setItem('currentPortfolioTab', value)
    setCurrentPortfolioTab(value)
  }

  function getMarketPortfolioStatus(positionObj) {
    const statuses = []

    // 1. UNMATCHED is top priority (can also include EXITING)
    if ('UNMATCHED' in positionObj) {
      statuses.push('UNMATCHED')
      if ('EXITING' in positionObj) {
        statuses.push('EXITING')
      }
      return statuses
    }

    // 2. EXITING overrides ACTIVE
    if ('EXITING' in positionObj) {
      statuses.push('EXITING')
      return statuses
    }

    // 3. ACTIVE (only if no unmatched or exiting)
    if ('ACTIVE' in positionObj) {
      statuses.push('ACTIVE')
      return statuses
    }

    // 4. EXITED (only if none of the above)
    if ('EXITED' in positionObj) {
      statuses.push('EXITED')
      return statuses
    }

    // 5. CANCELLED (lowest)
    if ('CANCELLED' in positionObj) {
      statuses.push('CANCELLED')
      return statuses
    }

    return statuses
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'UNMATCHED':
        return 'bg-[#FEF0E8] text-[#EF7C35]'
      case 'EXITING':
        return 'bg-[#EAF3FF] text-[#0058CC]'
      case 'CANCELLED':
        return 'bg-[#F2F2F2] text-[#5F5F5F]'
      case 'EXITED':
        return 'bg-[#FFEDEA] text-[#E02400]'
      case 'ACTIVE':
        return 'bg-[#337265]/20 text-[#1C895E]'
      default:
        return 'bg-gray-300 text-black'
    }
  }

  return (
    <div className="leading-[100%] bg-[#F5F5F5] ">
      <div className="sticky z-[50] top-0 left-0 right-0 flex flex-col max-w-md mx-auto pt-4 bg-white mb-auto">
        <div className="border-[0.33px] border-x-0 border-t-0 border-b border-[#DBC5F7] w-full flex items-center gap-2 pb-4 px-4">
          <span>
            <img
              className="h-4 w-4 cursor-pointer"
              onClick={() => {
                navigate(-1)
              }}
              src={Back}
              alt=""
            />
          </span>
          <h1 className="text-xl font-[500] text-[#2C2D32]">My Portfolio</h1>
        </div>
        <Tabs
          className="w-full font-[500] text-xs"
          value={currentPortfolioTab}
          onValueChange={handleTabChange}
        >
          <div className="w-full left-0 right-0 bg-[#F5F5F5] z-[50] px-4 py-6">
            <TabsList className="w-full rounded-full space-x-2 bg-transparent text-[#2C2D32] p-0 h-8">
              <TabsTrigger
                value="open"
                className="w-full py-2.5 space-x-2 rounded-full border bg-white data-[state=active]:text-[#EFF0FF] data-[state=active]:bg-[#492C82] text-[13px] font-light h-auto"
              >
                <span>
                  <img
                    src={
                      currentPortfolioTab === 'open'
                        ? OpenEventsActiveIcon
                        : OpenEventsInActiveIcon
                    }
                    alt=""
                  />
                </span>
                <span>Open Events</span>
              </TabsTrigger>
              <TabsTrigger
                value="closed"
                className="w-full py-2.5 space-x-2 rounded-full border bg-white data-[state=active]:text-[#EFF0FF] data-[state=active]:bg-[#E26F64] text-[13px] font-light h-auto"
              >
                <span>
                  <img
                    src={
                      currentPortfolioTab === 'closed'
                        ? ClosedEventsActiveIcon
                        : ClosedEventsInactiveIcon
                    }
                    alt=""
                  />
                </span>
                <span>Closed Events</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {currentPortfolioTab === 'open' && (
        <>
          <div className="bg-[#F5F5F5] pb-2 max-w-md mx-auto relative px-4">
            <div className="bg-[#FFF8F2] p-4 flex flex-col font-inter gap-4 rounded-[5px] border-[0.5px] border-[#E26F64]">
              <div className="flex gap-1 justify-between items-center">
                <div className="flex items-center gap-1">
                  <div>
                    <img src={BriefcaseIcon} className="" alt="" />
                  </div>
                  <div className="font-inter text-sm text-[#E26F64]">
                    Portfolio
                  </div>
                </div>
                <div>
                  <img src={InfoIcon} alt="" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col  items-center">
                  <span className="font-semibold text-xl">&#8377;5.5</span>
                  <span className="font-normal text-xs">Investment</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-xl text-[#DB342C]">
                    &#8377;5.4
                  </span>
                  <span className="font-normal text-xs">Investment</span>
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <span className="font-normal text-xs">
                Live Gains - &#8377;0.1
              </span>
            </div>
          </div>

          <div className="pb-2 pt-2 space-y-4 px-4">
            {marketwiseActiveHoldings?.message &&
              Object.values(marketwiseActiveHoldings?.message)?.map(
                (marketHolding) => {
                  const statuses = marketHolding
                    ? getMarketPortfolioStatus(marketHolding)
                    : []
                  return (
                    <div
                      key={marketHolding.market_id}
                      className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]"
                      onClick={(e) => {
                        navigate(`/portfolio/open/${marketHolding.market_id}`)
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {statuses.map((status) => (
                          <p
                            key={status}
                            className={`px-1.5 text-[8px] font-[500] tracking-[2%] rounded-[2px] ${getStatusBadgeClass(
                              status
                            )}`}
                          >
                            {status}
                          </p>
                        ))}
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="w-[10%]">
                          <img src={CricketIcon} alt="" />
                        </div>
                        <div className="w-[90%] flex font-normal text-xs">
                          {marketHolding.question}
                        </div>
                      </div>
                      {statuses.includes('UNMATCHED') && (
                        <div className="flex items-center justify-between border-t-[0.7px] pt-3">
                          <div className="font-normal text-[10px] flex items-center gap-2 p-1">
                            <span>
                              <img src={UnmatchedIcon} alt="" />
                            </span>
                            <span className="font-normal text-[10px] text-[#A2845E]">
                              Unmatched qty:{' '}
                              <span className="font-inter">5.0</span>
                            </span>
                          </div>
                          <CancelBuyOrders market={marketHolding} />
                        </div>
                      )}
                      {!statuses.includes('UNMATCHED') &&
                        statuses.includes('EXITING') && (
                          <div className="flex items-center justify-between border-t-[0.7px] pt-3">
                            <div className="font-normal text-[10px] flex items-center gap-1 p-1 bg-[linear-gradient(90deg,_#FFEAD3_0%,_#FFFFFF_100%)]">
                              <span>
                                <img src={ExitDoorIcon} alt="" />
                              </span>
                              <span className="font-normal text-[10px] text-[#9C3C00]">
                                Exited: <span className="font-inter">0/5</span>
                              </span>
                            </div>
                            <CancelSellOrders market={marketHolding} />
                          </div>
                        )}
                      {!statuses.includes('UNMATCHED') &&
                        !statuses.includes('EXITING') &&
                        statuses.includes('ACTIVE') && (
                          <div className="flex items-center justify-between border-t-[0.7px] pt-3">
                            <span
                              className="font-normal text-[10px] flex items-center gap-2 p-1"
                              style={{
                                background:
                                  'linear-gradient(90deg, #FFD6D3 0%, rgba(255, 231, 228, 0) 100%)',
                              }}
                            >
                              Invested &#8377;5.5{' '}
                              <span className="flex border bg-[#2C2D32] -mx-1"></span>{' '}
                              <span>Gains - &#8377;0.1</span>
                            </span>
                            <ExitSellOrders market={marketHolding} />
                          </div>
                        )}
                    </div>
                  )
                }
              )}
          </div>
        </>
      )}
      {currentPortfolioTab === 'closed' && (
        <>
          <div className="bg-[#F5F5F5] pb-2 max-w-md mx-auto relative px-4">
            <div className="bg-[#FFF8F2] p-4 flex flex-col font-inter gap-4 rounded-[5px] border-[0.5px] border-[#E26F64]">
              <div className="flex gap-1 justify-between items-center">
                <div className="flex items-center gap-1">
                  <div>
                    <img src={BriefcaseIcon} className="" alt="" />
                  </div>
                  <div className="font-inter text-sm text-[#E26F64]">
                    Portfolio
                  </div>
                </div>
                <div>
                  <img src={InfoIcon} alt="" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col  items-center">
                  <span className="font-semibold text-xl">&#8377;5.5</span>
                  <span className="font-normal text-xs">Investment</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-xl text-[#DB342C]">
                    &#8377;5.4
                  </span>
                  <span className="font-normal text-xs">Investment</span>
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <span className="font-normal text-xs">
                Live Gains - &#8377;0.1
              </span>
            </div>
          </div>

          <div className="pb-2 pt-2 space-y-4 px-4">
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-normal text-[10px] flex items-center gap-2 p-1"
                  style={{
                    background:
                      'linear-gradient(90deg, #FFD6D3 0%, rgba(255, 231, 228, 0) 100%)',
                  }}
                >
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span>{' '}
                  <span>Gains - &#8377;0.1</span>
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-[10px] flex items-center gap-2">
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span> Gains
                  - &#8377;0.1
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-[10px] flex items-center gap-2">
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span> Gains
                  - &#8377;0.1
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Portfolio
