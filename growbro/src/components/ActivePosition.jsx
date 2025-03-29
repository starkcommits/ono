import {
  useFrappeEventListener,
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappeUpdateDoc,
} from 'frappe-react-sdk'
import { Clock, Plus, TrendingDown, TrendingUp, XCircle } from 'lucide-react'
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

const ActivePosition = ({ position, handleTradeAction }) => {
  const [market, setMarket] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const { updateDoc } = useFrappeUpdateDoc()

  //   const { data: marketData, isLoading: marketDataLoading } = useFrappeGetDoc(
  //     {
  //       doctype: 'Market',
  //       name: position.market_id,
  //     },

  //     {
  //       fields: [
  //         'name',
  //         position.opinion_type === 'YES' ? 'yes_price' : 'no_price',
  //       ],
  //     }
  //   )

  const { data: marketData, isLoading: marketDataLoading } =
    useFrappeGetDocList('Market', {
      /** SWR Configuration Options - Optional **/
      fields: ['name', 'yes_price', 'no_price', 'closing_time'], // Specify the fields you want
      filters: [['name', '=', position.market_id]],
    })

  useEffect(() => {
    if (marketData?.length > 0) setMarket(marketData[0])
  }, [marketDataLoading])

  useFrappeEventListener('market_event', (updatedMarket) => {
    console.log('Updated Market:', updatedMarket)
    if (updatedMarket.name === position.market_id) {
      if (position.opinion_type === 'YES') {
        setMarket((prevMarket) => ({
          ...prevMarket,
          yes_price: updatedMarket.yes_price,
        }))
      } else {
        setMarket((prevMarket) => ({
          ...prevMarket,
          no_price: updatedMarket.no_price,
        }))
      }
    }
  })

  const handleCancelOrder = async () => {
    try {
      const order = await updateDoc('Orders', position.name, {
        status: 'CANCELED',
      })
      console.log(order)
      setIsOpen(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div key={position.name} className="p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <h3 className="font-medium text-gray-900">{position.question}</h3>
          {position.status === 'UNMATCHED' && (
            <span className="bg-slate-200 text-slate-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {' '}
              {position.status}
            </span>
          )}
          {position.status === 'PARTIAL' && (
            <span className="bg-yellow-100 text-yellow-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {' '}
              {position.status}
            </span>
          )}
          {position.status === 'MATCHED' && (
            <span className="bg-emerald-100 text-emerald-700 rounded-xl p-1 text-xs text-[0.7rem] font-medium">
              {' '}
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
          {position.opinion_type.toUpperCase()}
        </span>
        <span>•</span>
        <span className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" />
          End at{' '}
          {market?.closing_time
            ?.split(' ')[0]
            .split('-')
            .reverse()
            .join('-')}{' '}
          {market?.closing_time?.split(' ')[1].split(':').join(':').slice(0, 5)}
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
              ? market?.yes_price
              : market?.no_price}
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full items-center justify-between">
        {position.status !== 'MATCHED' ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <Button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors">
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
        ) : (
          <Button
            onClick={() => handleTradeAction(position, 'SELL')}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors"
          >
            <XCircle className="h-4 w-4" />
            Exit Position
          </Button>
        )}
        <button
          onClick={() => handleTradeAction(position, 'BUY')}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Invest More
        </button>
      </div>
    </div>
  )
}

export default ActivePosition
