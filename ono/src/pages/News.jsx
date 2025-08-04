import Back from '@/assets/Back.svg'
import News1 from '@/assets/News1.svg'
import BBCNews from '@/assets/BBCNews.svg'
import X from '@/assets/X.svg'
import News2 from '@/assets/News2.svg'
import VerifiedTick from '@/assets/VerifiedTick.svg'
import News3 from '@/assets/News3.svg'
import Reuters from '@/assets/Reuters.svg'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFrappeGetDocList } from 'frappe-react-sdk'

const News = () => {
  const navigate = useNavigate()

  const createAutoplayPlugin = (delay) =>
    Autoplay({
      delay: delay,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
    })

  const [currentNewsTab, setCurrentNewsTab] = useState('all')

  const bannerPlugin = useRef(createAutoplayPlugin(2000))

  const handleTabChange = (value) => {
    setCurrentNewsTab(value)
  }

  const { data: marketCategoryData } = useFrappeGetDocList('Market Category', {
    fields: ['name', 'category_image', 'image_url'],
    filters: [['is_active', '=', true]],
  })

  const allTabRef = useRef(null)
  const tabRefs = useRef({})
  const tabsContainerRef = useRef(null)

  useEffect(() => {
    if (marketCategoryData) {
      marketCategoryData.forEach((category) => {
        const key = category.name.toLowerCase()
        if (!tabRefs.current[key]) {
          tabRefs.current[key] = React.createRef()
        }
      })
    }
  }, [marketCategoryData])

  useEffect(() => {
    if (!currentNewsTab) return

    let selectedTab
    if (currentNewsTab === 'all') {
      selectedTab = allTabRef.current
    } else {
      selectedTab = tabRefs.current[currentNewsTab]?.current
    }

    const container = tabsContainerRef.current

    if (selectedTab && container) {
      selectedTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [currentNewsTab])

  return (
    <div className="bg-[#F5F5F5] select-none">
      <div className="h-12 z-[50] sticky top-0 select-none w-full p-4 border-b flex justify-between items-center gap-4 border-[#8D8D8D80]/50 max-w-md mx-auto bg-white">
        <div className="flex items-center gap-3">
          <img
            src={Back}
            alt=""
            className="cursor-pointer h-4 w-4"
            onClick={() => {
              navigate(-1)
            }}
          />
          <p className="font-[500] text-lg">News</p>
        </div>
      </div>
      <div className="py-4 flex flex-col gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center px-4">
            <p className="text-[16px] font-medium text-[#1A1A1A]">
              Trending News
            </p>
            <p className="font-normal text-[16px] text-[#999999]">See all</p>
          </div>
          <div className="w-full relative z-[10] min-h-[87px] flex items-center gap-4 px-4">
            <Carousel className="w-full" plugins={[bannerPlugin.current]}>
              <CarouselContent>
                <CarouselItem key="news-1" className="basis-[80%]">
                  <div className="flex flex-col gap-2 p-2 bg-white rounded-[10px]">
                    <div className="p-1 w-full">
                      <img
                        src={News1}
                        alt=""
                        className="w-full"
                        loading="eager"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[18px] leading-[24px]">
                        Bitcoin News Today: Bitcoin drops below $116,000 as Fed
                        meeting
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div>
                          <img src={BBCNews} alt="" />
                        </div>
                        <p className="font-normal text-[16px] text-[#999999]">
                          BBC News
                        </p>
                      </div>
                      <div>
                        <p className="text-[16px] text-[#999999] font-normal">
                          Jun 9, 2023
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
                <CarouselItem key="news-2" className="basis-[80%]">
                  <div className="flex flex-col gap-2 p-2 bg-white rounded-[10px]">
                    <div className="p-1 w-full">
                      <img
                        src={News1}
                        alt=""
                        className="w-full"
                        loading="eager"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[18px] leading-[24px]">
                        Bitcoin News Today: Bitcoin drops below $116,000 as Fed
                        meeting
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <div>
                          <img src={BBCNews} alt="" />
                        </div>
                        <p className="font-normal text-[16px] text-[#999999]">
                          BBC News
                        </p>
                      </div>
                      <div>
                        <p className="text-[16px] text-[#999999] font-normal">
                          Jun 9, 2023
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center px-4">
            <p className="text-[16px] font-medium text-[#1A1A1A]">Categories</p>
          </div>
          <div className={`bg-[#F5F5F5]`}>
            <div
              className="w-full overflow-x-auto scrollbar-hide"
              ref={tabsContainerRef}
            >
              <Tabs
                className="w-full py-2 font-[500] text-xs"
                value={currentNewsTab}
                onValueChange={handleTabChange}
              >
                <div className="bg-[#F5F5F5]">
                  <TabsList className="flex flex-nowrap w-max rounded-full space-x-2 bg-[#F5F5F5] text-[#2C2D32] p-0 h-6 pl-4 pr-4">
                    <TabsTrigger
                      key="all"
                      value="all"
                      ref={allTabRef}
                      className={`flex items-center flex-shrink-0 px-5 py-1.5 space-x-2 rounded-full border-[0.5px] border-[#CBCBCB] bg-white data-[state=active]:border-[0.7px] data-[state=active]:border-[#5F5F5F] text-sm text-[#5F5F5F] font-normal h-auto`}
                    >
                      <span className="whitespace-nowrap capitalize">All</span>
                      {currentNewsTab === 'all' && <img src={X} alt="Close" />}
                    </TabsTrigger>
                    {marketCategoryData?.map((category) => {
                      const name = category.name.toLowerCase()
                      return (
                        <TabsTrigger
                          key={name}
                          value={name}
                          ref={tabRefs.current[name]}
                          className={`flex items-center flex-shrink-0 px-5 py-1.5 space-x-2 rounded-full border-[0.5px] border-[#CBCBCB] bg-white data-[state=active]:border-[0.7px] data-[state=active]:border-[#5F5F5F] text-sm text-[#5F5F5F] font-normal h-auto`}
                        >
                          <span className="whitespace-nowrap capitalize">
                            {category.name}
                          </span>
                          {currentNewsTab === name && (
                            <img src={X} alt="Close" />
                          )}
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                </div>
              </Tabs>
            </div>
          </div>
          <div className="flex flex-col gap-6 px-4 py-2">
            <div className="w-full flex items-start gap-4 h-[110px]">
              <div className="w-[30%] h-full">
                <img className="object-cover h-full" src={News2} alt="" />
              </div>
              <div className="w-[70%] flex flex-col justify-between h-full">
                <div>
                  <p className="font-semibold text-[16px] leading-[24px]">
                    Lionesses welcomed home by jubilant fans after Euro 2025 win
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <img src={BBCNews} alt="" />
                    </div>
                    <p className="font-normal text-[16px] text-[#999999]">
                      BBC News
                    </p>
                    <div>
                      <img src={VerifiedTick} alt="" />
                    </div>
                  </div>
                  <div>
                    <p className="font-normal text-[16px] text-[#999999]">
                      Jun 9, 2023
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex items-start gap-4 h-[110px]">
              <div className="w-[30%] h-full">
                <img className="object-cover h-full" src={News3} alt="" />
              </div>
              <div className="w-[70%] flex flex-col justify-between h-full">
                <div>
                  <p className="font-semibold text-[16px] leading-[24px]">
                    Indian stocks linger around 6-week low on trade deal
                    jitters, foreign outflows
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <img src={Reuters} alt="" />
                    </div>
                    <p className="font-normal text-[16px] text-[#999999]">
                      Reuters
                    </p>
                    <div>
                      <img src={VerifiedTick} alt="" />
                    </div>
                  </div>
                  <div>
                    <p className="font-normal text-[16px] text-[#999999]">
                      Jun 9, 2023
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News
