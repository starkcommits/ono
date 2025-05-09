import React, { useEffect, useState } from 'react'
import { data, useNavigate } from 'react-router-dom'
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
  useFrappeEventListener,
  useFrappeAuth,
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappeGetCall,
  useFrappeDocTypeEventListener,
} from 'frappe-react-sdk'
const categoryIcons = {
  Sports: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-volleyball-icon lucide-volleyball"
    >
      <path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" />
      <path d="M12 12a12.6 12.6 0 0 1-8.7 5" />
      <path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" />
      <path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" />
      <path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  Politics: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-vote-icon lucide-vote"
    >
      <path d="m9 12 2 2 4-4" />
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <path d="M22 19H2" />
    </svg>
  ),
  Tech: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-cpu-icon lucide-cpu"
    >
      <path d="M12 20v2" />
      <path d="M12 2v2" />
      <path d="M17 20v2" />
      <path d="M17 2v2" />
      <path d="M2 12h2" />
      <path d="M2 17h2" />
      <path d="M2 7h2" />
      <path d="M20 12h2" />
      <path d="M20 17h2" />
      <path d="M20 7h2" />
      <path d="M7 20v2" />
      <path d="M7 2v2" />
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
  ),
  Teaching: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-notebook-icon lucide-notebook"
    >
      <path d="M2 6h4" />
      <path d="M2 10h4" />
      <path d="M2 14h4" />
      <path d="M2 18h4" />
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <path d="M16 2v20" />
    </svg>
  ),
  // Add more mappings here...
}

const Home = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentUser, logout } = useFrappeAuth()

  const [markets, setMarkets] = useState({})

  const { data: marketCategories, isLoading: marketCategoriesLoading } =
    useFrappeGetDocList('Market Category', {
      fields: ['name', 'category_name', 'category_image'],
      filters: [['is_active', '=', 1]],
    })

  const { data: marketingBanner, isLoading: marketingBannerLoading } =
    useFrappeGetDocList('Market Banner', {
      fields: ['name', 'image_url', 'home_position'],
      filters: [['home', '=', true]],
    })

  console.log('MArket Banner ', marketingBanner)

  console.log(marketCategories)

  const {
    data: marketData,
    isLoading: marketDataLoading,
    mutate: refetchMarketData,
  } = useFrappeGetDocList('Market', {
    fields: [
      'name',
      'question',
      'yes_price',
      'no_price',
      'closing_time',
      'status',
      'total_traders',
    ],
    filters: [['status', '=', 'OPEN']],
    orderBy: {
      field: 'total_traders',
      order: 'desc',
    },
    limit: 5,
  })

  const { data: userWallet, isLoading: userWalletLoading } = useFrappeGetDoc(
    'User Wallet',
    currentUser
  )

  useEffect(() => {
    if (!marketDataLoading && marketData?.length > 0) {
      const marketMap = marketData.reduce((acc, market) => {
        acc[market.name] = market // ✅ Store as { "market_name": marketData }
        return acc
      }, {})
      setMarkets(marketMap)
    }
  }, [marketData]) // Depend only on loading state

  console.log('Markets: ', markets)

  useFrappeEventListener('market_event', (updatedMarket) => {
    console.log('Updated Market:', updatedMarket)

    setMarkets((prevMarkets) => {
      const updatedMarkets = {
        ...prevMarkets,
        [updatedMarket.name]: updatedMarket,
      }

      // ❌ Remove market if it's closed
      if (updatedMarket.status === 'CLOSED') {
        delete updatedMarkets[updatedMarket.name]
      }

      return updatedMarkets
    })
  })

  const handleMarketClick = (market) => {
    navigate(`/event/${market.name}`)
  }

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`)
  }

  if (marketDataLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="spinner w-14 h-14 rounded-full border-4 border-gray-200 border-r-blue-500 animate-spin"></div>
      </div>
    )
  }
  return (
    <div className="">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="pt-safe-top">
          <div className="max-w-lg mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </button>
                <h1 className="text-xl font-semibold text-indigo-600">ONO</h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/wallet')}
                  className="wallet-balance"
                >
                  <WalletBalance balance={userWallet?.balance} />
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
        <div className=" mt-6">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
            {!marketCategoriesLoading &&
              marketCategories?.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.category_name)}
                  className="flex-shrink-0 group"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br rounded-2xl border border-neutral-600 shadow-sm flex flex-col items-center justify-center relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-2xl mb-1">
                      <img
                        src={`${category.category_image}`}
                        alt="Alt"
                        className=""
                      />
                    </span>
                    <span className="text-xs font-medium text-black/90">
                      {category.category_name}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <img
            src={
              marketingBanner?.find((item) => item.home_position === 1)
                ?.image_url
            }
            alt="IT20L"
            className="w-full h-40 object-cover"
          />
          {/* <div className="absolute bottom-4 left-4 z-20 text-white">
            <h3 className="text-xl font-semibold mb-2">IT20 League 2024</h3>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-sm">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse mr-2"></div>
              Events live at 7:30 PM today
            </div>
          </div> */}
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

          {marketDataLoading && (
            <div className="w-full h-screen flex justify-center items-center">
              <div className="spinner w-14 h-14 rounded-full border-4 border-gray-200 border-r-blue-500 animate-spin"></div>
            </div>
          )}

          {!marketDataLoading && (
            <div className="space-y-4">
              {Object.values(markets)
                .sort((a, b) => {
                  return b.total_traders - a.total_traders
                })
                .map((market) => (
                  <div
                    key={market.name}
                    className="market-card cursor-pointer"
                    onClick={() => handleMarketClick(market)} >
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
                            <span>{market?.total_traders} traders</span>
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
          )}
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
