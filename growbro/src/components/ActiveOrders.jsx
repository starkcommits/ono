import {
  useFrappeAuth,
  useFrappeEventListener,
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
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useFrappeDeleteDoc } from 'frappe-react-sdk'

const ActiveOrders = ({
  order,
  setActiveOrders,
  handleTradeClick,
  refetchActiveOrders,
}) => {
  const [market, setMarket] = useState({})
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { updateDoc } = useFrappeUpdateDoc()
  const { currentUser } = useFrappeAuth()

  useFrappeEventListener('market_event', (updatedMarket) => {
    console.log('Hello')
    if (updatedMarket.name === order.market_id) {
      console.log('Current: ', order.market_id)
      console.log('Updated:', updatedMarket.name)
    }
    if (updatedMarket.name === order.market_id) {
      setActiveOrders((prev) => {
        const updatedActiveOrders = {
          ...prev,
          [order.name]: {
            name: order.name,
            question: order.question,
            creation: order.creation,
            amount: order.amount,
            status: order.status,
            quantity: order.quantity,
            opinion_type: order.opinion_type,
            market_id: order.market_id,
            yes_price:
              order.opinion_type === 'YES'
                ? updatedMarket.yes_price
                : order.yes_price,
            no_price:
              order.opinion_type === 'NO'
                ? updatedMarket.no_price
                : order.no_price,
            sell_order_id: order.sell_order_id,
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
      console.log(order)
      if (order.order_type === 'SELL') {
        console.log('Entered')
        await updateDoc('Orders', order.buy_order_id, {
          sell_order_id: null,
        })
        await updateDoc('Orders', order.name, {
          status: 'SETTLED',
          remark: 'Sell order canceled in midway',
        })
      } else {
        await updateDoc('Orders', order.name, {
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

  const handleMarketClick = (order) => {
    navigate(`/event/${order.market_id}`)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div key={order.name} className="p-4 w-full cursor-pointer">
        <Badge className="text-xs font-semibold mb-2 hover:underline">
          #{order.name}
        </Badge>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2 items-center justify-between w-full">
            <div className="font-medium text-gray-900">{order.question}</div>

            <span className="bg-yellow-100 text-yellow-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {order.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              order.opinion_type === 'YES'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-rose-100 text-rose-700'
            }`}
          >
            {order.opinion_type}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            End at {formatDate(order.closing_time)}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
          <div>
            <div className="text-gray-600 font-medium">Amount</div>
            <div className="font-semibold text-gray-900">
              ₹{order.quantity * order.amount}
            </div>
          </div>
          <div>
            <div className="text-gray-600 font-medium">Qty @ Price</div>
            <div className="font-semibold text-gray-900">
              {order.quantity} @ ₹{order.amount}
            </div>
          </div>
          <div>
            <div className="text-gray-600 font-medium">Current</div>
            <div className="font-semibold text-gray-900">
              ₹
              {order.opinion_type === 'xYES'
                ? String(order.yes_price)
                : String(order.no_price)}
            </div>
          </div>
        </div>
        {order.status !== 'CANCELED' ? (
          <div className="flex gap-2 w-full items-center justify-between">
            <div className="w-[50%]">
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
                      onClick={() => handleCancelOrder(order)}
                    >
                      Submit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Button
              onClick={() => {
                handleMarketClick(order)
              }}
              className="w-[50%] bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Invest More
            </Button>
          </div>
        ) : null}
      </div>
    </>
  )
}

export default ActiveOrders
