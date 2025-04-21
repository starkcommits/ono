import React, { cache, useEffect, useMemo, useState } from 'react'
import {
  redirect,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

const MarketHolding = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tab || 'Yes')
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
  const { currentUser, isLoading } = useFrappeAuth()
  const [totalReturns, setTotalReturns] = useState(0)
  const [activeHoldings, setActiveHoldings] = useState({})

  const [completedTrades, setCompletedTrades] = useState({})

  const {
    data: holdingData,
    isLoading: holdingDataLoading,
    mutate: refetcHoldingData,
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
        'filled_quantity',
      ],
      filters: [
        ['user_id', '=', currentUser],
        ['market_id', '=', id],
      ],
    },
    currentUser ? undefined : null
  )

  console.log('Holding Data:', holdingData)

  useEffect(() => {
    if (!holdingDataLoading && holdingData?.length > 0) {
      const holdingDataMap = holdingData.reduce((acc, holding) => {
        acc[holding.name] = holding // ✅ Store as { "market_name": marketData }
        return acc
      }, {})
      setActiveHoldings(holdingDataMap)
    }
  }, [holdingData])

  console.log('Holding Data:', holdingData)

  console.log('Active Holding Data:', activeHoldings)

  useFrappeEventListener('order_event', (updatedOrder) => {
    console.log('Updated Order:', updatedOrder)

    // setActiveOrders((prev) => {
    //   const updatedActiveOrders = {
    //     ...prev,
    //     [updatedOrder.name]: updatedOrder,
    //   }
    //   return updatedActiveOrders
    // })
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
          <div className="flex justify-between bg-white/30 backdrop-blur-lg rounded-3xl p-6 mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">
                  Portfolio Value
                </span>
                {/* <div className="flex items-center bg-emerald-500 bg-opacity-25 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 text-white mr-1" />
                <span className="text-sm font-semibold text-white">+12.5%</span>
              </div> */}
              </div>
              <div className="text-3xl font-bold text-white flex items-center gap-4">
                <div>
                  ₹
                  {Object.values(activeHoldings).length > 0
                    ? Object.values(activeHoldings).reduce((acc, holding) => {
                        acc =
                          acc +
                          (holding.opinion_type === 'YES'
                            ? holding.market_yes_price
                            : holding.market_no_price) *
                            holding.quantity

                        return acc
                      }, 0)
                    : 0}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-end">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Invested</span>
                {/* <div className="flex items-center bg-emerald-500 bg-opacity-25 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 text-white mr-1" />
                <span className="text-sm font-semibold text-white">+12.5%</span>
              </div> */}
              </div>
              <div className="text-3xl font-bold text-white flex items-center gap-4">
                <div>
                  ₹
                  {Object.values(activeHoldings).length > 0
                    ? Object.values(activeHoldings).reduce((acc, holding) => {
                        return (
                          acc + parseFloat(holding.price * holding.quantity)
                        )
                      }, 0)
                    : 0}
                </div>
              </div>
            </div>
          </div>

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
          {/* <div className="flex p-2">
            <button
              onClick={() => {
                navigate(`/portfolio/${id}?tab=Yes`)
                setActiveTab('Yes')
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'Yes'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              YES
            </button>
            <button
              onClick={() => {
                navigate(`/portfolio/${id}?tab=No`)
                setActiveTab('No')
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'No'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              NO
            </button>
          </div> */}

          {/* Trades List */}
          <div className="divide-y divide-gray-100">
            {Object.values(activeHoldings).map((position) => (
              <div key={position.name} className="p-4 w-full cursor-pointer">
                <Badge className="text-xs font-semibold mb-2 hover:underline">
                  #{position.market_id}
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
                  <span className="flex items-center justify-between w-full">
                    {position.opinion_type === 'YES' && (
                      <span className="rounded-full bg-blue-200 text-blue-600 px-4 py-1">
                        {position.opinion_type}
                      </span>
                    )}
                    {position.opinion_type === 'NO' && (
                      <span className="rounded-full bg-red-200 text-red-600 px-4 py-1">
                        {position.opinion_type}
                      </span>
                    )}
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      End at {formatDate(position.closing_time)}
                    </div>
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-600 font-medium">Invested</div>
                    <div className="font-semibold text-gray-900">
                      ₹{position.price * position.quantity}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 font-medium">
                      Total Quantity
                    </div>
                    <div className="font-semibold text-gray-900">
                      {position.quantity}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 font-medium">Current</div>
                    <div className="font-semibold text-gray-900">
                      &#8377;
                      {position.opinion_type === 'YES'
                        ? position.market_yes_price * position.quantity
                        : position.market_no_price * position.quantity}
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
          refetchActiveHoldings={refetcHoldingData}
        />
      )}
    </div>
  )
}

export default MarketHolding
