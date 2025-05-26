import CricketIcon from '@/assets/Cricket.svg'
import CricketImage from '@/assets/CricketImage.svg'
import Banner from '@/assets/Banner.svg'
import HamburgerIcon from '@/assets/HamburgerHeader.svg'
import WalletIcon from '@/assets/WalletHeader.svg'
import BellIcon from '@/assets/BellHeader.svg'
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
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { Users } from 'lucide-react'
import scrollbarHide from 'tailwind-scrollbar-hide'

const Home = () => {
  const [markets, setMarkets] = useState({})
  const [marketId, setMarketId] = useState('')
  const {
    data: marketData,
    isLoading: marketDataLoading,
    mutate: refetchMarketData,
  } = useFrappeGetDocList('Market', {
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
  })

  useEffect(() => {
    if (!marketDataLoading && marketData?.length > 0) {
      const marketMap = marketData.reduce((acc, market) => {
        acc[market.name] = market // ✅ Store as { "market_name": marketData }
        return acc
      }, {})
      setMarkets(marketMap)
    }
  }, [marketData])

  const createAutoplayPlugin = (delay) =>
    Autoplay({
      delay: delay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState()

  const bannerPlugin = useRef(createAutoplayPlugin(2000))
  const trending1 = useRef(createAutoplayPlugin(1500))
  const trending2 = useRef(createAutoplayPlugin(2500))
  const trending3 = useRef(createAutoplayPlugin(3000))

  return (
    <div className=" bg-[#F5F5F5] min-h-screen">
      <div className="select-none w-full p-4 border-b flex justify-between items-center gap-4 border-[#8D8D8D80]/50 sticky z-[50] top-0 left-0 right-0 max-w-md mx-auto bg-white">
        <div className="flex items-center gap-2.5">
          <img src={HamburgerIcon} alt="" className="" />
          <span className="text-[#E26F64] text-lg">ONO</span>
        </div>

        <div className="flex gap-2.5 items-center">
          <div className="rounded-[20px] px-[11px] py-1.5 flex gap-2.5 border">
            <img src={WalletIcon} alt="" />
            <span className="text-md">&#8377;1,250.56</span>
          </div>
          <div>
            <img src={BellIcon} alt="" />
          </div>
        </div>
      </div>
      <div className="px-4 pb-32 pt-1.5">
        <div className="flex flex-col gap-6 mx-auto max-w-md py-2">
          {/* Categories */}
          <div className="flex flex-col gap-4">
            <h2 className="font-medium text-sm leading-[100%]">Categories</h2>
            <div className="w-full grid grid-cols-4 gap-1 font-normal text-[10px] leading-[100%] overflow-hidden">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="relative h-[90px]" key={index}>
                  <div className="absolute z-0 top-2">
                    <svg
                      width="83"
                      height="79"
                      viewBox="0 0 83 79"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g filter="url(#filter0_d_989_2046)">
                        <path
                          d="M80.6374 51.9979C80.4122 55.8596 80.083 59.7213 79.6498 63.5831C79.3003 66.6872 77.8413 69.5842 75.5158 71.7916C73.1903 73.9991 70.1384 75.384 66.8683 75.7159C50.0025 77.428 32.9925 77.428 16.1267 75.7159C12.8565 75.384 9.80469 73.9991 7.47917 71.7916C5.15364 69.5842 3.69468 66.6872 3.34511 63.5831C2.90849 59.7246 2.57929 55.8629 2.35752 51.9979C1.87411 43.6723 1.87411 35.3277 2.35752 27.0021C2.57929 23.1404 2.90849 19.2787 3.34511 15.4169C3.69468 12.3128 5.15364 9.41585 7.47917 7.20835C9.80469 5.00086 12.8565 3.61596 16.1267 3.28414C32.9925 1.57195 50.0025 1.57195 66.8683 3.28414C70.1384 3.61596 73.1903 5.00086 75.5158 7.20835C77.8413 9.41585 79.3003 12.3128 79.6498 15.4169C80.0865 19.2754 80.4157 23.1371 80.6374 27.0021C81.1208 35.3277 81.1208 43.6723 80.6374 51.9979Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_989_2046"
                          x="-0.0050354"
                          y="0"
                          width="83.005"
                          height="79"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset />
                          <feGaussianBlur stdDeviation="1" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_989_2046"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_989_2046"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                  <div
                    key={index}
                    className="absolute z-10 top-4 left-2 flex flex-col gap-2 justify-center items-center px-4 py-[7px] border-none border-transparent bg-transparent"
                  >
                    <img
                      src={CricketIcon}
                      alt=""
                      className="h-[30px] w-[30px]"
                    />
                    <p className="">Cricket</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full relative z-[1] ">
              <Carousel className="w-full" plugins={[bannerPlugin.current]}>
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-3/4">
                      <div className="p-1 w-full">
                        <img src={Banner} alt="" className="w-full" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>

          {/* Trending */}
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
              <div className="overflow-hidden">
                <Marquee pauseOnHover className="[--duration:25s] p-0">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Card
                      key={index}
                      className="rounded-[8px] shadow-[0_0_1px_0_rgba(0,0,0,0.2)]"
                    >
                      <CardHeader className="p-2">
                        <div className="flex gap-[7px]">
                          <div className="">
                            <img
                              src={CricketIcon}
                              alt=""
                              height={30}
                              width={30}
                            />
                          </div>
                          <div className="">
                            <CardTitle className="font-normal text-[10px] text-[#606060]">
                              Cricket
                            </CardTitle>
                            <CardDescription className="font-semibold text-[10px] text-[#272727]">
                              Mumbai V/S Bengaluru
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </Marquee>
              </div>
              <div className="overflow-hidden">
                <Marquee pauseOnHover reverse className="[--duration:30s] p-0">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Card
                      key={index}
                      className="rounded-[8px] shadow-[0_0_1px_0_rgba(0,0,0,0.2)]"
                    >
                      <CardHeader className="p-2">
                        <div className="flex gap-[7px]">
                          <div className="">
                            <img
                              src={CricketIcon}
                              alt=""
                              height={30}
                              width={30}
                            />
                          </div>
                          <div className="">
                            <CardTitle className="font-normal text-[10px] text-[#606060]">
                              Cricket
                            </CardTitle>
                            <CardDescription className="font-semibold text-[10px] text-[#272727]">
                              Mumbai V/S Bengaluru
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </Marquee>
              </div>
              <div className="overflow-hidden">
                <Marquee pauseOnHover className="[--duration:40s] p-0">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Card
                      key={index}
                      className="rounded-[8px] shadow-[0_0_1px_0_rgba(0,0,0,0.2)]"
                    >
                      <CardHeader className="p-2">
                        <div className="flex gap-[7px]">
                          <div className="">
                            <img
                              src={CricketIcon}
                              alt=""
                              height={30}
                              width={30}
                            />
                          </div>
                          <div className="">
                            <CardTitle className="font-normal text-[10px] text-[#606060]">
                              Cricket
                            </CardTitle>
                            <CardDescription className="font-semibold text-[10px] text-[#272727]">
                              Mumbai V/S Bengaluru
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </Marquee>
              </div>
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
                    className="rounded-[10px] p-4 bg-white space-y-4 shadow-[0_1px_1px_0_rgba(0,0,0,0.25)]"
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
                            className="bg-[#1795FE] rounded-[6px] text-center text-white font-light text-[13px] leading-[100%] w-[50%] py-2"
                            onClick={() => {
                              setSelectedChoice('YES')
                              setMarketId(market.name)
                              setIsDrawerOpen(true)
                            }}
                          >
                            YES &#8377;{market.yes_price}
                          </button>
                          <button
                            className="bg-[#E8685A] rounded-[6px] text-center text-white font-light text-[13px] leading-[100%] w-[50%] py-2"
                            onClick={() => {
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
              choice={selectedChoice}
              setChoice={setSelectedChoice}
              marketId={marketId}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
