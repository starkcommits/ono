import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Share2,
  Users,
  Timer,
  Book,
  ChevronDown,
  ChevronUp,
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
  useFrappeEventListener,
  useFrappeGetCall,
  useFrappeGetDoc,
} from 'frappe-react-sdk'
import TradingViewWidget from '../components/TradingViewWidget'
import OrderBook from '../components/OrderBook'

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

const EventDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [market, setMarket] = useState({})
  const [showTradeSheet, setShowTradeSheet] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [selectedAction, setSelectedAction] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const { data: marketData, isLoading: marketDataLoading } = useFrappeGetDoc(
    'Market',
    id
  )

  console.log(market)

  useEffect(() => {
    setMarket(marketData)
  }, [marketData])

  // Listen for real-time updates
  useFrappeEventListener('market_event', (updatedMarket) => {
    if (updatedMarket.name === market.name) {
      setMarket((prev) => ({ ...prev, ...updatedMarket }))
    }
  })

  const probabilityData = {
    labels: ['3:17 PM', '3:20 PM', '3:22 PM', '3:25 PM', '3:27 PM', '3:30 PM'],
    datasets: [
      {
        fill: true,
        label: 'Probability',
        data: [50, 48, 52, 45, 35, 33],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
        min: 0,
        max: 100,
        grid: { color: '#F3F4F6' },
        ticks: {
          color: '#6B7280',
          font: { size: 10 },
          callback: (value) => `${value}%`,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  }

  const handleTradeClick = (choice, action) => {
    setSelectedChoice(choice)
    setShowTradeSheet(true)
    setSelectedAction(action)
  }

  const closeTradeSheet = () => {
    setShowTradeSheet(false)
    setSelectedChoice(null)
  }

  return (
    <div className="min-h-full bg-gray-50">
      {/* Existing code remains the same */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        {/* ... existing header content ... */}
        <div className="px-4 pt-safe-top pb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 active:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">Event Details</h1>
            <button className="p-2 active:bg-gray-100 rounded-full transition-colors">
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-[calc(env(safe-area-inset-top)+4rem)] pb-[calc(env(safe-area-inset-bottom)+5rem)] px-4">
        {/* ... existing content ... */}
        <div className="flex flex-col items-center mb-6 mt-4">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl text-white">₿</span>
          </div>
          <h2 className="text-xl text-center font-medium mb-4 px-6">
            {market?.question}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1.5" />
              4000
              {/* {market.traders.toLocaleString()} */}
            </span>
            {market?.status === 'OPEN' && (
              <span className="flex items-center">
                <Timer className="h-4 w-4 mr-1.5" />
                Ends At {formatDate(market?.closing_time)}
              </span>
            )}
            {market?.status === 'CLOSED' && (
              <span className="flex items-center">
                <Timer className="h-4 w-4 mr-1.5" />
                Market Closed At {formatDate(market?.closing_time)}
              </span>
            )}
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-2">💡</span>
            <p className="text-sm text-amber-800">{market?.question}</p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleTradeClick('YES', 'BUY')}
            className="flex-1 py-3 px-4 bg-blue-500 text-white font-medium rounded-xl active:bg-blue-600 transition-colors"
          >
            Yes ₹{market?.yes_price}
          </button>

          <button
            onClick={() => handleTradeClick('NO', 'BUY')}
            className="flex-1 py-3 px-4 bg-rose-500 text-white font-medium rounded-xl active:bg-rose-600 transition-colors"
          >
            No ₹{market?.no_price}
          </button>
        </div>
        {/* <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">YES</span>
              <span className="text-sm font-medium text-blue-500">
                35% Probability
              </span>
            </div>
            <span className="text-sm text-gray-500">-33.3% All</span>
          </div>  

          <div className="flex gap-4 mb-4">
            {['5m', '10m', 'all'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setProbabilityTimeframe(timeframe)}
                className={`text-sm transition-colors ${
                  probabilityTimeframe === timeframe
                    ? 'text-blue-500 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {timeframe === 'all' ? 'All' : timeframe}
              </button>
            ))}
          </div>

          <div className="h-48 w-full mb-6">
            <Line data={probabilityData} options={chartOptions} />
          </div>
        </div> */}

        <OrderBook marketId={id} />

        {/* ... other existing content ... */}
      </div>

      {showTradeSheet && selectedChoice && (
        <TradeSheet
          tradePrice={market}
          choice={selectedChoice}
          onClose={closeTradeSheet}
          tradeAction={selectedAction}
        />
      )}
    </div>
  )
}

export default EventDetails

// import React, { useEffect, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import {
//   ArrowLeft,
//   Share2,
//   Users,
//   Timer,
//   Book,
//   ChevronDown,
//   ChevronUp,
// } from 'lucide-react'
// import { Line } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend,
// } from 'chart.js'
// import TradeSheet from '../components/TradeSheet'
// import { useFrappeEventListener, useFrappeGetDoc } from 'frappe-react-sdk'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Filler,
//   Legend
// )

// const EventDetails = () => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const initialMarket = location.state?.market || {}
//   const [probabilityTimeframe, setProbabilityTimeframe] = useState('all')
//   const [showTradeSheet, setShowTradeSheet] = useState(false)
//   const [selectedChoice, setSelectedChoice] = useState(null)
//   const [showOrderBook, setShowOrderBook] = useState(false)
//   const [market, setMarket] = useState(initialMarket)

//   const { data: marketData, isLoading } = useFrappeGetDoc('Market', market.name)

//   useEffect(() => {
//     if (marketData) {
//       setMarket(marketData)
//     }
//   }, [marketData])

//   // Listen for real-time updates
//   useFrappeEventListener('market_event', (updatedMarket) => {
//     if (updatedMarket.name === market.name) {
//       setMarket((prev) => ({ ...prev, ...updatedMarket }))
//     }
//   })

//   const orderBook = [
//     { price: 4.5, yesQty: 109, noQty: 80 },
//     { price: 5.5, yesQty: 78, noQty: 325 },
//     { price: 6.0, yesQty: 5, noQty: 168 },
//     { price: 6.5, yesQty: 45, noQty: 92 },
//     { price: 7.0, yesQty: 23, noQty: 156 },
//   ]

//   const probabilityData = {
//     labels: ['3:17 PM', '3:20 PM', '3:22 PM', '3:25 PM', '3:27 PM', '3:30 PM'],
//     datasets: [
//       {
//         fill: true,
//         label: 'Probability',
//         data: [50, 48, 52, 45, 35, 33],
//         borderColor: 'rgb(59, 130, 246)',
//         backgroundColor: 'rgba(59, 130, 246, 0.1)',
//         tension: 0.4,
//       },
//     ],
//   }

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         mode: 'index',
//         intersect: false,
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         titleColor: '#1F2937',
//         bodyColor: '#1F2937',
//         borderColor: '#E5E7EB',
//         borderWidth: 1,
//       },
//     },
//     scales: {
//       x: {
//         grid: { display: false },
//         ticks: { color: '#6B7280', font: { size: 10 } },
//       },
//       y: {
//         min: 0,
//         max: 100,
//         grid: { color: '#F3F4F6' },
//         ticks: {
//           color: '#6B7280',
//           font: { size: 10 },
//           callback: (value) => `${value}%`,
//         },
//       },
//     },
//     interaction: {
//       mode: 'nearest',
//       axis: 'x',
//       intersect: false,
//     },
//   }

//   const handleTradeClick = (choice) => {
//     setSelectedChoice(choice)
//     setShowTradeSheet(true)
//   }

//   return (
//     <div className="min-h-full bg-gray-50">
//       <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100">
//         <div className="px-4 pt-safe-top pb-4">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-2 -ml-2 active:bg-gray-100 rounded-full transition-colors"
//             >
//               <ArrowLeft className="h-6 w-6" />
//             </button>
//             <h1 className="text-lg font-semibold">Event Details</h1>
//             <button className="p-2 active:bg-gray-100 rounded-full transition-colors">
//               <Share2 className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="pt-[calc(env(safe-area-inset-top)+4rem)] pb-[calc(env(safe-area-inset-bottom)+5rem)] px-4">
//         <div className="flex flex-col items-center mb-6">
//           <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
//             <span className="text-3xl text-white">₿</span>
//           </div>
//           <h2 className="text-xl text-center font-medium mb-4 px-6">
//             {market.question}
//           </h2>
//           <div className="flex items-center gap-4 text-sm text-gray-600">
//             <span className="flex items-center">
//               <Users className="h-4 w-4 mr-1.5" />
//               4000
//               {/* {market.traders.toLocaleString()} */}
//             </span>
//             <span className="flex items-center">
//               <Timer className="h-4 w-4 mr-1.5" />
//               Ends in 2d
//             </span>
//           </div>
//         </div>

//         <div className="bg-amber-50 p-4 rounded-xl mb-6">
//           <div className="flex items-center">
//             <span className="text-2xl mr-2">💡</span>
//             <p className="text-sm text-amber-800">{market.question}</p>
//           </div>
//         </div>

//         <div className="flex gap-3 mb-6">
//           {/* <TradeSheet market={market} choice={selectedChoice} /> */}

//           <button
//             onClick={() => handleTradeClick('yes')}
//             className="flex-1 py-3 px-4 bg-blue-500 text-white font-medium rounded-xl active:bg-blue-600 transition-colors"
//           >
//             Yes ₹{market.yes_price}
//           </button>
//           {/* <TradeSheet market={market} choice={selectedChoice} /> */}

//           <button
//             onClick={() => handleTradeClick('no')}
//             className="flex-1 py-3 px-4 bg-rose-500 text-white font-medium rounded-xl active:bg-rose-600 transition-colors"
//           >
//             No ₹{market.no_price}
//           </button>
//         </div>

//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-medium">YES</span>
//               <span className="text-sm font-medium text-blue-500">
//                 35% Probability
//               </span>
//             </div>
//             <span className="text-sm text-gray-500">-33.3% All</span>
//           </div>

//           <div className="flex gap-4 mb-4">
//             {['5m', '10m', 'all'].map((timeframe) => (
//               <button
//                 key={timeframe}
//                 onClick={() => setProbabilityTimeframe(timeframe)}
//                 className={`text-sm transition-colors ${
//                   probabilityTimeframe === timeframe
//                     ? 'text-blue-500 font-medium'
//                     : 'text-gray-500'
//                 }`}
//               >
//                 {timeframe === 'all' ? 'All' : timeframe}
//               </button>
//             ))}
//           </div>

//           <div className="h-48 w-full mb-6">
//             <Line data={probabilityData} options={chartOptions} />
//           </div>
//         </div>

//         <div className="mb-4">
//           <button
//             onClick={() => setShowOrderBook(!showOrderBook)}
//             className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors"
//           >
//             <div className="flex items-center">
//               <Book className="h-5 w-5 mr-2" />
//               <span className="font-medium">Order Book</span>
//             </div>
//             {showOrderBook ? (
//               <ChevronUp className="h-5 w-5" />
//             ) : (
//               <ChevronDown className="h-5 w-5" />
//             )}
//           </button>

//           {showOrderBook && (
//             <div className="mt-4 bg-white rounded-xl border border-gray-100 overflow-hidden">
//               <div className="grid grid-cols-3 gap-4 px-4 py-3 bg-gray-50 text-sm font-medium">
//                 <span>Price</span>
//                 <span className="text-blue-600">Qty at YES</span>
//                 <span className="text-rose-600">Qty at NO</span>
//               </div>
//               <div className="divide-y divide-gray-100">
//                 {orderBook.map((entry, index) => (
//                   <div
//                     key={index}
//                     className="grid grid-cols-3 gap-4 px-4 py-3 text-sm"
//                   >
//                     <span>₹{entry.price}</span>
//                     <span className="text-blue-600">{entry.yesQty}</span>
//                     <span className="text-rose-600">{entry.noQty}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {showTradeSheet && selectedChoice && (
//         <TradeSheet
//           market={market}
//           choice={selectedChoice}
//           onClose={() => setShowTradeSheet(false)}
//         />
//       )}
//     </div>
//   )
// }

// export default EventDetails
