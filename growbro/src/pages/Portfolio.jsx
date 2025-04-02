import React, { cache, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import TradeSheet from '../components/TradeSheet'
import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetCall,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import ActivePosition from '../components/ActivePosition'
import CompletedTrades from '../components/CompletedTrades'

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

const Portfolio = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('active')
  const [tradePrice, setTradePrice] = useState({})
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [tradeAction, setTradeAction] = useState(null)
  const [showTradeSheet, setShowTradeSheet] = useState(false)
  const [activeOrders, setActiveOrders] = useState({})
  const [completedOrders, setCompletedOrders] = useState({})
  const { currentUser } = useFrappeAuth()

  const filters =
    activeTab === 'active'
      ? [
          ['status', '!=', 'SETTLED'],
          ['owner', '=', currentUser],
        ]
      : [
          ['status', '=', 'SETTLED'],
          ['owner', '=', currentUser],
        ]

  const { data: activeOrdersData, isLoading: activeOrdersLoading } =
    activeTab === 'active' &&
    useFrappeGetDocList('Orders', {
      fields: [
        'name',
        'question',
        'amount',
        'status',
        'quantity',
        'opinion_type',
        'market_id',
      ],
      filters: [
        ['status', 'not in', ['SETTLED']],
        ['owner', '=', currentUser],
      ],
    })

  // const { data: completedOrdersData, isLoading: completedOrdersLoading } =
  //   activeTab === 'completed' &&
  //   useFrappeGetDocList('Orders', {
  //     fields: [
  //       'name',
  //       'amount',
  //       'quantity',
  //       'status',
  //       'opinion_type',
  //       'market_id',
  //       'closing_time',
  //     ],
  //     filters: [
  //       ['status', 'in', ['SETTLED', 'CANCELED']],
  //       ['owner', '=', currentUser],
  //     ],
  //   })

  const { data: completedOrdersData, isLoading: completedOrdersLoading } =
    activeTab === 'completed' &&
    useFrappeGetCall('rewardapp.engine.get_marketwise_transaction_summary', {
      fields: ['*'],
    })

  if (!completedOrdersLoading) {
    console.log('Completed :', completedOrdersData?.message)
  }

  useEffect(() => {
    if (
      !activeOrdersLoading &&
      activeOrdersData?.length > 0 &&
      Object.keys(activeOrders).length === 0
    ) {
      const activeOrdersMap = activeOrdersData.reduce((acc, order) => {
        acc[order.name] = order // ✅ Store as { "market_name": marketData }
        return acc
      }, {})
      setActiveOrders(activeOrdersMap)
    }
  }, [activeOrdersLoading])

  useEffect(() => {
    if (!completedOrdersLoading) {
      setCompletedOrders(completedOrdersData?.message || {})
    }
  }, [completedOrdersData])

  useFrappeEventListener('order_event', (updatedOrder) => {
    console.log('Updated Order:', updatedOrder)
    setActiveOrders((prevOrders) => {
      if (!prevOrders[updatedOrder.name]) return prevOrders // If order doesn't exist, return previous state

      return {
        ...prevOrders,
        [updatedOrder.name]: {
          ...prevOrders[updatedOrder.name], // Keep existing order data
          status: updatedOrder.status, // Update status if it changes
        },
      }
    })
  })

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Portfolio Value',
        data: [1000, 1200, 1150, 1400, 1300, 1500, 1450],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: '#E5E7EB',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6B7280', font: { size: 10 } },
      },
      y: {
        grid: { color: '#F3F4F6' },
        ticks: {
          color: '#6B7280',
          font: { size: 10 },
          callback: (value) => `₹${value}`,
        },
      },
    },
  }

  const activePositions = [
    {
      id: '1',
      title: 'Bitcoin to reach $50,000',
      choice: 'yes',
      amount: 500,
      quantity: 50,
      price: 4.5,
      currentPrice: 5.2,
      profit: 70,
      profitPercentage: 14,
      timeLeft: '2d 5h',
      odds: { yes: 5.2, no: 4.8 },
    },
    {
      id: '2',
      title: 'India vs England - 5th Test',
      choice: 'no',
      amount: 1000,
      quantity: 100,
      price: 6.0,
      currentPrice: 5.5,
      profit: -50,
      profitPercentage: -5,
      timeLeft: '5d',
      odds: { yes: 5.5, no: 4.5 },
    },
  ]

  const completedTrades = [
    {
      id: '3',
      title: 'MrBeast to hit 200M subscribers',
      choice: 'yes',
      amount: 750,
      profit: 125,
      profitPercentage: 16.67,
      completedAt: '2024-03-01',
      status: 'won',
    },
    {
      id: '4',
      title: 'Tesla Q4 Earnings Beat',
      choice: 'no',
      amount: 500,
      profit: -500,
      profitPercentage: -100,
      completedAt: '2024-02-28',
      status: 'lost',
    },
  ]

  const handleTradeAction = (position, action, market) => {
    setSelectedPosition(position)
    setTradeAction(action)
    setTradePrice(market)
    setShowTradeSheet(true)
  }

  const handleTradeComplete = () => {
    setShowTradeSheet(false)
    setSelectedPosition(null)
    setTradeAction(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Section with improved contrast */}
      <div className="bg-indigo-600 pt-safe-top pb-8">
        <div className="px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-white">Portfolio</h1>
          </div>

          {/* Portfolio Stats Card with better contrast */}
          <div className="bg-white/30 backdrop-blur-lg rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Portfolio Value</span>
              <div className="flex items-center bg-emerald-500 bg-opacity-25 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 text-white mr-1" />
                <span className="text-sm font-semibold text-white">+12.5%</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-white mb-4">₹2,345.67</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-white/90 font-medium mb-1">Invested</div>
                <div className="text-white font-semibold">
                  ₹
                  {Object.values(activeOrders).length > 0
                    ? Object.values(activeOrders).reduce((acc, order) => {
                        return acc + parseFloat(order.amount * order.quantity)
                      }, 0)
                    : 0}
                </div>
              </div>
              <div>
                <div className="text-white/90 font-medium mb-1">Returns</div>
                <div className="text-emerald-300 font-semibold">+₹345.67</div>
              </div>
              <div>
                <div className="text-white/90 font-medium mb-1">Win Rate</div>
                <div className="text-white font-semibold">68%</div>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="h-40">
              <Line data={performanceData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-sm">
          {/* Tabs */}
          <div className="flex p-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Active Positions
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Completed Trades
            </button>
          </div>

          {/* Filter Bar */}
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <div className="text-sm font-medium text-gray-700">
              {activeTab === 'active'
                ? `${Object.values(activeOrders).length} Active Position`
                : `${Object.values(completedOrders).length} Trades this month`}
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Trades List */}
          <div className="divide-y divide-gray-100">
            {activeTab === 'active'
              ? Object.values(activeOrders).map((position) => (
                  <ActivePosition
                    key={position.name}
                    position={position}
                    handleTradeAction={handleTradeAction}
                  />
                ))
              : Object.values(completedOrders).map((trade) => (
                  <CompletedTrades key={trade.name} trade={trade} />
                ))}
          </div>
        </div>
      </div>

      {showTradeSheet && selectedPosition && (
        <TradeSheet
          market={selectedPosition}
          tradePrice={tradePrice}
          choice={selectedPosition.opinion_type}
          onClose={handleTradeComplete}
          tradeAction={tradeAction}
        />
      )}
    </div>
  )
}

export default Portfolio
