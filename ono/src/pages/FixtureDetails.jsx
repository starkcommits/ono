import BackWhite from '@/assets/BackWhite.svg'
import ShareAndroid from '@/assets/ShareAndroid.svg'
import Settings from '@/assets/Settings.svg'
import WalletWhite from '@/assets/WalletWhite.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Crypto from '@/assets/Crypto.svg'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ActiveFixtureTab1 from '@/assets/ActiveFixtureTab1.svg'
import InactiveFixtureTab1 from '@/assets/InactiveFixtureTab1.svg'
import ActiveFixtureTab2 from '@/assets/ActiveFixtureTab2.svg'
import InactiveFixtureTab2 from '@/assets/InactiveFixtureTab2.svg'
import FixtureMarkets from '../components/FixtureMarkets'
import FixturePortfolio from '../components/FixturePortfolio'
import {
  useFrappeAuth,
  useFrappeGetCall,
  useFrappeGetDoc,
} from 'frappe-react-sdk'
import TradingViewWidgetBTC from '../components/TradingViewWidgetBTC'
import ClosedEventsInactiveIcon from '@/assets/ClosedEventsInactiveIcon.svg'
import OpenEventsActiveIcon from '@/assets/OpenEventsActiveIcon.svg'
import OpenEventsInActiveIcon from '@/assets/OpenEventsInactiveIcon.svg'
import ClosedEventsActiveIcon from '@/assets/ClosedEventsActiveIcon.svg'
import ProfitUpArrow from '@/assets/ProfitUpArrow.svg'
import LossDownArrow from '@/assets/LossDownArrow.svg'
import { MarketEventListener } from '../components/MarketEventListener'

const FixtureDetails = () => {
  const navigate = useNavigate()

  const { currentUser } = useFrappeAuth()

  const [accordionValue, setAccordionValue] = useState('')

  const { data: userWalletData } = useFrappeGetDoc(
    'User Wallet',
    currentUser,
    currentUser ? undefined : null
  )

  console.log(userWalletData)

  const [currentPortfolioTab, setCurrentPortfolioTab] = useState('open')

  const handlePortfolioTabChange = (value) => {
    setCurrentPortfolioTab(value)
  }

  const [marketwiseActiveHoldings, setMarketwiseActiveHoldings] = useState({})

  const { data: marketwiseActiveHoldingsData } = useFrappeGetCall(
    'rewardapp.engine.get_marketwise_holding',
    {},
    currentPortfolioTab === 'open' ? ['open_marketwise_holdings'] : null
  )

  useEffect(() => {
    if (marketwiseActiveHoldingsData && marketwiseActiveHoldingsData.message) {
      setMarketwiseActiveHoldings(marketwiseActiveHoldingsData.message)
    }
  }, [marketwiseActiveHoldingsData])

  useEffect(() => {
    const id = 'fixture-portfolio'

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

  const [currentFixtureTab, setCurrentFixtureTab] = useState(
    localStorage.getItem('currentFixtureTab') || 'markets'
  )

  console.log(currentFixtureTab)

  const handleTabChange = (value) => {
    localStorage.setItem('currentFixtureTab', value)
    setCurrentFixtureTab(value)
  }

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

  return (
    <div className="bg-[#F5F5F5] min-h-screen select-none">
      <div className="sticky top-0 select-none w-full max-w-md mx-auto z-[50]">
        <div className="flex flex-col gap-8 p-4 bg-[#2C2D32]">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={BackWhite}
                alt=""
                className="cursor-pointer h-4 w-4 text-white"
                onClick={() => {
                  navigate(-1)
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <img src={WalletWhite} alt="" />
                </div>
                <p className="font-inter text-[13px] font-medium text-white">
                  &#8377; {userWalletData?.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-between gap-2 bg-[#2C2D32]">
            <div className="flex items-center gap-2">
              <div>
                <img src={Crypto} alt="" />
              </div>
              <p className="text-white text-[13px] font-medium">Bitcoin</p>
            </div>
            <div className="">
              <Accordion
                value={accordionValue}
                onValueChange={setAccordionValue}
                type="single"
                collapsible
              >
                <AccordionItem
                  value="chart-view"
                  className="hover:no-underline border-b-0 p-0 pb-0"
                >
                  <AccordionTrigger className="hover:no-underline p-0 gap-2 font-normal text-xs text-white">
                    Open Chart View
                  </AccordionTrigger>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          {accordionValue === 'chart-view' ? (
            <div className="-mt-6 h-[270px] w-full data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <TradingViewWidgetBTC />
            </div>
          ) : null}
        </div>
        <Tabs
          value={currentFixtureTab}
          onValueChange={handleTabChange}
          className="w-full font-[500] text-xs"
        >
          <TabsList className="w-full space-x-2 h-full bg-white p-0">
            <TabsTrigger
              value="markets"
              className="text-sm flex gap-2 items-center font-medium py-4 w-full space-x-2 data-[state=active]:rounded-none text-[#5F5F5F] data-[state=active]:text-[#2C2D32] data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
            >
              <div>
                {currentFixtureTab === 'markets' ? (
                  <img src={ActiveFixtureTab1} alt="" />
                ) : (
                  <img src={InactiveFixtureTab1} alt="" />
                )}
              </div>
              <p className="font-medium text-sm">Markets</p>
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="text-sm flex gap-2 items-center font-medium py-4 w-full space-x-2 data-[state=active]:rounded-none text-[#5F5F5F] data-[state=active]:text-[#2C2D32] data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
            >
              <div>
                {currentFixtureTab === 'portfolio' ? (
                  <img src={ActiveFixtureTab2} alt="" />
                ) : (
                  <img src={InactiveFixtureTab2} alt="" />
                )}
              </div>
              <p className="font-medium text-sm flex items-center gap-2">
                <span>Portfolio</span>
                {total_investment > 0 && current_value > 0 ? (
                  <span className="text-[11px] font-semibold flex gap-1">
                    <span>{current_value.toFixed(1)}</span>
                    <span>
                      {current_value - total_investment > 0 ? (
                        <span className="text-[#1C895E]">
                          (+
                          {Math.abs(current_value - total_investment).toFixed(
                            1
                          )}
                          )
                        </span>
                      ) : null}
                      {current_value - total_investment < 0 ? (
                        <span className="text-[#DB342C]">
                          ({(current_value - total_investment).toFixed(1)})
                        </span>
                      ) : null}
                    </span>
                  </span>
                ) : null}
              </p>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {currentFixtureTab === 'portfolio' ? (
          <div className="z-[50] flex flex-col max-w-md mx-auto bg-white mb-auto">
            <Tabs
              className="w-full font-[500] text-xs"
              value={currentPortfolioTab}
              onValueChange={handlePortfolioTabChange}
            >
              <div className="w-full left-0 right-0 bg-[#F5F5F5] z-[50] px-4 py-4">
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
        ) : null}
      </div>
      {currentFixtureTab === 'markets' && <FixtureMarkets />}
      {currentFixtureTab === 'portfolio' && (
        <FixturePortfolio
          currentPortfolioTab={currentPortfolioTab}
          marketwiseActiveHoldings={marketwiseActiveHoldings}
        />
      )}
    </div>
  )
}

export default FixtureDetails
