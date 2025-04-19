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
  const [market, setMarket] = useState({})
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
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

  console.log('Enetered:', position)

  return (
    <>
      <div key={position.name} className="p-4 w-full cursor-pointer">
        <Badge className="text-xs font-semibold mb-2 hover:underline">
          #{position.name}
        </Badge>

        <div className="flex items-center justify-between mb-2">
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
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          {/* <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              position.opinion_type === 'YES'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {position.opinion_type}
          </span>
          <span>•</span> */}
          <span className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            End at {formatDate(position.closing_time)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-sm mb-4">
          <div>
            <div className="text-gray-600 font-medium">Invested</div>
            <div className="font-semibold text-gray-900">
              ₹{position.quantity * position.price}
            </div>
          </div>
          <div>
            <div className="text-gray-600 font-medium">Returns</div>
            <div className="font-semibold text-gray-900">
              {(position.opinion_type === 'YES'
                ? position.market_yes_price
                : position.market_no_price) - position.price}
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
        {position.status === 'ACTIVE' && (
          <div className="flex gap-2 w-full items-center justify-between">
            <div className="w-full flex gap-2 items-center ">
              <Button
                onClick={() =>
                  handleTradeClick(
                    position.opinion_type === 'YES'
                      ? position.market_yes_price
                      : position.market_no_price,
                    position.opinion_type,
                    'SELL',
                    position.market_id,
                    position.quantity,
                    position.name
                  )
                }
                className="w-[50%] bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Exit Position
              </Button>

              <Button
                onClick={() => {
                  handleMarketClick(position)
                }}
                className="w-[50%] bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Invest More
              </Button>
            </div>
          </div>
        )}
        {position.status === 'EXITING' && (
          <div className="flex gap-2 w-full items-center justify-between">
            <div className="w-[50%] flex justify-center font-medium tracking-wide">{`Qty ${position.filled_quantity}/${position.quantity} Matched`}</div>
            <Button
              onClick={() => {
                handleMarketClick(position)
              }}
              className="w-[50%] bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Invest More
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default ActivePositions
