import { useFrappeEventListener, useFrappeGetDocList } from 'frappe-react-sdk'
import { useEffect, useState } from 'react'
import CricketImage from '@/assets/CricketImage.svg'
import CircularProgress from './CircularProgress'
import BuyDrawer from './BuyDrawer'
import { useNavigate } from 'react-router-dom'
import { MarketEventListener } from './MarketEventListener'

const FixtureMarkets = () => {
  const navigate = useNavigate()
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

  useEffect(() => {
    const id = 'fixture-market'

    MarketEventListener.subscribe(id, (updatedMarket) => {
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

    return () => {
      MarketEventListener.unsubscribe(id)
    }
  }, [])

  const handleMarketClick = (market_id) => {
    navigate(`/event/${market_id}`)
  }

  return (
    <div className="w-full">
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
                <div className="bg-[#34C380] rounded-[20px] py-[2px] px-[12px] flex justify-center items-center">
                  <span className="font-medium text-[8px] text-white tracking-[6%] capitalize">
                    NEW
                  </span>
                </div>
                <CircularProgress percentage={market.yes_price * 10} />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-4 items-start">
                  <div className="w-[20%]">
                    <img src={CricketImage} alt="" />
                  </div>
                  <div className="flex flex-col gap-2 w-[60%]">
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
  )
}

export default FixtureMarkets
