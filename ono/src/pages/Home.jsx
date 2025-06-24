import CricketIcon from '@/assets/Cricket.svg'
import CricketImage from '@/assets/CricketImage.svg'
import Squircle from '@/assets/Squircle.png'
import TradersIcon from '@/assets/Traders.svg'
import LiveDotIcon from '@/assets/Live.svg'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef, useState } from 'react'
import { Marquee } from '../components/ui/marquee'
import BuyDrawer from '../components/BuyDrawer'
import {
  useFrappeEventListener,
  useFrappeGetCall,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import { Users } from 'lucide-react'
import scrollbarHide from 'tailwind-scrollbar-hide'
import { Navigate, useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [markets, setMarkets] = useState({})
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
      ['market_data']
    )

  const { data: marketFixturesData, isLoading: marketFixturesDataLoading } =
    useFrappeGetDocList('Market Fixtures', {
      fields: ['name', 'title', 'category', 'image'],
    })

  const fixtures = marketFixturesData || []
  const total = fixtures.length
  const showRows = total <= 5 ? 1 : total <= 10 ? 2 : 3

  console.log('Market Fixtures:', marketFixturesData)

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

  const createAutoplayPlugin = (delay) =>
    Autoplay({
      delay: delay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })

  const { data: marketCategoryData, isLoading: marketCategoryLoading } =
    useFrappeGetDocList('Market Category', {
      fields: ['*'],
    })

  // console.log('categoryData:', marketCategoryData)
  const { data: marketingBannerData, isLoading: marketingBannerDataLoading } =
    useFrappeGetDocList('Market Banner', {
      fields: ['*'],
      filters: [['home', '=', true]],
    })

  console.log('Market Category Data:', marketingBannerData)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState()

  const bannerPlugin = useRef(createAutoplayPlugin(2000))
  const trending1 = useRef(createAutoplayPlugin(1500))
  const trending2 = useRef(createAutoplayPlugin(2500))
  const trending3 = useRef(createAutoplayPlugin(3000))

  const handleMarketClick = (market_id) => {
    navigate(`/event/${market_id}`)
  }

  return (
    <div className=" bg-[#F5F5F5]">
      <div className="flex flex-col gap-6 mx-auto max-w-md py-4 px-4">
        {/* Categories */}
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-sm leading-[100%]">Categories</h2>
          <div className="w-full grid grid-cols-4 gap-y-2 font-normal text-[10px] leading-[100%] overflow-hidden">
            {marketCategoryData?.map((category, index) => (
              // <div
              //   className="relative h-[90px] flex justify-center items-center"
              //   key={index}
              // >
              //   <div className="absolute z-0 top-2">
              //     <img src={Squircle} alt="" />
              //   </div>
              //   <div
              //     key={index}
              //     className="bg-[url()] z-10 top-0.5 flex flex-col gap-2 justify-center items-center px-4 py-[7px] border-none border-transparent bg-transparent"
              //   >
              //     <img
              //       src={category.category_image}
              //       alt=""
              //       className="h-[30px] w-[30px]"
              //     />
              //     <p className="">{category.name}</p>
              //   </div>
              // </div>

              <div
                key={index}
                style={{
                  backgroundImage: `url(${Squircle})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '80px 75px',
                  backgroundPosition: 'center',
                }}
                className="relative w-[80px] h-[75px] justify-center items-start px-4 border-white"
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-2.5">
                  <div className="flex justify-center">
                    <img
                      src={category.category_image}
                      alt=""
                      className="h-[30px] w-[30px]"
                    />
                  </div>

                  <p className="">{category.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full relative z-[1] min-h-[70px]">
            <Carousel className="w-full" plugins={[bannerPlugin.current]}>
              <CarouselContent>
                {marketingBannerData?.slice(0, 4)?.map((_, index) => (
                  <CarouselItem key={_?.name} className="basis-[80%]">
                    <div className="p-1 w-full">
                      <img src={_?.image} alt="" className="w-full" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        {/* Trending Fixtures */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <span className="font-medium text-sm">Trending</span>
              <div className="flex items-center gap-1">
                <Label
                  htmlFor="live"
                  className="text-xs font-medium text-[#606060]"
                >
                  Live
                </Label>
                <Switch id="live" />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-medium text-xs">See All &gt;</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {total > 0 && (
              <div className=" overflow-hidden">
                <Marquee pauseOnHover className="[--duration:25s] p-0 py-0.5">
                  {marketFixturesData
                    ?.slice(0, Math.ceil(total / showRows))
                    ?.map((_, index) => (
                      <Card
                        key={_.name}
                        className="rounded-[8px] shadow-[0_0_1px_0_rgba(0,0,0,0.2)]"
                      >
                        <CardHeader className="p-2">
                          <div className="flex gap-2.5">
                            <div className="">
                              <img
                                src={_.image}
                                alt=""
                                height={30}
                                width={30}
                              />
                            </div>
                            <div className="">
                              <CardTitle className="font-normal text-[10px] text-[#606060]">
                                {_.category}
                              </CardTitle>
                              <CardDescription className="font-semibold text-[10px] text-[#272727]">
                                {_.title}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </Marquee>
              </div>
            )}
            {total > 5 && (
              <div className="overflow-hidden">
                <Marquee
                  pauseOnHover
                  reverse
                  className="[--duration:30s] p-0 py-0.5"
                >
                  {marketFixturesData
                    ?.slice(
                      Math.ceil(total / showRows),
                      Math.ceil(total / showRows) * 2
                    )
                    ?.map((_, index) => (
                      <Card
                        key={_.name}
                        className="rounded-[8px] shadow-[0_0_1px_0_rgba(0,0,0,0.2)]"
                      >
                        <CardHeader className="p-2">
                          <div className="flex gap-2.5">
                            <div className="">
                              <img
                                src={_.image}
                                alt=""
                                height={30}
                                width={30}
                              />
                            </div>
                            <div className="">
                              <CardTitle className="font-normal text-[10px] text-[#606060]">
                                {_.category}
                              </CardTitle>
                              <CardDescription className="font-semibold text-[10px] text-[#272727]">
                                {_.title}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </Marquee>
              </div>
            )}
            {total > 10 && (
              <div className="overflow-hidden">
                <Marquee pauseOnHover className="[--duration:40s] p-0 py-0.5">
                  {marketFixturesData
                    ?.slice(Math.ceil(total / showRows) * 2)
                    ?.map((_, index) => (
                      <Card
                        key={_.index}
                        className="rounded-[8px] shadow-[0_0_1px_0_rgba(0,0,0,0.2)]"
                      >
                        <CardHeader className="p-2">
                          <div className="flex gap-2.5">
                            <div className="">
                              <img
                                src={_.image}
                                alt=""
                                height={30}
                                width={30}
                              />
                            </div>
                            <div className="">
                              <CardTitle className="font-normal text-[10px] text-[#606060]">
                                {_.category}
                              </CardTitle>
                              <CardDescription className="font-semibold text-[10px] text-[#272727]">
                                {_.title}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </Marquee>
              </div>
            )}
          </div>
        </div>
        {/* Trending Market */}
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="font-medium text-sm">Trending Market</h2>
          </div>
          <div className="flex flex-col gap-2">
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
                  className="rounded-[10px] p-4 bg-white space-y-4 shadow-[0_1px_1px_0_rgba(0,0,0,0.25)] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="border-[0.5px] rounded-[5px] px-1.5 bg-[#EEEEEE] text-[#606060] font-medium text-[8px] tracking-[2%] border-[#8D8D8D]">
                      {market.category}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <span>
                        <img src={TradersIcon} alt="" />
                      </span>
                      <span className="font-normal text-[8px] text-[#606060]">
                        {market.total_traders}
                      </span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <span>
                        <img src={LiveDotIcon} alt="" />
                      </span>
                      <span className="font-medium text-[8px] leading-[100%] text-[#606060]">
                        Live
                      </span>
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-[20%]">
                      <img src={CricketImage} alt="" />
                    </div>
                    <div className="flex flex-col gap-2 w-[70%]">
                      <h3 className="font-normal text-sm leading-[100%] text-[#181818]">
                        {market.question}
                      </h3>
                      <p className="font-medium text-[10px] leading-[100%] text-[#606060]">
                        H2H last 5 T20: New Zealand 4, Pak 1
                      </p>
                      <div className="flex gap-2 items-center w-full">
                        <button
                          className="bg-[#492C82] rounded-[6px] text-center text-white font-light text-[13px] leading-[100%] w-[50%] py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedChoice('YES')
                            setMarketId(market.name)
                            setIsDrawerOpen(true)
                          }}
                        >
                          YES &#8377;{market.yes_price}
                        </button>
                        <button
                          className="bg-[#E8685A] rounded-[6px] text-center text-white font-light text-[13px] leading-[100%] w-[50%] py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedChoice('NO')
                            setMarketId(market.name)
                            setIsDrawerOpen(true)
                          }}
                        >
                          NO &#8377;{market.no_price}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
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

export default Home
