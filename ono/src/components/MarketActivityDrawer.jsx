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
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import DefaultUser from '@/assets/DefaultUser.svg'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { useParams } from 'react-router-dom'

const MarketActivityDrawer = () => {
  const { id } = useParams()

  const { data: tradesData, isLoading: tradesLoading } = useFrappeGetDocList(
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
      filters: [['market_id', '=', id]],
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
    }
  )
  return (
    <Drawer>
      <DrawerTrigger>
        <button className="rounded-[5px] border border-[#CBCBCB] font-bold text-xs tracking-[1px] text-[#337265] py-3 px-10">
          SHOW MORE
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full bg-[#F5F5F5]">
        <div className="p-4 border-b border-[#CBCBCB]">
          <p className="font-semibold text-[16px] leading-[22px] text-[#2C2D32]">
            Activity
          </p>
        </div>
        <div className="overflow-y-auto scrollbar-hide">
          {tradesData?.map((_) => {
            const formatName = (name) =>
              name?.length > 10 ? name?.slice(0, 10) + '…' : name?.slice(0)
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
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default MarketActivityDrawer
