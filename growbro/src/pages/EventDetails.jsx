import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Share2,
  Users,
  Timer,
  CalendarClock,
  Book,
  BookOpen,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  useFrappeDocTypeEventListener,
  useFrappeEventListener,
  useFrappeGetDoc,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import EventDetailsOrderBook from '../components/EventDetailsOrderBook'
import OrdersTab from '../components/OrdersTab'

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
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tab || 'activity')
  const { id } = useParams()
  const [market, setMarket] = useState({})
  const [showTradeSheet, setShowTradeSheet] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [selectedAction, setSelectedAction] = useState(null)

  const {
    data: tradesData,
    isLoading: tradesLoading,
    mutate: refetchTrades,
  } = useFrappeGetDocList(
    'Trades',
    {
      fields: [
        'name',
        'creation',
        'first_user_order_id',
        'first_user_price',
        'first_user_id',
        'second_user_order_id',
        'second_user_price',
        'second_user_id',
        'quantity',
      ],
      filters: { market_id: id },
      orderBy: {
        field: 'creation',
        order: 'desc',
      },
    },
    activeTab === 'activity' ? undefined : null
  )

  useFrappeDocTypeEventListener('Trades', (updatedTrade) => {
    refetchTrades()
  })

  console.log('Trades: ', tradesData)

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

  useEffect(() => {
    if (!marketDataLoading && Object.values(marketData)) {
      setMarket(marketData)
    }
  }, [marketData])

  useFrappeEventListener('market_event', (updatedData) => {
    console.log('Hello: ', updatedData)
    if (updatedData.name !== id) return
    console.log('Updated Data: ', updatedData)
    setMarket(updatedData)
  })

  console.log('market:', market)
  // Listen for real-time updates
  // useFrappeEventListener('market_event', (updatedMarket) => {
  //   if (updatedMarket.name === market.name) {
  //     setMarket((prev) => ({ ...prev, ...updatedMarket }))
  //   }
  // })
  const handleTabChange = (value) => {
    setActiveTab(value)

    // Update URL with the new tab parameter
    const newSearchParams = new URLSearchParams(location.search)
    newSearchParams.set('tab', value)

    // Update URL without refreshing the page
    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    })
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

  if (marketDataLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="spinner w-14 h-14 rounded-full border-4 border-gray-200 border-r-blue-500 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className=" bg-gray-50">
      {/* Existing code remains the same */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        {/* ... existing header content ... */}
        <div className="px-4 pt-safe-top pb-4">
          <div className="flex items-center max-w-lg gap-6 mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 active:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">Event Details</h1>
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
              {market?.total_traders} traders
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
        {/* <div className="bg-amber-50 p-4 rounded-xl mb-6">
          <div className="flex items-center">
            <span className="text-2xl mr-2">💡</span>
            <p className="text-sm text-amber-800">{market?.question}</p>
          </div>
        </div> */}
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
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="activity" className="w-full">
              Activity
            </TabsTrigger>
            <TabsTrigger value="order book" className="w-full">
              Order Book
            </TabsTrigger>
            <TabsTrigger value="orders" className="w-full">
              Orders
            </TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            <div className="bg-white rounded-xl shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-center text-gray-700">
                  {tradesData?.length > 0
                    ? 'Matched Users'
                    : 'No Users matched yet.'}
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {tradesData?.map((match) => {
                  const firstUser = match?.first_user_id.split('@')[0]
                  const secondUser = match?.second_user_id.split('@')[0]
                  const formatName = (name) =>
                    name.length > 10
                      ? name.charAt(0).toUpperCase() + name.slice(1, 10) + '…'
                      : name.charAt(0).toUpperCase() + name.slice(1)
                  return (
                    <div
                      key={match?.name}
                      className="px-6 py-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center justify-between mb-3">
                        {/* First User */}
                        <div className="flex flex-col items-center w-1/3">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-blue-200 shadow-inner flex items-center justify-center font-semibold text-blue-900">
                              {firstUser.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <span
                            className="text-sm mt-1 font-medium text-gray-700"
                            title={match.first_user_id}
                          >
                            {formatName(firstUser)}
                          </span>
                        </div>
                        {/* Bar */}
                        <div className="w-1/3 h-8 relative bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                          <div className="flex h-full transition-all duration-500 ease-in-out">
                            <div
                              className="bg-blue-400 flex items-center justify-center text-xs text-white font-bold"
                              style={{
                                width: `${match.first_user_price * 10}%`,
                              }}
                            >
                              {match.first_user_price}
                            </div>
                            <div
                              className="bg-rose-400 flex items-center justify-center text-xs text-white font-bold"
                              style={{
                                width: `${match.second_user_price * 10}%`,
                              }}
                            >
                              {match.second_user_price}
                            </div>
                          </div>
                        </div>
                        {/* Second User */}
                        <div className="flex flex-col items-center w-1/3">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-red-200 shadow-inner flex items-center justify-center font-semibold text-red-900">
                              {secondUser.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <span
                            className="text-sm mt-1 font-medium text-gray-700"
                            title={match.second_user_id}
                          >
                            {formatName(secondUser)}
                          </span>
                        </div>
                      </div>
                      {/* Timestamp */}
                      <div className="flex justify-center text-sm text-gray-500">
                        <CalendarClock className="h-4 w-4 mr-1" />
                        <span>{formatDate(match?.creation)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="order book">
            <div className="flex items-center gap-2 px-4 py-4 bg-gray-50">
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Order Book</span>
            </div>
            {market?.status === 'OPEN' && (
              <EventDetailsOrderBook marketId={id} />
            )}
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
        </Tabs>

        {/* ... other existing content ... */}
      </div>

      {market?.status === 'OPEN' && showTradeSheet && selectedChoice && (
        <TradeSheet
          marketPrice={
            selectedChoice === 'YES' ? market.yes_price : market.no_price
          }
          choice={selectedChoice}
          onClose={closeTradeSheet}
          tradeAction={selectedAction}
          marketId={id}
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
