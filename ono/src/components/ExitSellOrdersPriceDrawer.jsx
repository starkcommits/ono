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
import { ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import Pencil from '@/assets/Pencil.svg'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useSWRConfig } from 'frappe-react-sdk'

const ExitSellOrdersPriceDrawer = ({
  opinion_type,
  price,
  setPrice,
  market,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(price)

  const inputRef = useRef(null)
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const startEditing = () => {
    setTempValue(tempValue.toString())
    setIsEditing(true)
  }

  const saveValue = () => {
    const numValue = parseFloat(tempValue)
    if (!isNaN(numValue) && numValue > 0) {
      setTempValue(numValue)
    }
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setTempValue('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveValue()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  const handleInputChange = (e) => {
    // Only allow numbers
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setTempValue(value)
    }
  }
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger>
        <div className="mt-1">
          <img className="cursor-pointer" src={Pencil} alt="" />
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto w-full max-h-full">
        <div className="p-4 flex flex-col gap-5">
          <div className="flex items-start justify-between">
            <span className="font-semibold text-sm ">Set Exit Price</span>
            <div className="flex gap-1">
              <div className="flex flex-col items-center gap-2">
                {isEditing ? (
                  <div className="w-6 h-5 flex items-start">
                    <input
                      ref={inputRef}
                      type="text"
                      value={tempValue}
                      onChange={handleInputChange}
                      onBlur={saveValue}
                      onKeyDown={handleKeyDown}
                      className="appearance-none bg-transparent border-none focus:outline-none focus:ring-0 w-full font-semibold bg-white text-center max-h-full text-sm font-inter"
                      inputMode="decimal"
                    />
                  </div>
                ) : (
                  <span
                    onClick={startEditing}
                    className="font-semibold text-sm font-inter"
                  >
                    {tempValue}
                  </span>
                )}
                <span className="font-normal text-xs">
                  2365922.0 qty available
                </span>
              </div>
              <span className="mt-1">
                <img
                  src={Pencil}
                  onClick={() => {
                    startEditing()
                  }}
                  alt=""
                />
              </span>
            </div>
          </div>
          <div>
            <Slider
              max={9.5}
              min={0.5}
              step={0.5}
              value={[tempValue]}
              className={`cursor-pointer`}
              onValueChange={(values) => {
                setTempValue(values[0])
              }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-center gap-28">
            <div className="flex flex-col items-center gap-2">
              <span className="font-inter font-semibold text-xl">
                &#8377;
                {opinion_type === 'yes' && market?.ACTIVE?.YES?.total_invested}
                {opinion_type === 'no' && market?.ACTIVE?.NO?.total_invested}
              </span>
              <span className="font-normal text-xs text-[#5F5F5F]">
                Investment
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              {(() => {
                const yesExitReturns =
                  opinion_type === 'yes'
                    ? tempValue *
                        (market?.ACTIVE?.YES?.total_quantity -
                          market?.ACTIVE?.YES?.total_filled_quantity) -
                      market?.ACTIVE?.YES?.total_invested
                    : tempValue *
                        (market?.ACTIVE?.NO?.total_quantity -
                          market?.ACTIVE?.NO?.total_filled_quantity) -
                      market?.ACTIVE?.NO?.total_invested

                return (
                  <span
                    className={`font-inter font-semibold text-xl ${
                      yesExitReturns < 0 && 'text-[#DB342C]'
                    } ${yesExitReturns > 0 && 'text-green-500'}`}
                  >
                    &#8377;
                    {opinion_type === 'yes' &&
                      tempValue *
                        (market?.ACTIVE?.YES?.total_quantity -
                          market?.ACTIVE?.YES?.total_filled_quantity)}
                    {opinion_type === 'no' &&
                      tempValue *
                        (market?.ACTIVE?.NO?.total_quantity -
                          market?.ACTIVE?.NO?.total_filled_quantity)}
                  </span>
                )
              })()}

              <span className="font-normal text-xs text-[#5F5F5F]">
                Exit Value
              </span>
            </div>
          </div>
        </div>

        <DrawerFooter className="bg-[#F4F3EF] pb-6">
          <div className="py-4">
            <div
              className="bg-[#2C2D32] text-white text-center rounded-[5px] py-4"
              onClick={() => {
                setPrice(tempValue)
                setIsDrawerOpen(false)
              }}
            >
              Done
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ExitSellOrdersPriceDrawer
