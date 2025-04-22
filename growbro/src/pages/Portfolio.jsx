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
import TradeSheet from '../components/TradeSheet'
import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetCall,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import ActivePosition from '../components/ActivePositions'
import CompletedTrades from '../components/CompletedTrades'
import PortfolioActiveValues from '../components/PortfolioActiveValues'

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
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tab || 'active')
  const [tradePrice, setTradePrice] = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [selectedAction, setSelectedAction] = useState(null)
  const [marketPrice, setMarketPrice] = useState(null)
  const [marketId, setMarketId] = useState(null)
  const [sellQuantity, setSellQuantity] = useState(null)
  const [previousOrderId, setPreviousOrderId] = useState(null)
  const [showTradeSheet, setShowTradeSheet] = useState(false)
  const [activeOrders, setActiveOrders] = useState({})
  const [completedOrders, setCompletedOrders] = useState({})
  const { currentUser, isLoading: currentUserLoading } = useFrappeAuth()
  const [totalReturns, setTotalReturns] = useState(0)
  const [activeHoldings, setActiveHoldings] = useState({})
  const [completedTrades, setCompletedTrades] = useState({})

  const {
    data: holdingData,
    isLoading: holdingDataLoading,
    mutate: refetchActiveHoldings,
  } = useFrappeGetCall(
    'rewardapp.engine.get_marketwise_holding',
    activeTab === 'active' ? undefined : null
  )

  console.log(holdingData)

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (!tab) {
      searchParams.set('tab', 'active')
      setSearchParams(searchParams)
    }
  }, [])

  useEffect(() => {
    if (!holdingDataLoading && holdingData.message === undefined) {
      return
    }
    if (!holdingDataLoading && Object.values(holdingData.message).length > 0) {
      const holdingDataMap = Object.values(holdingData.message).reduce(
        (acc, holding) => {
          acc[holding.name] = holding // ✅ Store as { "market_name": marketData }
          return acc
        },
        {}
      )
      setActiveHoldings(holdingDataMap)
    }
  }, [holdingData])

  const {
    data: completedTradesData,
    isLoading: completedTradesLoading,
    mutate: refetchCompletedTrades,
  } = useFrappeGetDocList(
    'Holding',
    {
      fields: [
        'name',
        'market_id',
        'price',
        'quantity',
        'opinion_type',
        'status',
        'exit_price',
        'market_yes_price',
        'market_no_price',
        'closing_time',
        'order_id',
        'filled_quantity',
      ],
      filters: [
        ['owner', '=', currentUser],
        ['status', '=', 'EXITED'],
      ],
    },
    currentUser && activeTab === 'completed' ? undefined : null
  )

  // console.log('Holdings: ', activeHoldings)

  useEffect(() => {
    if (!completedTradesLoading && completedTradesData?.length > 0) {
      const completedTradesMap = completedTradesData.reduce((acc, trade) => {
        acc[trade.name] = trade // ✅ Store as { "market_name": marketData }
        return acc
      }, {})
      setCompletedTrades(completedTradesMap)
    }
  }, [completedTradesData])

  console.log('Active Holdings: ', activeHoldings)

  // const { data: userOrders, isLoading: userOrdersLoading } =
  //   useFrappeGetDocList(
  //     'Orders',
  //     {
  //       filters: [['owner', '=', currentUser]], // Replace with logged-in user
  //       fields: [
  //         'name',
  //         'question',
  //         'creation',
  //         'amount',
  //         'status',
  //         'filled_quantity',
  //         'owner',
  //         'quantity',
  //         'opinion_type',
  //         'closing_time',
  //         'order_type',
  //         'market_id',
  //         'yes_price',
  //         'no_price',
  //         'buy_order_id',
  //         'sell_order_id',
  //       ],
  //     },
  //     currentUser ? undefined : null
  //   )

  // useFrappeEventListener('order_event', (updatedOrder) => {
  //   console.log('Updated Order:', updatedOrder)

  //   setActiveOrders((prev) => {
  //     const updatedActiveOrders = {
  //       ...prev,
  //       [updatedOrder.name]: updatedOrder,
  //     }
  //     return updatedActiveOrders
  //   })
  // })

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

  const handleTradeClick = (
    marketPrice,
    choice,
    tradeAction,
    marketId,
    sellQuantity,
    previousOrderId
  ) => {
    setSelectedChoice(choice)
    setSelectedAction(tradeAction)
    setMarketPrice(marketPrice)
    setMarketId(marketId)
    setSellQuantity(sellQuantity)
    setPreviousOrderId(previousOrderId)
    setShowTradeSheet(true)
  }

  const handleTradeComplete = () => {
    setShowTradeSheet(false)
    setSelectedChoice(null)
    setSelectedAction(null)
  }

  const invested = Object.values(activeOrders).reduce((acc, order) => {
    return acc + parseFloat(order.amount * order.quantity)
  }, 0)

  const currentValue = Object.values(activeOrders).reduce((acc, order) => {
    return (
      acc +
      parseFloat(
        (order.opinion_type === 'YES' ? order.yes_price : order.no_price) *
          order.quantity
      )
    )
  }, 0)

  const profitLoss = currentValue - invested

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
          <PortfolioActiveValues />

          {/* Chart Card */}
          {/* <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="h-40">
              <Line data={performanceData} options={chartOptions} />
            </div>
          </div> */}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl shadow-sm">
          {/* Tabs */}
          <div className="flex p-2">
            <button
              onClick={() => {
                navigate('/portfolio?tab=active')
                setActiveTab('active')
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Active Positions
            </button>
            <button
              onClick={() => {
                navigate('/portfolio?tab=completed')
                setActiveTab('completed')
              }}
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
                ? `${Object.values(activeHoldings).length} Active Position`
                : `${Object.values(completedTrades).length} Trades this month`}
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Trades List */}
          <div className="divide-y divide-gray-100">
            {activeTab === 'active'
              ? Object.values(activeHoldings).map((position) => (
                  <ActivePosition
                    key={position.market_id}
                    position={position}
                    setActiveHoldings={setActiveHoldings}
                    refetchActiveHoldings={refetchActiveHoldings}
                    handleTradeClick={handleTradeClick}
                  />
                ))
              : Object.values(completedTrades).map((trade) => (
                  <CompletedTrades key={trade.name} trade={trade} />
                ))}
          </div>
        </div>
      </div>

      {showTradeSheet && selectedChoice && (
        <TradeSheet
          marketPrice={marketPrice}
          choice={selectedChoice}
          tradeAction={selectedAction}
          onClose={handleTradeComplete}
          marketId={marketId}
          sellQuantity={sellQuantity}
          previousOrderId={previousOrderId}
          refetchActiveHoldings={refetchActiveHoldings}
        />
      )}
    </div>
  )
}

export default Portfolio

{
  /* <div
                className={`text-sm font-semibold flex items-center ${
                  profitLoss > 0 && 'text-green-600'
                } ${profitLoss < 0 && 'text-red-600'}`}
              >
                {profitLoss}
                {profitLoss > 0 && <ArrowUp className="h-5 w-5" />}
                {profitLoss < 0 && <ArrowDown className="h-5 w-5" />}
              </div> */
}
