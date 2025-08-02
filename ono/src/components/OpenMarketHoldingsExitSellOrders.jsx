import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import CricketIcon from '@/assets/Cricket.svg'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import ExitSellOrdersPriceDrawer from './ExitSellOrdersPriceDrawer'
import {
  useFrappeAuth,
  useFrappeCreateDoc,
  useFrappeGetCall,
  useSWRConfig,
} from 'frappe-react-sdk'
import { toast } from 'sonner'

const OpenMarketHoldingsExitSellOrders = ({
  market,
  openMarketHoldingsPortfolioTab,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { createDoc } = useFrappeCreateDoc()
  const { currentUser } = useFrappeAuth()

  const [isYesChecked, setIsYesChecked] = useState(
    market?.ACTIVE?.YES ? true : false
  )
  const [isNoChecked, setIsNoChecked] = useState(
    market?.ACTIVE?.NO ? true : false
  )
  const [yesExitPrice, setYesExitPrice] = useState(market?.yes_price)
  const [noExitPrice, setNoExitPrice] = useState(market?.no_price)

  useEffect(() => {
    setYesExitPrice(market?.yes_price)
    setNoExitPrice(market?.no_price)
  }, [market])

  const { mutate } = useSWRConfig()

  const handleCreateSellOrders = async () => {
    try {
      if (!isYesChecked && !isNoChecked) {
        toast.error('Please check YES or NO to continue with selling.')
        return
      }
      const yesSellOrder = {
        market_id: market?.market_id,
        user_id: currentUser,
        order_type: 'SELL',
        quantity:
          market?.ACTIVE?.YES?.total_quantity -
          market?.ACTIVE?.YES?.total_filled_quantity,
        filled_quantity: 0,
        opinion_type: 'YES',
        amount: yesExitPrice,
      }
      const noSellOrder = {
        market_id: market?.market_id,
        user_id: currentUser,
        order_type: 'SELL',
        quantity:
          market?.ACTIVE?.NO?.total_quantity -
          market?.ACTIVE?.NO?.total_filled_quantity,
        filled_quantity: 0,
        opinion_type: 'NO',
        amount: noExitPrice,
      }

      if (isYesChecked) {
        await createDoc('Orders', yesSellOrder)
      }
      if (isNoChecked) {
        await createDoc('Orders', noSellOrder)
      }
      mutate(
        (key) => Array.isArray(key) && key[0] === 'open_market_holdings_overall'
      )

      mutate(
        (key) =>
          Array.isArray(key) &&
          key[0] === `${openMarketHoldingsPortfolioTab}_open_market_holdings`
      )

      toast.success(`Sell orders created successfully.`)
      setIsDrawerOpen(false)
    } catch (error) {
      toast.error(`Error creating sell orders.`)
    }
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className="w-[50%]"
    >
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger className="w-full font-semibold text-xs">
          {market?.ACTIVE ? (
            <button className="w-full text-center rounded-[20px] border py-2.5 px-4 bg-[#2C2D32] text-white hover:bg-[#2C2D32]/90 transition-all duration-300 cursor-pointer">
              EXIT
            </button>
          ) : (
            <button
              disabled
              className="disabled:cursor-not-allowed w-full text-center rounded-[20px] border py-2.5 px-4 bg-[#2C2D32]/30 text-white  transition-all duration-300 cursor-pointer"
            >
              EXIT
            </button>
          )}
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto w-full max-h-full">
          <DrawerHeader className="p-0">
            <div className="flex justify-between items-center gap-4 p-4">
              <DrawerTitle className="font-normal font-inter text-left text-[13px] leading-[18px] w-[90%]">
                {market?.question}
              </DrawerTitle>
              <DrawerDescription className="w-[10%]">
                <img src={CricketIcon} alt="" />
              </DrawerDescription>
            </div>
          </DrawerHeader>
          <div className="p-4">
            <Separator />
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mt-4">
                <span className="font-semibold text-xs text-[#2C2D32]">
                  Select exit orders
                </span>
                <span className="font-semibold text-[10px] text-[#007AFF]">
                  View Portfolio
                </span>
              </div>
              {market?.ACTIVE?.NO && (
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <Checkbox
                      id="no"
                      checked={isNoChecked}
                      onCheckedChange={(checked) => setIsNoChecked(checked)}
                    />
                    <Label
                      htmlFor="no"
                      className="font-semibold text-sm text-[#2C2D32]"
                    >
                      NO
                    </Label>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col gap-2 items-center">
                      <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                        &#8377;{market?.ACTIVE?.NO?.total_invested}
                      </span>
                      <span className="font-normal text-xs text-[#5F5F5F]">
                        Investment
                      </span>
                    </div>
                    <div className=" flex items-start gap-3">
                      <div className="flex flex-col gap-2 items-center">
                        {(() => {
                          const exitValue =
                            noExitPrice *
                            (market?.ACTIVE?.NO?.total_quantity -
                              market?.ACTIVE?.NO?.total_filled_quantity)
                          const exitReturns =
                            noExitPrice *
                              (market?.ACTIVE?.NO?.total_quantity -
                                market?.ACTIVE?.NO?.total_filled_quantity) -
                            market?.ACTIVE?.NO?.total_invested

                          return (
                            <span
                              className={`${
                                exitReturns > 0 && 'text-green-600'
                              } ${
                                exitReturns < 0 && 'text-[#DB342C]'
                              } font-semibold text-sm font-inter text-[#2C2D32]`}
                            >
                              &#8377;
                              {exitValue.toFixed(1)}
                            </span>
                          )
                        })()}

                        <span className="font-normal text-xs text-[#5F5F5F]">
                          Exit Value
                        </span>
                      </div>
                      <ExitSellOrdersPriceDrawer
                        opinion_type="no"
                        price={noExitPrice}
                        setPrice={setNoExitPrice}
                        market={market}
                      />
                    </div>
                  </div>
                </div>
              )}
              {market?.ACTIVE?.YES && (
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <Checkbox
                      id="yes"
                      checked={isYesChecked}
                      onCheckedChange={(checked) => setIsYesChecked(checked)}
                    />
                    <Label
                      htmlFor="yes"
                      className="font-semibold text-sm text-[#2C2D32]"
                    >
                      YES
                    </Label>
                  </div>
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col gap-2 items-center">
                      <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                        &#8377;{market?.ACTIVE?.YES?.total_invested}
                      </span>
                      <span className="font-normal text-xs text-[#5F5F5F]">
                        Investment
                      </span>
                    </div>
                    <div className=" flex items-start gap-3">
                      <div className="flex flex-col gap-2 items-center">
                        {(() => {
                          const exitValue =
                            yesExitPrice *
                            (market?.ACTIVE?.YES?.total_quantity -
                              market?.ACTIVE?.YES?.total_filled_quantity)
                          const exitReturns =
                            yesExitPrice *
                              (market?.ACTIVE?.YES?.total_quantity -
                                market?.ACTIVE?.YES?.total_filled_quantity) -
                            market?.ACTIVE?.YES?.total_invested

                          return (
                            <span
                              className={`${
                                exitReturns > 0 && 'text-green-600'
                              } ${
                                exitReturns < 0 && 'text-[#DB342C]'
                              } font-semibold text-sm font-inter text-[#2C2D32]`}
                            >
                              &#8377;
                              {exitValue.toFixed(1)}
                            </span>
                          )
                        })()}
                        <span className="font-normal text-xs text-[#5F5F5F]">
                          Exit Value
                        </span>
                      </div>
                      <ExitSellOrdersPriceDrawer
                        opinion_type="yes"
                        price={yesExitPrice}
                        setPrice={setYesExitPrice}
                        market={market}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DrawerFooter className="bg-[#F4F3EF]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-1 font-inter font-semibold text-sm">
                  {isYesChecked &&
                    isNoChecked &&
                    (() => {
                      const exitValue =
                        yesExitPrice *
                          (market?.ACTIVE?.YES?.total_quantity -
                            market?.ACTIVE?.YES?.total_filled_quantity) +
                        noExitPrice *
                          (market?.ACTIVE?.NO?.total_quantity -
                            market?.ACTIVE?.NO?.total_filled_quantity)
                      const exitReturns =
                        yesExitPrice *
                          (market?.ACTIVE?.YES?.total_quantity -
                            market?.ACTIVE?.YES?.total_filled_quantity) +
                        noExitPrice *
                          (market?.ACTIVE?.NO?.total_quantity -
                            market?.ACTIVE?.NO?.total_filled_quantity) -
                        market.total_invested

                      return (
                        <>
                          <span>&#8377;{exitValue.toFixed(1)}</span>
                          {exitReturns !== 0 && (
                            <span
                              className={`${
                                exitReturns > 0 && 'text-[#1C895E]'
                              } ${exitReturns < 0 && 'text-[#DB342C]'}`}
                            >
                              ({exitReturns > 0 && '+'}&#8377;
                              {exitReturns.toFixed(1)})
                            </span>
                          )}
                        </>
                      )
                    })()}
                  {isYesChecked &&
                    !isNoChecked &&
                    (() => {
                      const exitValue =
                        yesExitPrice *
                        (market?.ACTIVE?.YES?.total_quantity -
                          market?.ACTIVE?.YES?.total_filled_quantity)
                      const exitReturns =
                        yesExitPrice *
                          (market?.ACTIVE?.YES?.total_quantity -
                            market?.ACTIVE?.YES?.total_filled_quantity) -
                        market?.ACTIVE?.YES?.total_invested
                      return (
                        <>
                          <span>&#8377;{exitValue.toFixed(1)}</span>
                          {exitReturns !== 0 && (
                            <span
                              className={`${
                                exitReturns > 0 && 'text-[#1C895E]'
                              } ${exitReturns < 0 && 'text-[#DB342C]'}`}
                            >
                              ({exitReturns > 0 && '+'}&#8377;
                              {exitReturns.toFixed(1)})
                            </span>
                          )}
                        </>
                      )
                    })()}
                  {!isYesChecked &&
                    isNoChecked &&
                    (() => {
                      const exitValue =
                        noExitPrice *
                        (market?.ACTIVE?.NO?.total_quantity -
                          market?.ACTIVE?.NO?.total_filled_quantity)
                      const exitReturns =
                        noExitPrice *
                          (market?.ACTIVE?.NO?.total_quantity -
                            market?.ACTIVE?.NO?.total_filled_quantity) -
                        market?.ACTIVE?.NO?.total_invested
                      return (
                        <>
                          <span>&#8377;{exitValue.toFixed(1)}</span>
                          {exitReturns !== 0 && (
                            <span
                              className={`${
                                exitReturns > 0 && 'text-[#1C895E]'
                              } ${exitReturns < 0 && 'text-[#DB342C]'}`}
                            >
                              ({exitReturns > 0 && '+'}&#8377;
                              {exitReturns.toFixed(1)})
                            </span>
                          )}
                        </>
                      )
                    })()}
                </span>
                <span className="text-xs font-normal text-[#5F5F5F]">
                  Exit Value
                </span>
              </div>
              <div
                className="rounded-[5px] px-20 py-3.5 bg-[#2C2D32] text-[#FFFFFF] cursor-pointer"
                onClick={() => {
                  handleCreateSellOrders()
                }}
              >
                <span className="font-[500] text-sm">EXIT</span>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default OpenMarketHoldingsExitSellOrders
