import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import SearchMagnifier from '@/assets/SearchMagnifier.svg'
import { useFrappeGetDocList } from 'frappe-react-sdk'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import X from '@/assets/X.svg'
import CricketBall from '@/assets/CricketBall.svg'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const navigate = useNavigate()
  const [searchCategoryTab, setSearchCategoryTab] = useState(
    localStorage.getItem('searchCategoryTab') || 'all'
  )
  const { data: marketCategoryData } = useFrappeGetDocList('Market Category', {
    fields: ['name', 'category_image', 'image_url'],
    filters: [['is_active', '=', true]],
  })

  const { data: marketFixtureData } = useFrappeGetDocList('Market Fixtures', {
    fields: ['name', 'title', 'category', 'image'],
    filters:
      searchCategoryTab === 'all' ? [] : [['category', '=', searchCategoryTab]],
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

  const handleTabChange = (value) => {
    localStorage.setItem('searchCategoryTab', value)
    setSearchCategoryTab(value)
  }

  useEffect(() => {
    if (!searchCategoryTab) return

    let selectedTab
    if (searchCategoryTab === 'all') {
      selectedTab = allTabRef.current
    } else {
      selectedTab = tabRefs.current[searchCategoryTab]?.current
    }

    const container = tabsContainerRef.current

    if (selectedTab && container) {
      selectedTab.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [searchCategoryTab])

  return (
    <div className="bg-[#F5F5F5] select-none">
      <div className="w-full sticky top-0 z-[50] max-w-md mx-auto bg-[#F5F5F5]">
        <div className=" p-4">
          <div className="relative">
            <img
              src={SearchMagnifier}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
            />
            <Input
              type="search"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-full rounded-full border border-[#D9D9D9] bg-white focus:outline-none focus:ring-ring focus:ring-2 focus:ring-[#757575] focus:border-transparent"
            />
          </div>
        </div>
      </div>
      <div className="bg-[#EAEAEA] py-4">
        <div className="flex flex-col gap-4 ">
          <div className="px-4">
            <h2 className="text-sm text-black font-medium">Categories</h2>
          </div>
          <div
            className="w-full overflow-x-auto scrollbar-hide "
            ref={tabsContainerRef}
          >
            <Tabs
              className="w-full font-[500] text-xs rounded-none"
              value={searchCategoryTab}
              onValueChange={handleTabChange}
            >
              <div className="bg-transparent">
                <TabsList className="flex flex-nowrap bg-transparent space-x-2 text-[#2C2D32] w-max h-auto p-0 px-4">
                  <TabsTrigger
                    key="all"
                    value="all"
                    ref={allTabRef}
                    className={`flex items-center flex-shrink-0 px-5 py-1.5 space-x-2 rounded-full border-[0.5px] border-[#CBCBCB] bg-white data-[state=active]:border-[0.7px] data-[state=active]:border-[#5F5F5F] text-sm text-[#5F5F5F] font-normal h-auto`}
                  >
                    <span className="whitespace-nowrap capitalize">All</span>
                    {searchCategoryTab === 'all' && <img src={X} alt="Close" />}
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
                        {searchCategoryTab === name && (
                          <img src={X} alt="Close" />
                        )}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>
            </Tabs>
          </div>
          <div className="grid grid-cols-2 gap-2.5 px-4 w-full">
            {marketFixtureData?.map((fixture) => (
              <div
                className="flex items-center gap-2 p-2.5 bg-white rounded-[5px] cursor-pointer"
                onClick={() => {
                  navigate(`/fixture/${fixture.name}`)
                }}
              >
                <div className="">
                  <img src={fixture.image} alt="" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-normal text-[#606060]">
                    {fixture.title}
                  </p>
                  <p className="font-semibold text-[10px] text-[#272727]">
                    {fixture.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
