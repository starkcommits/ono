import React, { useEffect, useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useParams } from 'react-router-dom'
import RulesImg from '@/assets/Rules.svg'
import ArrowRight from '@/assets/ArrowRight.svg'
import CricketBall from '@/assets/CricketBall.svg'
import { useFrappeGetDoc } from 'frappe-react-sdk'
import ONOSmall from '@/assets/ONOSmall.svg'

const Rules = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { id } = useParams()
  const [currentRulesTab, setCurrentRulesTab] = useState('rules')
  const [market, setMarket] = useState({})
  const { data: marketData, isLoading: marketDataLoading } = useFrappeGetDoc(
    'Market',
    id,
    id ? undefined : null
  )
  useEffect(() => {
    if (!marketDataLoading && Object.values(marketData)) {
      setMarket(marketData)
    }
  }, [marketData])

  const handleTabChange = (value) => {
    setCurrentRulesTab(value)
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} className="">
      <DrawerTrigger className="w-full flex items-center justify-between border-[#03B591] bg-gradient-to-r from-[#E8FFFA] to-[#FFFFFF] py-[10px] px-[13px] rounded-[5px]">
        <div className="flex items-center gap-[13px]">
          <img src={RulesImg} alt="" />
          <div className="flex flex-col gap-1 items-start">
            <p className="font-semibold text-sm text-[#2C2D32]">Rules</p>
            <p className="font-normal text-xs text-[#5F5F5F]">
              Terms and conditions
            </p>
          </div>
        </div>
        <div>
          <img src={ArrowRight} alt="" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
        <DrawerHeader className="p-0 pb-2">
          <div className="flex flex-col gap-4">
            <div className="flex px-4">
              <div className="border-[#CBCBCB] border rounded-[5px] p-2.5 bg-white">
                <p className="text-xs font-semibold leading-normal text-[#2C2D32]">
                  ODWVCDK
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-[11px] px-4">
              <div className="text-left text-[20px] font-semibold w-[80%] text-[#337265]">
                {market.question}
              </div>
              <div className="w-[20%]">
                <img src={CricketBall} alt="" />
              </div>
            </div>
            <div className="flex flex-col gap-2 px-4">
              <div className="flex gap-[4px] items-center">
                <div>
                  <img src={ONOSmall} alt="" />
                </div>
                <div className="text-[10px] font-normal leading-[15px] text-[#5F5F5F]">
                  Outer Delhi Warriors vs Central Delhi Kings Match 20 on 12 Aug
                  2025 at 14:00
                </div>
              </div>
              <div className="flex gap-[4px] items-center">
                <div>
                  <img src={ONOSmall} alt="" />
                </div>
                <div className="text-[10px] font-normal leading-[15px] text-[#5F5F5F]">
                  Match on: Tuesday, 12 August, 02:00 PM
                </div>
              </div>
            </div>
          </div>
        </DrawerHeader>
        <div className="p-4">
          <Tabs
            value={currentRulesTab}
            onValueChange={handleTabChange}
            className="w-full font-[500] text-xs"
          >
            <TabsList className="w-full space-x-2 h-full p-0">
              <TabsTrigger
                value="rules"
                className="text-sm flex gap-2 items-center font-medium py-4 w-full space-x-2 data-[state=active]:rounded-none text-[#5F5F5F] data-[state=active]:text-[#2C2D32] data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
              >
                Rules
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="overflow-y-auto h-full scrollbar-hide px-4 py-4 space-y-4">
          <div className="py-[20px] px-[13px] bg-white space-y-[8px] text-sm rounded-[5px]">
            <p className=" font-semibold leading-normal text-[#2C2D32]">
              Source of Truth
            </p>
            <p className="font-normal text-[#492C82]">www.xyzsource.com</p>
          </div>
          <div className="py-[20px] px-[13px] bg-white space-y-[8px] text-sm rounded-[5px]">
            <p className=" font-semibold leading-normal text-[#2C2D32]">
              Overview
            </p>
            <div className="flex flex-col text-[#303030] text-xs font-normal leading-[16px] gap-4">
              <div>
                <p>REFERENCE FOR SETTLEMENT (Source of Truth):</p>
                <ol className="list-decimal px-4">
                  <li>
                    The scorecard on the mentioned Source of truth will be
                    considered for settlement. The score on the live streaming
                    will not be taken into consideration
                  </li>
                  <li>
                    The scorecard displayed on the Platform along with the one
                    liner is only indicative and used for reference purposes
                    only and shall not be relied upon as a source of truth at
                    the time of settlement of the Event.
                  </li>
                  <li>
                    Any decision by the match officials will be final and
                    binding, For example- a 5-ball over will be considered as a
                    complete over if given by the umpire.
                  </li>
                </ol>
              </div>
              <div>
                <p>EXPIRY:</p>
                <p>The event will expire at the end of the match.</p>
                <div className="mt-2">
                  <p>
                    In case of rain/bad light/bad weather/any other
                    interruption:
                  </p>
                  <ol className="list-decimal px-4">
                    <li>
                      The event will be expired/made inactive/paused for trading
                      for the delayed time & will be activated when the play
                      resumes
                    </li>
                    <li>
                      If the required number of overs (As per the tournament
                      rules, if not mentioned then the required number of overs
                      as per the MCC Rulebook) have been bowled in the 2nd
                      innings for a result to come in the match, the event will
                      remain active.
                    </li>
                    <li>
                      If the match is washed out/cancelled/postponed, all trades
                      will be rendered null and your investment will be
                      returned.
                    </li>
                  </ol>
                </div>
              </div>
              <div>
                <p>SETTLEMENT:</p>

                <div className="mt-2">
                  <p>The event will settle at YES if the specified team:</p>
                  <ol className="list-decimal px-4">
                    <li>Wins the match</li>
                    <li>Wins the match after Super Over/Super Overs</li>
                    <li>Wins the match by DLS method</li>
                    <li>Wins the match by VJD method</li>
                    <li>Wins the match by forfeit</li>
                    <li>Is awarded with the match</li>
                    <li>
                      Wins by any other method as per the tournament rules
                    </li>
                  </ol>
                </div>
                <div className="mt-2">
                  <p>Else the event will settle at NO if the specified team:</p>
                  <ol className="list-decimal px-4">
                    <li>The specified team loses the match</li>
                    <li>The specified team loses the match by DLS method</li>
                    <li>The specified team loses the match by VJD method </li>
                    <li>The specified team loses the match by VJD method </li>
                    <li>The match ends in a draw</li>
                    <li>The match ends in a tie (even by DLS or VJD method)</li>
                    <li>The specified team forfeits the match</li>
                    <li>
                      The specified team awards the match to the other team
                    </li>
                    <li>
                      The specified team Loses by any other method as per the
                      tournament rules
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default Rules
