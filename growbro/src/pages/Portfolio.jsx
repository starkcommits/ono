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
import { useFrappeAuth, useFrappeGetDocList } from 'frappe-react-sdk'
import ActivePosition from '../components/ActivePosition'

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
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [tradeAction, setTradeAction] = useState(null)
  const [showTradeSheet, setShowTradeSheet] = useState(false)
  const [activeOrders, setActiveOrders] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])
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
        'quantity',
        'opinion_type',
        'market_id',
      ],
      filters: [
        ['status', '!=', 'SETTLED'],
        ['owner', '=', currentUser],
      ],
    })

  const { data: completedOrdersData, isLoading: completedOrdersLoading } =
    activeTab === 'completed' &&
    useFrappeGetDocList('Orders', {
      fields: ['name', 'amount', 'status'],
      filters: [
        ['status', '=', 'SETTLED'],
        ['owner', '=', currentUser],
      ],
    })

  useEffect(() => {
    if (activeOrdersData) setActiveOrders(activeOrdersData)
  }, [activeOrdersData])

  useEffect(() => {
    if (completedOrdersData) setCompletedOrders(completedOrdersData)
  }, [completedOrdersData])

  console.log('Active: ', activeOrders)
  console.log('Completed: ', completedOrders)

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

  const handleTradeAction = (position, action) => {
    setSelectedPosition(position)
    setTradeAction(action)
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
                <div className="text-white font-semibold">₹2,000.00</div>
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
                ? `${activeOrders.length} Active Position`
                : '15 Trades this month'}
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Trades List */}
          <div className="divide-y divide-gray-100">
            {activeTab === 'active'
              ? activeOrders.map((position) => (
                  <ActivePosition
                    key={position.name}
                    position={position}
                    handleTradeAction={handleTradeAction}
                  />
                ))
              : completedTrades.map((trade) => (
                  <div key={trade.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {trade.title}
                      </h3>
                      <div
                        className={`flex items-center ${
                          trade.status === 'won'
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {trade.status === 'won' ? (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 mr-1" />
                        )}
                        <span className="font-medium">
                          {trade.profitPercentage >= 0 ? '+' : ''}
                          {trade.profitPercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          trade.choice === 'yes'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {trade.choice.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(trade.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 font-medium">Amount</div>
                        <div className="font-semibold text-gray-900">
                          ₹{trade.amount}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 font-medium">
                          Profit/Loss
                        </div>
                        <div
                          className={`font-semibold ${
                            trade.profit >= 0
                              ? 'text-emerald-600'
                              : 'text-rose-600'
                          }`}
                        >
                          {trade.profit >= 0 ? '+' : ''}₹
                          {Math.abs(trade.profit)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {showTradeSheet && selectedPosition && (
        <TradeSheet
          market={selectedPosition}
          choice={selectedPosition.choice}
          onClose={handleTradeComplete}
        />
      )}
    </div>
  )
}

export default Portfolio
