import React, { useEffect, useRef, useState } from 'react'
import Back from '@/assets/Back.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import X from '@/assets/X.svg'
import { useNavigate } from 'react-router-dom'
import CricketBall from '@/assets/CricketBall.svg'
import BreakingNews from '@/assets/BreakingNews.svg'
import { useFrappeGetDocList } from 'frappe-react-sdk'

const Topics = () => {
  const navigate = useNavigate()
  const [topicTab, setTopicTab] = useState(
    localStorage.getItem('topicTab') || 'all'
  )

  const { data: marketCategoryData } = useFrappeGetDocList('Market Category', {
    fields: ['name', 'category_image', 'image_url'],
    filters: [['is_active', '=', true]],
  })

  const { data: marketFixtureData, isLoading: marketFixtureDataLoading } =
    useFrappeGetDocList('Market Fixtures', {
      fields: ['name', 'title', 'category', 'image'],
      filters: topicTab === 'all' ? [] : [['category', '=', topicTab]],
    })

  console.log('Cateogry ', marketCategoryData)

  const handleTabChange = (value) => {
    localStorage.setItem('topicTab', value)
    setTopicTab(value)
  }

  console.log(topicTab)

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
    if (!topicTab) return

    let selectedTab
    if (topicTab === 'all') {
      selectedTab = allTabRef.current
    } else {
      selectedTab = tabRefs.current[topicTab]?.current
    }

    const container = tabsContainerRef.current

    if (selectedTab && container) {
      selectedTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [topicTab])

  return (
    <div className="bg-[#F5F5F5] min-h-screen select-none w-full">
      <div className="sticky top-0 select-none w-full flex flex-col max-w-md mx-auto">
        <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-[#8D8D8D80]/50">
          <div>
            <img
              src={Back}
              alt=""
              className="cursor-pointer h-4 w-4"
              onClick={() => {
                navigate(-1)
              }}
            />
          </div>
          <p className="font-[500] text-xl leading-[100%] text-[#2C2D32]">
            Topics
          </p>
        </div>

        <div className="bg-[#F5F5F5] py-4">
          <div
            className="w-full overflow-x-auto scrollbar-hide "
            ref={tabsContainerRef}
          >
            <Tabs
              className="w-full font-[500] text-xs rounded-none"
              value={topicTab}
              onValueChange={handleTabChange}
            >
              <div className="bg-[#F5F5F5]">
                <TabsList className="flex flex-nowrap bg-[#F5F5F5] space-x-2 text-[#2C2D32] w-max h-auto p-0 px-4">
                  <TabsTrigger
                    key="all"
                    value="all"
                    ref={allTabRef}
                    className={`flex items-center flex-shrink-0 px-5 py-1.5 space-x-2 rounded-full border-[0.5px] border-[#CBCBCB] bg-white data-[state=active]:border-[0.7px] data-[state=active]:border-[#5F5F5F] text-sm text-[#5F5F5F] font-normal h-auto`}
                  >
                    <span className="whitespace-nowrap capitalize">All</span>
                    {topicTab === 'all' && <img src={X} alt="Close" />}
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
                        {topicTab === name && <img src={X} alt="Close" />}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {!marketFixtureDataLoading && marketFixtureData?.length === 0 && (
        <div className="flex flex-col gap-1 items-center pt-12">
          <p className="text-gray-600 text-sm">
            No markets have been scheduled yet.
          </p>
          <p className="text-neutral-400 text-xs">
            Please check back later or try a different category.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 px-4 w-full">
        {marketFixtureData?.map((fixture) => (
          <div
            className="flex justify-between p-2.5 bg-white rounded-[5px] cursor-pointer"
            onClick={() => {
              navigate(`/fixture/${fixture.name}`)
            }}
          >
            <div className="flex flex-col w-[60%]">
              <p className="text-[10px] font-normal text-[#606060]">
                {fixture.title}
              </p>
              <p className="font-semibold text-[10px] text-[#272727]">
                {fixture.category}
              </p>
            </div>
            <div className="w-[40%] flex justify-end items-end mt-2">
              <img src={fixture.image} alt="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Topics
