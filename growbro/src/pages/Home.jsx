import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Menu,
  TrendingUp,
  Users,
  ChevronRight,
  Timer,
  Award,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import WalletBalance from '../components/WalletBalance'
import SlideMenu from '../components/SlideMenu'
import {
  useFrappeAuth,
  useFrappeDocTypeEventListener,
  useFrappeEventListener,
  useFrappeGetDocList,
} from 'frappe-react-sdk'

const categories = [
  {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    color: 'from-rose-400 to-rose-500',
  },
  {
    id: 'crypto',
    name: 'Crypto',
    icon: '₿',
    color: 'from-amber-400 to-amber-500',
  },
  {
    id: 'youtube',
    name: 'Youtube',
    icon: '▶️',
    color: 'from-blue-400 to-blue-500',
  },
  {
    id: 'stocks',
    name: 'Stocks',
    icon: '📈',
    color: 'from-green-400 to-green-500',
  },
  {
    id: 'politics',
    name: 'Politics',
    icon: '🗳️',
    color: 'from-purple-400 to-purple-500',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    color: 'from-pink-400 to-pink-500',
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: '⚽',
    color: 'from-orange-400 to-orange-500',
  },
  {
    id: 'tech',
    name: 'Tech',
    icon: '💻',
    color: 'from-cyan-400 to-cyan-500',
  },
]

const trendingMarkets = [
  {
    id: '1',
    category: 'Cricket',
    title: 'New Zealand to win the 3rd T20I vs Pakistan?',
    traders: 3349,
    info: 'H2H last 5 T20: New Zealand 4, PAK 1',
    odds: { yes: 8.0, no: 2.0 },
    trend: '+12%',
    image:
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
    type: 'featured',
  },
  {
    id: '2',
    category: 'Crypto',
    title: 'Bitcoin to reach $50,000 by end of March?',
    traders: 2891,
    info: 'Current price: $48,235.21 (+2.4%)',
    odds: { yes: 3.5, no: 1.5 },
    trend: '+28%',
    type: 'compact',
  },
  {
    id: '3',
    category: 'Youtube',
    title: 'MrBeast to hit 250M subscribers by April?',
    traders: 1567,
    info: 'Current: 247M, Growth rate: 100k/day',
    odds: { yes: 4.2, no: 1.8 },
    trend: '+15%',
    image:
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop',
    type: 'featured',
  },
  {
    id: '4',
    category: 'Stocks',
    title: 'Tesla to announce new AI chip in Q2?',
    traders: 4231,
    info: 'Recent hints from Elon about AI advancement',
    odds: { yes: 5.5, no: 1.6 },
    trend: '+32%',
    type: 'compact',
  },
  {
    id: '5',
    category: 'Cricket',
    title: 'India to win Test series against England?',
    traders: 8921,
    info: 'Current series score: IND 3 - 1 ENG',
    odds: { yes: 1.8, no: 4.5 },
    trend: '+8%',
    image:
      'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400&h=300&fit=crop',
    type: 'featured',
  },
  {
    id: '6',
    category: 'Politics',
    title: 'US Presidential Election 2024 Winner?',
    traders: 12543,
    info: 'Latest polls showing tight race',
    odds: { yes: 2.1, no: 3.8 },
    trend: '+45%',
    type: 'compact',
  },
]

const Home = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout, getUserCookie, isValidating } = useFrappeAuth()

  const [markets, setMarkets] = useState([])

  const {
    data: marketData,
    isLoading: marketDataLoading,
    error,
  } = useFrappeGetDocList('Market', {
    fields: ['name', 'question', 'yes_price', 'no_price'],
    filters: [['status', '=', 'OPEN']],
  })

  useEffect(() => {
    if (marketData?.length > 0 && !marketDataLoading) {
      setMarkets(marketData)
    }
  }, [marketData, marketDataLoading])

  useFrappeEventListener('market_event', (updatedMarket) => {
    console.log('Updated Market: ', updatedMarket)
    setMarkets(
      (prevMarkets) =>
        prevMarkets
          .map((market) =>
            market.name === updatedMarket.name
              ? { ...market, ...updatedMarket } // Update the market that changed
              : market
          )
          .filter((market) => market.status !== 'CLOSED') // Remove closed markets
    )
  })

  const handleMarketClick = (market) => {
    navigate(`/event/${market.name}`, { state: { market } })
  }

  const handleCategoryClick = (category) => {
    const categoryMarkets = trendingMarkets.filter(
      (market) => market.category.toLowerCase() === category.id
    )
    navigate(`/category/${category.id}`, {
      state: {
        category: category.name,
        markets: categoryMarkets,
      },
    })
  }

  return (
    <div className="pb-24">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="pt-safe-top">
          <div className="max-w-lg mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </button>
                <h1 className="text-xl font-semibold text-indigo-600">
                  GrowBro
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/wallet')}
                  className="wallet-balance"
                >
                  <WalletBalance balance={1234.56} />
                </button>
                <button
                  onClick={() => navigate('/notifications')}
                  className="p-2 hover:bg-gray-100 rounded-xl relative"
                >
                  <Bell className="h-5 w-5 text-gray-700" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="pt-[calc(env(safe-area-inset-top)+4rem)] max-w-lg mx-auto px-6">
        <div className="mb-8 mt-6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex-shrink-0 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-2xl mb-1">{category.icon}</span>
                  <span className="text-[10px] font-medium text-white/90">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=300&fit=crop"
            alt="IT20L"
            className="w-full h-40 object-cover"
          />
          <div className="absolute bottom-4 left-4 z-20 text-white">
            <h3 className="text-xl font-semibold mb-2">IT20 League 2024</h3>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse mr-2"></div>
              Events live at 7:30 PM today
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Trending Markets</h2>
            </div>
            {/* <button
              onClick={() => setShowAllMarkets(!showAllMarkets)}
              className="flex items-center text-sm text-indigo-600 font-medium"
            >
              {showAllMarkets ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </button> */}
          </div>

          <div className="space-y-4">
            {markets.map((market) => (
              <div
                key={market.name}
                className="market-card cursor-pointer"
                onClick={() => handleMarketClick(market)}
              >
                <>
                  {/* <div className="relative h-32">
                    <img
                      src={market.image}
                      alt={market.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-xs font-medium bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                          {market.category}
                        </span>
                        <span className="flex items-center text-xs font-medium bg-green-500/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                          <TrendingUp className="h-3 w-3 mr-1" /> {market.trend}
                        </span>
                      </div>
                    </div>
                  </div> */}

                  <div className="p-4">
                    <h3 className="text-base font-medium mb-2">
                      {market?.question}
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center text-xs text-gray-600">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {/* <span>{market.traders.toLocaleString()} traders</span> */}
                        <span>4000 traders</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                        <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse mr-1"></div>
                        LIVE
                      </span>
                    </div>
                    {/* <p className="text-xs text-gray-600 mb-4">{market.info}</p> */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="py-2 px-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium">
                        Yes ₹{market?.yes_price}
                      </div>
                      <div className="py-2 px-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium">
                        No ₹{market?.no_price}
                      </div>
                    </div>
                  </div>
                </>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SlideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  )
}

export default Home

// (
//   <div className="p-4">
//     <div className="flex items-center justify-between mb-2">
//       <div className="flex items-center gap-2">
//         <span className="px-2 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
//           {market.category}
//         </span>
//         <span className="flex items-center text-xs font-medium text-green-600">
//           <TrendingUp className="h-3 w-3 mr-1" /> {market.trend}
//         </span>
//       </div>
//       <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
//         <Zap className="h-3 w-3 mr-1" />
//         LIVE
//       </span>
//     </div>
//     <h3 className="text-sm font-medium mb-2">{market.title}</h3>
//     <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
//       <div className="flex items-center gap-3">
//         <span className="flex items-center">
//           <Users className="h-3.5 w-3.5 mr-1" />
//           {market.traders.toLocaleString()}
//         </span>
//         <span className="flex items-center">
//           <Timer className="h-3.5 w-3.5 mr-1" />
//           Ends in 2d
//         </span>
//       </div>
//     </div>
//     <div className="grid grid-cols-2 gap-2">
//       <div className="py-1.5 px-3 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
//         Yes ₹{market.odds.yes}
//       </div>
//       <div className="py-1.5 px-3 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium">
//         No ₹{market.odds.no}
//       </div>
//     </div>
//   </div>
// )
