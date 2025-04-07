import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetCall,
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappePostCall,
  useFrappeUpdateDoc,
} from 'frappe-react-sdk'
import { Clock, Plus, TrendingDown, TrendingUp, XCircle } from 'lucide-react'
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
import { useEffect, useState } from 'react'
import { useFrappeDeleteDoc } from 'frappe-react-sdk'

const ActivePosition = ({
  position,
  setActiveOrders,
  handleTradeClick,
  refetchActiveOrders,
}) => {
  const [market, setMarket] = useState({})
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { updateDoc } = useFrappeUpdateDoc()
  const { currentUser } = useFrappeAuth()

  // console.log('Sell Order ID:', position.status === 'MATCHED' && position)

  // const { data: sellPosition, isLoading: sellPositionLoading } =
  //   position.sell_order_id
  //     ? useFrappeGetDocList('Orders', {
  //         fields: [
  //           'name',
  //           'question',
  //           'creation',
  //           'amount',
  //           'status',
  //           'quantity',
  //           'opinion_type',
  //           'market_id',
  //           'sell_order_id',
  //         ],
  //         filters: [
  //           ['order_type', '=', 'SELL'],
  //           ['name', '=', position.sell_order_id],
  //           ['owner', '=', currentUser],
  //         ],
  //       })
  //     : []

  console.log('Position: ', position)

  // useEffect(() => {
  //   if (position.sell_order_id && sellPosition?.length > 0) {
  //     position = sellPosition[0]
  //   }
  // }, [sellPosition])

  // const { data: marketData, isLoading: marketDataLoading } =
  //   useFrappeGetDocList('Market', {
  //     /** SWR Configuration Options - Optional **/
  //     fields: ['name', 'yes_price', 'no_price', 'closing_time'], // Specify the fields you want
  //     filters: [['name', '=', position.market_id]],
  //   })

  // useEffect(() => {
  //   if (marketData?.length > 0) setMarket(marketData[0])
  // }, [marketDataLoading])

  useFrappeEventListener('market_event', (updatedMarket) => {
    console.log('Hello')
    if (updatedMarket.name === position.market_id) {
      console.log('Current: ', position.market_id)
      console.log('Updated:', updatedMarket.name)
    }
    if (updatedMarket.name === position.market_id) {
      setActiveOrders((prev) => {
        const updatedActiveOrders = {
          ...prev,
          [position.name]: {
            name: position.name,
            question: position.question,
            creation: position.creation,
            amount: position.amount,
            status: position.status,
            quantity: position.quantity,
            opinion_type: position.opinion_type,
            market_id: position.market_id,
            yes_price:
              position.opinion_type === 'YES'
                ? updatedMarket.yes_price
                : position.yes_price,
            no_price:
              position.opinion_type === 'NO'
                ? updatedMarket.no_price
                : position.no_price,
            sell_order_id: position.sell_order_id,
          },
        }
        return updatedActiveOrders
      })
    }
  })

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

  return (
    <div key={position.name} className="p-4 w-full cursor-pointer">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <h3
            className="font-medium text-gray-900"
            onClick={() => {
              navigate(`/event/${position.market_id}`)
            }}
          >
            {position.question}
          </h3>
          {position.status === 'UNMATCHED' &&
            position.order_type === 'SELL' && (
              <span className="bg-yellow-100 text-yellow-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
                EXITING
              </span>
            )}
          {position.status === 'PARTIAL' && position.order_type === 'SELL' && (
            <span className="bg-yellow-100 text-yellow-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              EXITING
            </span>
          )}
          {position.status === 'UNMATCHED' && position.order_type === 'BUY' && (
            <span className="bg-yellow-100 text-yellow-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {position.status}
            </span>
          )}
          {position.status === 'PARTIAL' && position.order_type === 'BUY' && (
            <span className="bg-yellow-100 text-yellow-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {position.status}
            </span>
          )}
          {position.status === 'MATCHED' && position.order_type === 'SELL' && (
            <span className="bg-emerald-100 text-emerald-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              EXITED
            </span>
          )}
          {position.status === 'MATCHED' && position.order_type === 'BUY' && (
            <span className="bg-emerald-100 text-emerald-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {position.status}
            </span>
          )}

          {position.status === 'CANCELED' && (
            <span className="bg-red-100 text-red-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {position.status}
            </span>
          )}
        </div>
        <div
          className={`flex items-center ${
            position.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {position.profit >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span className="font-medium">
            {position.profitPercentage >= 0 ? '+' : ''}
            {position.profitPercentage}%
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            position.opinion_type === 'YES'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {position.opinion_type}
        </span>
        <span>•</span>
        <span className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" />
          End at {formatDate(position.closing_time)}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-600 font-medium">Amount</div>
          <div className="font-semibold text-gray-900">
            ₹{position.quantity * position.amount}
          </div>
        </div>
        <div>
          <div className="text-gray-600 font-medium">Qty @ Price</div>
          <div className="font-semibold text-gray-900">
            {position.quantity} @ ₹{position.amount}
          </div>
        </div>
        <div>
          <div className="text-gray-600 font-medium">Current</div>
          <div className="font-semibold text-gray-900">
            ₹
            {position.opinion_type === 'YES'
              ? String(position.yes_price)
              : String(position.no_price)}
          </div>
        </div>
      </div>
      {position.status !== 'CANCELED' && position.order_type === 'BUY' && (
        <div className="flex gap-2 w-full items-center justify-between">
          <div className="w-[50%]">
            {(position.status === 'PARTIAL' ||
              position.status === 'UNMATCHED') && (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger className="w-full">
                  <Button className="w-full bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors">
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      className="bg-white hover:bg-white/90"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-neutral-900 text-white hover:text-neutral-800 hover:bg-neutral-800/40"
                      onClick={() => handleCancelOrder(position)}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {position.status === 'MATCHED' && (
              <Button
                onClick={() =>
                  handleTradeClick(
                    position.opinion_type === 'YES'
                      ? position.yes_price
                      : position.no_price,
                    position.opinion_type,
                    'SELL',
                    position.market_id,
                    position.quantity,
                    position.name
                  )
                }
                className="w-full bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Exit Position
              </Button>
            )}
          </div>

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
      {position.status !== 'CANCELED' && position.order_type === 'SELL' && (
        <div className="flex gap-2 w-full items-center justify-between">
          <div className="flex flex-col gap-2 justify-center text-neutral-800 py-1.5 text-center text-md font-bold">
            {`Qty ${position.filled_quantity}/${position.quantity} matched`}
          </div>
          <div className="w-[50%]">
            {(position.status === 'PARTIAL' ||
              position.status === 'UNMATCHED') && (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger className="w-full">
                  <Button className="w-full bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors">
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      className="bg-white hover:bg-white/90"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-neutral-900 text-white hover:text-neutral-800 hover:bg-neutral-800/40"
                      onClick={() => handleCancelOrder(position)}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivePosition
