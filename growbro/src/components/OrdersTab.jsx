import React, { cache, useEffect, useMemo, useState } from 'react'
import {
  redirect,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  XCircle,
  Plus,
  CloudLightning,
  ShieldEllipsis,
  ArrowDown,
  ArrowUp,
} from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetDocList,
} from 'frappe-react-sdk'

import ActiveOrders from './ActiveOrders'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const OrdersTab = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const [activeOrders, setActiveOrders] = useState({})
  const { currentUser, isLoading } = useFrappeAuth()

  const {
    data: activeOrdersData,
    isLoading: activeOrdersLoading,
    mutate: refetchActiveOrders,
  } = useFrappeGetDocList(
    'Orders',
    {
      fields: [
        'name',
        'question',
        'creation',
        'amount',
        'status',
        'filled_quantity',
        'owner',
        'quantity',
        'opinion_type',
        'closing_time',
        'order_type',
        'market_id',
        'market_status',
        'yes_price',
        'no_price',
      ],
      filters: [
        ['status', 'not in', ['SETTLED']],
        ['owner', '=', currentUser],
      ],
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
    },
    currentUser ? undefined : null
  )

  useEffect(() => {
    if (!activeOrdersLoading && activeOrdersData?.length > 0) {
      const activeOrdersMap = activeOrdersData.reduce((acc, order) => {
        acc[order.name] = order // ✅ Store as { "market_name": marketData }
        return acc
      }, {})
      setActiveOrders(activeOrdersMap)
    }
  }, [activeOrdersData])

  useFrappeEventListener('order_event', (updatedOrder) => {
    console.log('Updated Order:', updatedOrder)
    refetchActiveOrders()
    // setActiveOrders((prev) => {
    //   const updatedActiveOrders = {
    //     ...prev,
    //     [updatedOrder.name]: updatedOrder,
    //   }
    //   return updatedActiveOrders
    // })
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content Section */}
      <div className="mt-4">
        <div className="bg-white rounded-3xl shadow-sm">
          {/* Filter Bar */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="text-sm font-medium text-gray-700">
              {
                Object.values(activeOrders)?.filter((order) => {
                  return order.status !== 'CANCELED'
                }).length
              }
              {` `}
              Active Orders
            </div>
          </div>

          {/* Trades List */}
          <div className="divide-y divide-gray-100">
            {Object.values(activeOrders).map((order) => (
              <ActiveOrders
                key={order.name}
                order={order}
                setActiveOrders={setActiveOrders}
                refetchActiveOrders={refetchActiveOrders}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersTab
