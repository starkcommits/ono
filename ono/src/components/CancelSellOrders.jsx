import React from 'react'
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
import { useState } from 'react'
import ExitSellOrdersPriceDrawer from './ExitSellOrdersPriceDrawer'
import {
  useFrappeAuth,
  useFrappeCreateDoc,
  useFrappeGetCall,
  useSWRConfig,
} from 'frappe-react-sdk'
import { toast } from 'sonner'

const CancelSellOrders = ({ market }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { createDoc } = useFrappeCreateDoc()
  const { currentUser } = useFrappeAuth()

  const [isYesChecked, setIsYesChecked] = useState(
    market?.EXITING?.YES ? true : false
  )
  const [isNoChecked, setIsNoChecked] = useState(
    market?.EXITING?.NO ? true : false
  )
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger>
        <div>
          <button className="font-semibold text-xs flex">
            Cancel <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full">
        <DrawerHeader className="p-0">
          <div className="flex justify-between items-center gap-4 p-4">
            <DrawerTitle className="font-normal font-inter text-left text-[13px] leading-[100%] w-[90%]">
              {market.question}
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
                Exiting Orders
              </span>
            </div>
            {market?.EXITING?.NO && (
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
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                      &#8377;{market?.EXITING?.NO?.total_invested.toFixed(1)}
                    </span>
                    <span className="font-normal text-xs text-[#5F5F5F]">
                      Investment
                    </span>
                  </div>
                  <div className=" flex items-start gap-3">
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-semibold text-sm font-inter text-[#2C2D32]`}
                      >
                        &#8377;
                        {(
                          market?.EXITING?.NO?.total_quantity -
                          market?.EXITING?.NO?.total_filled_quantity
                        ).toFixed(1)}
                      </span>

                      <span className="font-normal text-xs text-[#5F5F5F]">
                        Exit Value
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {market?.EXITING?.YES && (
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
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-sm font-inter text-[#2C2D32]">
                      &#8377;{market?.EXITING?.YES?.total_invested.toFixed(1)}
                    </span>
                    <span className="font-normal text-xs text-[#5F5F5F]">
                      Investment
                    </span>
                  </div>
                  <div className=" flex items-start gap-3">
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-semibold text-sm font-inter text-[#2C2D32]`}
                      >
                        &#8377;
                        {(
                          market?.EXITING?.YES?.total_quantity -
                          market?.EXITING?.YES?.total_filled_quantity
                        ).toFixed(1)}
                      </span>
                      <span className="font-normal text-xs text-[#5F5F5F]">
                        Exit Value
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <DrawerFooter>
          <div className="flex items-center justify-between w-full">
            <div className="rounded-[5px] px-20 py-2.5 bg-[#2C2D32] text-[#FFFFFF] cursor-pointer w-full text-center">
              <span className="font-[500] text-sm">Cancel exit orders</span>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CancelSellOrders
