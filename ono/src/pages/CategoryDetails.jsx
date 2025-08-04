import BackWhite from '@/assets/BackWhite.svg'
import WalletWhite from '@/assets/WalletWhite.svg'
import Leaderboard from '@/assets/Leaderboard.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetDoc,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import CircularProgress from '../components/CircularProgress'
import CricketImage from '@/assets/CricketImage.svg'
import Crypto from '@/assets/Crypto.svg'
import BuyDrawer from '../components/BuyDrawer'

const CategoryDetails = () => {
  const navigate = useNavigate()

  const { id } = useParams()

  const { currentUser } = useFrappeAuth()

  const [accordionValue, setAccordionValue] = useState('')

  const { data: userWalletData } = useFrappeGetDoc(
    'User Wallet',
    currentUser,
    currentUser ? undefined : null
  )

  console.log(userWalletData)

  const { data: marketFixturesData } = useFrappeGetDocList('Market Fixtures', {
    fields: ['*'],
    filters: [['category', '=', id]],
  })

  console.log(marketFixturesData)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [markets, setMarkets] = useState([])
  const [selectedChoice, setSelectedChoice] = useState('')
  const [marketId, setMarketId] = useState('')

  const { data: marketData, isLoading: marketDataLoading } =
    useFrappeGetDocList(
      'Market',
      {
        fields: [
          'name',
          'question',
          'category',
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
      },
      'market_data'
    )
  useEffect(() => {
    if (!marketDataLoading && marketData?.length > 0) {
      const marketMap = marketData.reduce((acc, market) => {
        acc[market.name] = market // ✅ Store as { "market_name": marketData }
        return acc
      }, {})
      setMarkets(marketMap)
    }
  }, [marketData])

  useFrappeEventListener('market_event', (updatedMarket) => {
    console.log('Updated Market:', updatedMarket)

    setMarkets((prevMarkets) => {
      const updatedMarkets = {
        ...prevMarkets,
        [updatedMarket.name]: updatedMarket,
      }

      // Remove market if it's closed
      if (updatedMarket.status === 'CLOSED') {
        delete updatedMarkets[updatedMarket.name]
      }

      return updatedMarkets
    })
  })

  const handleMarketClick = (market_id) => {
    navigate(`/event/${market_id}`)
  }
  const handleFixtureClick = (fixture_id) => {
    navigate(`/fixture/${fixture_id}`)
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen select-none">
      <div className="sticky top-0 select-none w-full max-w-md mx-auto z-[50]">
        <div className="flex flex-col bg-[#2C2D32]">
          <div className="p-4 flex border-b border-gray-500 justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={BackWhite}
                alt=""
                className="cursor-pointer h-4 w-4 text-white"
                onClick={() => {
                  navigate(-1)
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div>
                  <img src={WalletWhite} alt="" />
                </div>
                <p className="font-inter text-[13px] font-medium text-white">
                  &#8377; {userWalletData?.balance}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 flex items-center gap-2">
            <div>
              <img src={Leaderboard} alt="" />
            </div>
            <p className="font-inter text-xs font-normal text-white">
              0.3M/12.3M
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="font-medium text-sm text-black">
          Trending in this category
        </p>
        <div className="overflow-x-auto flex gap-4 pt-4 scrollbar-hide">
          {marketFixturesData?.map((fixture) => {
            return (
              <div
                key={fixture.name}
                onClick={() => {
                  handleFixtureClick(fixture.name)
                }}
                className="cursor-pointer flex gap-2 bg-white p-2 rounded-[8px] flex-shrink-0 min-w-min"
              >
                <div>
                  <img src={fixture.image} alt="" />
                </div>
                <div className="flex flex-col">
                  <p className="font-normal text-[10px] text-[#606060]">
                    {fixture.category}
                  </p>
                  <p className="font-semibold text-[10px] text-[#272727]">
                    {fixture.title}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="w-full">
        <p className="px-4 pt-2 font-medium text-sm text-black">
          Trending Markets
        </p>
        <div className="flex flex-col gap-4 p-4">
          {Object.values(markets)
            .sort((a, b) => {
              return b.total_traders - a.total_traders
            })
            .map((market) => (
              <div
                key={market.name}
                onClick={() => {
                  handleMarketClick(market.name)
                }}
                className="relative rounded-[10px] p-4 bg-white space-y-3 shadow-[0_1px_1px_0_rgba(0,0,0,0.25)] cursor-pointer"
              >
                <div className="flex w-full">
                  <div className="bg-[#1C895E] rounded-[20px] py-[4px] px-[12px] flex justify-center items-center">
                    <span className="font-medium text-[10px] text-white tracking-[6%] capitalize">
                      LIVE
                    </span>
                  </div>
                  <CircularProgress percentage={market.yes_price * 10} />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-4 items-start">
                    <div className="w-[20%]">
                      <img src={CricketImage} alt="" />
                    </div>
                    <div className="flex flex-col gap-2 w-[70%]">
                      <h3 className="font-normal text-sm leading-[20px] text-[#181818]">
                        {market.question}
                      </h3>
                      <p className="font-medium text-[10px] leading-[100%] text-[#606060]">
                        H2H last 5 T20: New Zealand 4, Pak 1
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center w-full">
                    <button
                      className="bg-[#EFF0FF] rounded-[6px] text-center font-inter text-[#0819D4] font-medium text-[13px] leading-[100%] w-[50%] py-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedChoice('YES')
                        setMarketId(market.name)
                        setIsDrawerOpen(true)
                      }}
                    >
                      YES &#8377;{market.yes_price.toFixed(1)}
                    </button>
                    <button
                      className="bg-[#FFEBEB] rounded-[6px] text-center font-inter text-[#FF1A1A] font-medium text-[13px] leading-[100%] w-[50%] py-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedChoice('NO')
                        setMarketId(market.name)
                        setIsDrawerOpen(true)
                      }}
                    >
                      NO &#8377;{market.no_price.toFixed(1)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {isDrawerOpen && (
          <BuyDrawer
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            selectedChoice={selectedChoice}
            setSelectedChoice={setSelectedChoice}
            marketId={marketId}
          />
        )}
      </div>
    </div>
  )
}

export default CategoryDetails
