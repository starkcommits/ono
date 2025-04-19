import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetCall,
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappePostCall,
  useFrappeUpdateDoc,
} from 'frappe-react-sdk'
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
import { Slider } from '@/components/ui/slider'
import {
  ArrowRight,
  Clock,
  LucideMousePointerSquareDashed,
  Plus,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useFrappeDeleteDoc } from 'frappe-react-sdk'

const ActivePositions = ({
  position,
  setActiveHoldings,
  handleTradeClick,
  refetchActiveHoldings,
}) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  console.log(position)

  const [yesPrice, setYesPrice] = useState(position.market_yes_price)
  const [noPrice, setNoPrice] = useState(position.market_no_price)
  const { updateDoc } = useFrappeUpdateDoc()
  const { currentUser } = useFrappeAuth()

  //   useFrappeEventListener('market_event', (updatedMarket) => {
  //     console.log('Hello')
  //     if (updatedMarket.name === position.market_id) {
  //       console.log('Current: ', position.market_id)
  //       console.log('Updated:', updatedMarket.name)
  //     }
  //     if (updatedMarket.name === position.market_id) {
  //       setActiveOrders((prev) => {
  //         const updatedActiveOrders = {
  //           ...prev,
  //           [position.name]: {
  //             name: position.name,
  //             question: position.question,
  //             creation: position.creation,
  //             amount: position.amount,
  //             status: position.status,
  //             quantity: position.quantity,
  //             opinion_type: position.opinion_type,
  //             market_id: position.market_id,
  //             yes_price:
  //               position.opinion_type === 'YES'
  //                 ? updatedMarket.yes_price
  //                 : position.yes_price,
  //             no_price:
  //               position.opinion_type === 'NO'
  //                 ? updatedMarket.no_price
  //                 : position.no_price,
  //             sell_order_id: position.sell_order_id,
  //           },
  //         }
  //         return updatedActiveOrders
  //       })
  //     }
  //   })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleCancelOrder = async () => {
    try {
      console.log(position)
      if (position.order_type === 'SELL') {
        console.log('Entered')
        await updateDoc('Orders', position.buy_order_id, {
          sell_order_id: null,
        })
        await updateDoc('Orders', position.name, {
          status: 'SETTLED',
          remark: 'Sell order canceled in midway',
        })
      } else {
        await updateDoc('Orders', position.name, {
          status: 'CANCELED',
        })
      }
      // Remove this stray 'call' line
      // call  <-- This is causing the error
      refetchActiveOrders()
      setIsOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  const handleMarketClick = (position) => {
    navigate(`/event/${position.market_id}`)
  }

  console.log('Entered:', position)

  return (
    <>
      <div key={position.market_id} className="p-4 w-full cursor-pointer">
        <Badge
          className="text-xs font-semibold mb-2 hover:underline"
          onClick={() => {
            navigate(`/portfolio/${position.market_id}`)
          }}
        >
          #{position.market_id}
        </Badge>

        {/* <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 items-center w-full">
            <div
              className="font-medium text-gray-900"
              // onClick={() => {
              //   navigate(`/event/${position.market_id}`)
              // }}
            >
              {position.market_id}
            </div>
            <div>
              {position.status === 'ACTIVE' &&
                position.filled_quantity === 0 && (
                  <span className="bg-yellow-100 text-yellow-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
                    {position.status}
                  </span>
                )}

              {position.filled_quantity >= 0 &&
                position.filled_quantity < position.quantity &&
                position.status === 'EXITING' && (
                  <span className="bg-emerald-100 text-emerald-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
                    {position.status}
                  </span>
                )}
            </div>
          </div>
        </div> */}
        {/* <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            End at {formatDate(position.closing_time)}
          </span>
        </div> */}
        <div className="flex justify-between gap-4 text-sm mb-4">
          <div>
            <div className="text-gray-600 font-medium">Invested</div>
            <div className="font-semibold text-gray-900">
              ₹{position.invested_amount}
            </div>
          </div>
          <div>
            <div className="text-gray-600 font-medium">Total Quantity</div>
            <div className="font-semibold text-gray-900">
              {position.total_quantity}
            </div>
          </div>
          <div>
            <div className="text-gray-600 font-medium">Avg. Price</div>
            <div className="font-semibold text-gray-900">
              &#8377;
              {(position.invested_amount / position.total_quantity).toFixed(2)}
            </div>
          </div>
          {/* <div>
            <div className="text-gray-600 font-medium">Current</div>
            <div className="font-semibold text-gray-900">
              ₹
              {position.opinion_type === 'YES'
                ? parseFloat(position.market_yes_price).toFixed(1)
                : parseFloat(position.market_no_price).toFixed(1)}
            </div>
          </div> */}
        </div>
        <div className="w-full flex items-center justify-end cursor-default">
          <Drawer className="w-full">
            <DrawerTrigger>
              <button className="rounded-lg p-1.5 border flex items-center justify-center gap-2">
                <span>Exit Position</span>
                <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="mx-auto w-full">
              <DrawerHeader className="flex items-center justify-center">
                <DrawerTitle className="w-full flex justify-center">
                  Exit All Positions
                </DrawerTitle>
              </DrawerHeader>
              <div className="w-full flex flex-col gap-4">
                <div className="mb-6 px-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-medium">Yes Price</span>
                    <div className="flex items-center">
                      <span className="text-lg font-medium">₹{yesPrice}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Slider
                      defaultValue={[1]}
                      max={9.5}
                      min={0.5}
                      step={0.5}
                      value={[yesPrice]}
                      className={``}
                      onValueChange={(values) => {
                        setYesPrice(values[0])
                      }}
                    />
                  </div>
                </div>
                <div className="mb-6 px-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-medium">No Price</span>
                    <div className="flex items-center">
                      <span className="text-lg font-medium">₹{noPrice}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Slider
                      defaultValue={[1]}
                      max={9.5}
                      min={0.5}
                      step={0.5}
                      value={[noPrice]}
                      className={``}
                      onValueChange={(values) => {
                        setYesPrice(values[0])
                      }}
                    />
                  </div>
                </div>
              </div>
              <DrawerFooter className="w-full px-10">
                <Button>Submit</Button>

                <DrawerClose className=" w-full">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  )
}

export default ActivePositions
