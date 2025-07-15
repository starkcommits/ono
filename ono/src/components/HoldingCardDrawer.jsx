import React, { useState } from 'react'

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
import RightArrowIcon from '@/assets/RightArrowIcon.svg'
import CircleCrossIcon from '@/assets/CircleCrossIcon.svg'
import ExitSellOrder from './ExitSellOrder'
import ModifyCancelSellOrder from './ModifyCancelSellOrder'
import { Separator } from '@/components/ui/separator'
import CancelBuyOrder from './CancelBuyOrder'

const HoldingCardDrawer = ({ holding, marketPrices }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [buttonState, setButtonState] = useState('idle')
  console.log(holding)
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
      className="w-full"
    >
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger className="w-full">
          <div
            key={holding.name}
            className="bg-white rounded-[5px] p-4 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              {holding.opinion_type === 'YES' && (
                <p className="font-semibold text-xl text-[#492C82]">YES</p>
              )}
              {holding.opinion_type === 'NO' && (
                <p className="font-semibold text-xl text-[#E26F64]">NO</p>
              )}
              {holding.status === 'UNMATCHED' && (
                <CancelBuyOrder holding={holding} />
              )}
              {holding.status === 'EXITING' && (
                <ModifyCancelSellOrder holding={holding} />
              )}
              {holding.status === 'ACTIVE' && (
                <ExitSellOrder holding={holding} />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1 items-start">
                <p className="font-normal text-xs text-[#5F5F5F]">Investment</p>
                <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                  &#8377;
                  {holding.price * (holding.quantity - holding.filled_quantity)}
                </p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                {holding.status === 'ACTIVE' ? (
                  <>
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
                  </>
                ) : null}
                {holding.status === 'CANCELED' ||
                holding.status === 'UNMATCHED' ? (
                  <>
                    <p className="font-normal text-xs text-[#5F5F5F]">
                      Buy Price
                    </p>
                    <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                      &#8377;
                      {holding.price}
                    </p>
                  </>
                ) : null}
                {holding.status === 'EXITING' && (
                  <>
                    <p className="font-normal text-xs text-[#5F5F5F]">
                      Exit Value
                    </p>
                    <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                      &#8377;
                      {holding.exit_price * holding.quantity}
                    </p>
                  </>
                )}
                {holding.status === 'EXITED' && (
                  <>
                    <p className="font-normal text-xs text-[#5F5F5F]">
                      Returns
                    </p>
                    <p className="font-inter font-semibold text-sm text-[#2C2D32]">
                      &#8377;
                      {holding.returns > 0 ? `+${holding.returns}` : null}
                      {holding.returns < 0 ? `${holding.returns}` : null}
                      {holding.returns === 0 ? `${holding.returns}` : null}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5] px-4 space-y-4">
          <div className="flex flex-col gap-4 rounded-[10px] bg-white py-4">
            <div className="flex gap-4 items-center px-4">
              <div className="rounded-[5px] bg-[#F0EAFD] p-5">
                <p className="font-semibold text-sm tracking-[2px]">
                  {holding.opinion_type}
                </p>
              </div>
              <div className="flex flex-col gap-[9px]">
                <div className="max-w-min">
                  {holding.status === 'ACTIVE' && (
                    <p
                      className={`px-1.5 text-[8px] font-medium tracking-[2%] rounded-[2px] bg-[#E1FEF1] text-[#1C895E] uppercase`}
                    >
                      {holding.status}
                    </p>
                  )}
                  {holding.status === 'UNMATCHED' && (
                    <p
                      className={`px-1.5 text-[8px] font-medium tracking-[2%] rounded-[2px] bg-[#FEF0E8] text-[#EF7C35] uppercase`}
                    >
                      {holding.status}
                    </p>
                  )}
                  {holding.status === 'EXITING' && (
                    <p
                      className={`px-1.5 text-[8px] font-medium tracking-[2%] rounded-[2px] bg-[#FBE9FF] text-[#9118A9] uppercase`}
                    >
                      {holding.status}
                    </p>
                  )}
                  {holding.status === 'CANCELED' && (
                    <p
                      className={`px-1.5 text-[8px] font-medium tracking-[2%] rounded-[2px] bg-[#F2F2F2] text-[#5F5F5F] uppercase`}
                    >
                      {holding.status}
                    </p>
                  )}

                  {holding.status === 'EXITED' && (
                    <p
                      className={`px-1.5 text-[8px] font-medium tracking-[2%] rounded-[2px] bg-[#FFEDEA] text-[#E02400] uppercase`}
                    >
                      {holding.status}
                    </p>
                  )}
                </div>
                <p className="font-semibold text-xs tracking-[2px] uppercase">
                  Order ID - <span className="font-inter">1542284000</span>
                </p>
                <p className="font-normal font-inter text-[10px] tracking-[2px]">
                  {' '}
                  As on Apr 28, 2925 19:35
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-4">
                <p className="text-[#2C2D32] text-xs font-normal">Order Type</p>
                <p className="font-semibold text-xs">Limit</p>
              </div>
              {(holding.status === 'EXITED' ||
                holding.status === 'UNMATCHED' ||
                holding.status === 'ACTIVE' ||
                holding.status === 'CANCELED') && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">Qty</p>
                  <p className="font-semibold text-xs">{holding.quantity}</p>
                </div>
              )}
              {(holding.status === 'UNMATCHED' ||
                holding.status === 'CANCELED') && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">Price</p>
                  <p className="font-semibold text-xs">{holding.price}</p>
                </div>
              )}
              {holding.status === 'ACTIVE' && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">
                    Investment
                  </p>
                  <p className="font-semibold text-xs">
                    {holding.price * holding.quantity}
                  </p>
                </div>
              )}
              {holding.status === 'ACTIVE' && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">
                    Current Value
                  </p>
                  <p className="font-semibold text-xs">
                    {holding.opinion_type === 'YES'
                      ? marketPrices.market_yes_price *
                        (holding.quantity - holding.filled_quantity)
                      : null}
                    {holding.opinion_type === 'NO'
                      ? marketPrices.market_no_price *
                        (holding.quantity - holding.filled_quantity)
                      : null}
                  </p>
                </div>
              )}
              {holding.status === 'EXITED' && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">
                    Buy Price
                  </p>
                  <p className="font-semibold text-xs">{holding.price}</p>
                </div>
              )}
              {holding.status === 'EXITING' && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">
                    Total Matched Qty
                  </p>
                  <p className="font-semibold text-xs">
                    {holding.filled_quantity}
                  </p>
                </div>
              )}
              {holding.status === 'EXITING' && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">
                    Pending Qty
                  </p>
                  <p className="font-semibold text-xs">
                    {holding.filled_quantity} (out of {holding.quantity})
                  </p>
                </div>
              )}

              {holding.status === 'EXITED' ||
                (holding.status === 'EXITING' && (
                  <div className="flex justify-between items-center px-4">
                    <p className="text-[#2C2D32] text-xs font-normal">
                      Exit Price
                    </p>
                    <p className="font-semibold text-xs">
                      {holding.exit_price}
                    </p>
                  </div>
                ))}
              {holding.status === 'EXITED' && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">Profit</p>
                  <p className="font-semibold text-xs">
                    {holding.exit_price - holding.price}
                  </p>
                </div>
              )}

              {holding.status === 'EXITING' && (
                <div className="flex justify-between items-center px-4">
                  <p className="text-[#2C2D32] text-xs font-normal">
                    Current Price
                  </p>
                  <p className="font-semibold text-xs">
                    {holding.opinion_type === 'YES'
                      ? marketPrices.market_yes_price
                      : null}
                    {holding.opinion_type === 'NO'
                      ? marketPrices.market_no_price
                      : null}
                  </p>
                </div>
              )}
            </div>
            <div
              className="border-t-[0.7px] border-dashed  border-[#CBCBCB] flex justify-center pt-4"
              style={{ strokeDasharray: '1.4, 1.4' }}
            >
              <p className="text-[#337265] text-xs font-semibold tracking-[1px] flex items-center gap-1">
                <span>VIEW TRANSACTIONS</span>
                <span>
                  <img src={RightArrowIcon} alt="" />
                </span>
              </p>
            </div>
          </div>

          <div className="pb-4">
            <div
              onClick={() => {
                setIsDrawerOpen(false)
              }}
              className="flex items-center justify-center w-full rounded-[5px] px-16 py-[18.5px] cursor-pointer text-center border border-[#CBCBCB]"
            >
              <button className="font-medium text-sm tracking-[1px] text-[#2C2D32]">
                Close
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default HoldingCardDrawer
