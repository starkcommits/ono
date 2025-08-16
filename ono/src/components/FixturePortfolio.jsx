import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BriefcaseGreen from '@/assets/BriefcaseGreen.svg'
import BriefcaseRed from '@/assets/BriefcaseRed.svg'
import ProfitUpArrow from '@/assets/ProfitUpArrow.svg'
import LossDownArrow from '@/assets/LossDownArrow.svg'

import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import InfoIcon from '@/assets/Info.svg'
import BriefcasePurple from '@/assets/BriefcasePurple.svg'
import CricketIcon from '@/assets/CricketImage.svg'
import ExitDoorIcon from '@/assets/ExitDoorIcon.svg'
import UnmatchedIcon from '@/assets/UnmatchedIcon.svg'
import ClosedYesOpinionIcon from '@/assets/ClosedYesOpinionIcon.svg'
import ClosedNoOpinionIcon from '@/assets/ClosedNoOpinionIcon.svg'
import NoTrades from '@/assets/NoTrades.svg'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetCall,
  useFrappeGetDocList,
  useSWRConfig,
} from 'frappe-react-sdk'
import Back from '@/assets/Back.svg'
import ExitSellOrders from '../components/ExitSellOrders'
import CancelSellOrders from '../components/CancelSellOrders'
import CancelBuyOrders from '../components/CancelBuyOrders'
import { MarketEventListener } from './MarketEventListener'

const FixturePortfolio = ({
  currentPortfolioTab,
  marketwiseActiveHoldings,
}) => {
  // const { status = 'open' } = useParams()

  const { currentUser } = useFrappeAuth()

  const navigate = useNavigate()

  const [isInfoActiveDrawerOpen, setIsInfoActiveDrawerOpen] = useState(false)
  const [isInfoClosedDrawerOpen, setIsInfoClosedDrawerOpen] = useState(false)

  const { data: { message: marketwiseClosedHoldingsData } = {} } =
    useFrappeGetCall(
      'rewardapp.engine.total_returns',
      {
        user_id: currentUser,
      },
      currentUser && currentPortfolioTab === 'closed'
        ? ['closed_marketwise_holdings']
        : null
    )

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
    if ('CANCELED' in positionObj) {
      statuses.push('CANCELED')
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
      case 'CANCELED':
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
    <div className="leading-[100%] bg-[#F5F5F5] select-none">
      {currentPortfolioTab === 'open' && (
        <>
          <div className="pb-2 relative px-4">
            {(() => {
              const total_investment = Object.values(
                marketwiseActiveHoldings
              ).reduce(
                (acc, marketHolding) => acc + marketHolding.total_invested,
                0
              )

              const current_value = Object.values(
                marketwiseActiveHoldings
              ).reduce((acc, market) => {
                const yesPrice = market.yes_price || 0
                const noPrice = market.no_price || 0

                // Calculate value from ACTIVE and EXITING positions
                const activeExitingValue = [
                  market.ACTIVE,
                  market.EXITING,
                ].reduce((positionAcc, position) => {
                  if (!position) return positionAcc

                  const yesQty =
                    (position?.YES?.total_quantity || 0) -
                    (position?.YES?.total_filled_quantity || 0)
                  const noQty =
                    (position?.NO?.total_quantity || 0) -
                    (position?.NO?.total_filled_quantity || 0)

                  return positionAcc + yesQty * yesPrice + noQty * noPrice
                }, 0)

                const unmatchedYesInvested =
                  market?.UNMATCHED?.YES?.total_invested || 0
                const unmatchedNoInvested =
                  market?.UNMATCHED?.NO?.total_invested || 0

                const unmatchedValue =
                  unmatchedYesInvested + unmatchedNoInvested

                return acc + activeExitingValue + unmatchedValue
              }, 0)

              if (Object.values(marketwiseActiveHoldings).length === 0)
                return (
                  <div className="flex flex-col justify-center items-center text-black min-h-[400px]">
                    <img src={NoTrades} className="h-20 w-20" alt="" />
                    <p className="text-sm font-normal text-[#5F5F5F]">
                      No Active Trades
                    </p>
                  </div>
                )

              if (total_investment > 0 && current_value > 0)
                return (
                  <div
                    className={`${
                      current_value > total_investment
                        ? 'border-[#337265] bg-[#F7FFFD]'
                        : ''
                    } ${
                      current_value < total_investment
                        ? 'border-[#E26F64] bg-[#FFF8F2]'
                        : ''
                    } ${
                      current_value === total_investment
                        ? 'bg-white border-transparent'
                        : ''
                    } p-4 flex flex-col font-inter gap-4 rounded-[5px] border-[0.5px] `}
                  >
                    <div className="flex gap-1 justify-between items-center">
                      <div className="flex items-center gap-1">
                        <div>
                          {current_value >= total_investment && (
                            <img src={BriefcaseGreen} className="" alt="" />
                          )}
                          {current_value < total_investment && (
                            <img src={BriefcaseRed} className="" alt="" />
                          )}{' '}
                        </div>
                        <div
                          className={`font-inter text-sm ${
                            current_value > total_investment
                              ? 'text-[#337265]'
                              : ''
                          } ${
                            current_value < total_investment
                              ? 'text-[#E26F64]'
                              : ''
                          }`}
                        >
                          Portfolio
                        </div>
                      </div>
                      <div>
                        <Drawer
                          open={isInfoActiveDrawerOpen}
                          onOpenChange={setIsInfoActiveDrawerOpen}
                          className=""
                        >
                          <DrawerTrigger className="w-full h-full">
                            <div>
                              <img src={InfoIcon} alt="" />
                            </div>
                          </DrawerTrigger>
                          <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
                            <div className="flex flex-col gap-4 text-[#5F5F5F] p-4">
                              <div className="flex items-center gap-[23px]">
                                <p className="text-xs font-semibold w-[20%]">
                                  Current Value:
                                </p>
                                <p className="text-xs font-normal leading-[15px] w-[80%]">
                                  Current market value of your investment
                                  according to last traded price
                                </p>
                              </div>
                              <div className="flex items-center justify-between gap-[23px]">
                                <p className="text-xs font-semibold w-[20%]">
                                  Live Gains:
                                </p>
                                <p className="text-xs font-normal leading-[15px] w-[80%]">
                                  Difference between the current market value of
                                  your investment and the original investment
                                  amount
                                </p>
                              </div>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-xl">
                          &#8377;
                          {total_investment.toFixed(1)}
                        </span>
                        <span className="font-normal text-xs">Investment</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span
                          className={`font-semibold text-xl ${
                            current_value > total_investment
                              ? 'text-[#337265]'
                              : ''
                          } ${
                            current_value < total_investment
                              ? 'text-[#E26F64]'
                              : ''
                          }`}
                        >
                          &#8377;
                          {current_value.toFixed(1)}
                        </span>
                        <span className="font-normal text-xs">
                          Current Value
                        </span>
                      </div>
                    </div>
                    <div className="w-full">
                      <Separator></Separator>
                    </div>
                    <span className="font-normal text-xs flex items-center gap-1">
                      <span>Live Gains: </span>
                      <span className="font-inter font-medium flex items-center gap-0.5">
                        <span
                          className={`${
                            current_value > total_investment
                              ? 'text-[#337265]'
                              : ''
                          } ${
                            current_value < total_investment
                              ? 'text-[#E26F64]'
                              : ''
                          }`}
                        >
                          &#8377;
                          {Math.abs(current_value - total_investment).toFixed(
                            1
                          )}
                        </span>
                        <span>
                          {current_value > total_investment && (
                            <img src={ProfitUpArrow} alt="" />
                          )}
                          {current_value < total_investment && (
                            <img src={LossDownArrow} alt="" />
                          )}
                        </span>
                      </span>
                    </span>
                  </div>
                )
            })()}
          </div>

          <div className="pb-2 pt-2 space-y-4 px-4">
            {marketwiseActiveHoldings &&
              Object.values(marketwiseActiveHoldings)?.map((marketHolding) => {
                const statuses = marketHolding
                  ? getMarketPortfolioStatus(marketHolding)
                  : []
                return (
                  <div
                    key={marketHolding.market_id}
                    className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]"
                    onClick={(e) => {
                      navigate(`/portfolio/${marketHolding.market_id}`, {
                        state: {
                          market: marketHolding,
                        },
                      })
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
                            {marketHolding?.UNMATCHED?.YES &&
                            marketHolding?.UNMATCHED?.NO ? (
                              <span className="font-inter">
                                {marketHolding?.UNMATCHED?.YES?.total_quantity -
                                  marketHolding?.UNMATCHED?.YES
                                    ?.total_filled_quantity +
                                  (marketHolding?.UNMATCHED?.NO
                                    ?.total_quantity -
                                    marketHolding?.UNMATCHED?.NO
                                      ?.total_filled_quantity)}
                              </span>
                            ) : null}
                            {marketHolding?.UNMATCHED?.YES &&
                            !marketHolding?.UNMATCHED?.NO ? (
                              <span>
                                {marketHolding?.UNMATCHED?.YES?.total_quantity -
                                  marketHolding?.UNMATCHED?.YES
                                    ?.total_filled_quantity}
                              </span>
                            ) : null}
                            {marketHolding?.UNMATCHED?.NO &&
                            !marketHolding?.UNMATCHED?.YES ? (
                              <span>
                                {marketHolding?.UNMATCHED?.NO?.total_quantity -
                                  marketHolding?.UNMATCHED?.NO
                                    ?.total_filled_quantity}
                              </span>
                            ) : null}
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
                              Exited:{' '}
                              <span className="font-inter">
                                {marketHolding.EXITING.YES &&
                                marketHolding.EXITING.NO
                                  ? `${
                                      marketHolding.EXITING.YES
                                        .total_filled_quantity +
                                      marketHolding.EXITING.NO
                                        .total_filled_quantity
                                    }/${
                                      marketHolding.EXITING.YES.total_quantity +
                                      marketHolding.EXITING.NO.total_quantity
                                    }`
                                  : null}
                                {marketHolding.EXITING.YES &&
                                !marketHolding.EXITING.NO
                                  ? `${marketHolding.EXITING.YES.total_filled_quantity}/${marketHolding.EXITING.YES.total_quantity}`
                                  : null}
                                {!marketHolding.EXITING.YES &&
                                marketHolding.EXITING.NO
                                  ? `${marketHolding.EXITING.NO.total_filled_quantity}/${marketHolding.EXITING.NO.total_quantity}`
                                  : null}
                              </span>
                            </span>
                          </div>
                          <CancelSellOrders market={marketHolding} />
                        </div>
                      )}
                    {!statuses.includes('UNMATCHED') &&
                      !statuses.includes('EXITING') &&
                      statuses.includes('ACTIVE') && (
                        <div className="flex items-center justify-between border-t-[0.7px] pt-3">
                          {(() => {
                            const totalYesQuantity =
                              (marketHolding?.ACTIVE?.YES?.total_quantity ??
                                0) -
                              (marketHolding?.ACTIVE?.YES
                                ?.total_filled_quantity ?? 0)

                            const totalNoQuantity =
                              (marketHolding?.ACTIVE?.NO?.total_quantity ?? 0) -
                              (marketHolding?.ACTIVE?.NO
                                ?.total_filled_quantity ?? 0)

                            const noCurrentValue =
                              totalNoQuantity * marketHolding.no_price -
                              (marketHolding?.ACTIVE?.NO?.total_invested ?? 0)
                            const yesCurrentValue =
                              totalYesQuantity * marketHolding.yes_price -
                              (marketHolding?.ACTIVE?.YES?.total_invested ?? 0)

                            return (
                              <span
                                className={`${
                                  yesCurrentValue + noCurrentValue > 0
                                    ? 'bg-[linear-gradient(90deg,_#D3FFE5_0%,_rgba(228,255,239,0)_100%)]'
                                    : ''
                                } ${
                                  yesCurrentValue + noCurrentValue < 0
                                    ? 'bg-[linear-gradient(90deg,_#FFD6D3_0%,_rgba(255,231,228,0)_100%)]'
                                    : ''
                                } font-normal text-[10px] flex items-center gap-2 p-1`}
                              >
                                Invested &#8377;
                                {marketHolding.total_invested.toFixed(1)}
                                <span className="flex border border-[#2C2D32] w-0.5 -mx-1"></span>
                                <span
                                  className={`${
                                    noCurrentValue + yesCurrentValue > 0
                                      ? 'text-green-600'
                                      : ''
                                  } ${
                                    noCurrentValue + yesCurrentValue < 0
                                      ? 'text-[#DB342C]'
                                      : ''
                                  }`}
                                >
                                  Gains &#8377;
                                  {marketHolding?.ACTIVE?.NO &&
                                  marketHolding?.ACTIVE?.YES
                                    ? (
                                        yesCurrentValue + noCurrentValue
                                      ).toFixed(1)
                                    : null}
                                  {marketHolding?.ACTIVE?.NO &&
                                  !marketHolding?.ACTIVE?.YES
                                    ? noCurrentValue.toFixed(1)
                                    : null}
                                  {!marketHolding?.ACTIVE?.NO &&
                                  marketHolding?.ACTIVE?.YES
                                    ? yesCurrentValue.toFixed(1)
                                    : null}
                                </span>
                              </span>
                            )
                          })()}
                          <ExitSellOrders market={marketHolding} />
                        </div>
                      )}
                  </div>
                )
              })}
          </div>
        </>
      )}
      {currentPortfolioTab === 'closed' && (
        <>
          <div className="bg-[#F5F5F5] pb-2 relative px-4">
            {(() => {
              const total_invested = marketwiseClosedHoldingsData?.reduce(
                (acc, market) => {
                  acc = acc + market.total_invested
                  return acc
                },
                0
              )
              const returns = marketwiseClosedHoldingsData?.reduce(
                (acc, market) => {
                  acc = acc + market.total_returns
                  return acc
                },
                0
              )

              if (
                marketwiseClosedHoldingsData &&
                Object.values(marketwiseClosedHoldingsData).length === 0
              )
                return (
                  <div className="flex flex-col justify-center items-center text-black min-h-[400px]">
                    <img src={NoTrades} className="h-20 w-20" alt="" />
                    <p className="text-sm font-normal text-[#5F5F5F]">
                      No Closed Trades
                    </p>
                  </div>
                )

              if (total_invested > 0 && returns !== 0)
                return (
                  <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
                    <div className="flex gap-1 justify-between items-center">
                      <div className="flex items-center gap-1">
                        <div>
                          <img src={BriefcasePurple} className="" alt="" />
                        </div>
                        <div className="font-inter text-sm">Portfolio</div>
                      </div>
                      <div>
                        <Drawer
                          open={isInfoClosedDrawerOpen}
                          onOpenChange={setIsInfoClosedDrawerOpen}
                          className=""
                        >
                          <DrawerTrigger className="w-full h-full">
                            <div>
                              <img src={InfoIcon} alt="" />
                            </div>
                          </DrawerTrigger>
                          <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
                            <div className="flex flex-col gap-4 text-[#5F5F5F] p-4">
                              <div className="flex items-center justify-between gap-[23px]">
                                <p className="text-xs font-semibold w-[20%]">
                                  Today&apos;s Returns:
                                </p>
                                <p className="text-xs font-normal leading-[15px] w-[80%]">
                                  Total earnings on events that concluded Today
                                </p>
                              </div>
                              <div className="flex items-center justify-between gap-[23px]">
                                <p className="text-xs font-semibold w-[20%]">
                                  Returns:
                                </p>
                                <p className="text-xs font-normal leading-[15px] w-[80%]">
                                  Profit earned till date
                                </p>
                              </div>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <div className="flex flex-col gap-1 items-center">
                        <span className="font-semibold text-[18px] text-[#2C2D32]">
                          &#8377;
                          {total_invested}
                        </span>
                        <span className="font-normal text-xs">Investment</span>
                      </div>
                      <div className="flex flex-col gap-1 items-center">
                        {returns === 0 && (
                          <span className="font-semibold text-[18px] text-[#2C2D32]">
                            &#8377;{returns}
                          </span>
                        )}
                        {returns > 0 && (
                          <span className="font-semibold text-[18px] text-[#2C2D32]">
                            +&#8377;{returns}
                          </span>
                        )}
                        {returns < 0 && (
                          <span className="font-semibold text-[18px] text-[#2C2D32]">
                            -&#8377;{Math.abs(returns)}
                          </span>
                        )}
                        <span className="font-normal text-xs">Returns</span>
                      </div>
                    </div>
                    <div className="w-full">
                      <Separator></Separator>
                    </div>
                    <span className="flex gap-1 items-center">
                      <span className="text-[10px] font-normal text-[#2C2D32]">
                        Today's Returns:
                      </span>
                      <span className="text-xs text-[#2C2D32] font-normal">
                        &#8377;0.1
                      </span>
                    </span>
                  </div>
                )
            })()}
          </div>

          <div className="py-2 space-y-4 px-4">
            {marketwiseClosedHoldingsData?.map((marketHolding) => {
              return (
                <div
                  className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]"
                  onClick={() => {
                    navigate(`/portfolio/${marketHolding.market_id}`)
                  }}
                >
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-start gap-4 w-[80%]">
                      <div className="w-[15%]">
                        <img src={CricketIcon} alt="" />
                      </div>
                      <div className="w-[85%] flex font-normal text-xs">
                        {marketHolding?.question}
                      </div>
                    </div>
                    <div className="flex justify-end w-[20%]">
                      <img src={ClosedYesOpinionIcon} alt="" />
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
                      <span>
                        Invested &#8377;{marketHolding?.total_invested}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-[10px] font-normal text-[#2C2D32]">
                        Returns
                      </span>
                      {marketHolding?.total_returns === 0 && (
                        <span className="font-bold text-[10px] font-inter">
                          &#8377;{marketHolding?.total_returns}
                        </span>
                      )}
                      {marketHolding?.total_returns > 0 && (
                        <span className="font-bold text-[10px] font-inter text-[#1C895E]">
                          +&#8377;{marketHolding?.total_returns}
                        </span>
                      )}
                      {marketHolding?.total_returns < 0 && (
                        <span className="font-bold text-[10px] font-inter text-[#DB342C]">
                          -&#8377;{Math.abs(marketHolding?.total_returns)}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default FixturePortfolio
