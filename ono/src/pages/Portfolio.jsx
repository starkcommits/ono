import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BriefcaseIcon from '@/assets/Briefcase.svg'
import ClosedEventsInactiveIcon from '@/assets/ClosedEventsInactiveIcon.svg'
import OpenEventsActiveIcon from '@/assets/OpenEventsActiveIcon.svg'
import OpenEventsInActiveIcon from '@/assets/OpenEventsInactiveIcon.svg'
import ClosedEventsActiveIcon from '@/assets/ClosedEventsActiveIcon.svg'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import InfoIcon from '@/assets/Info.svg'
import CricketIcon from '@/assets/CricketImage.svg'
import { ChevronRight } from 'lucide-react'

const Portfolio = () => {
  const { status = 'open' } = useParams()
  const navigate = useNavigate()

  const validTabs = ['open', 'closed']
  // If the status is invalid (e.g. `/events/foo`) → redirect to open
  useEffect(() => {
    if (!validTabs.includes(status)) {
      navigate('/portfolio/open', { replace: true })
    }
  }, [status])

  const handleTabChange = (value) => {
    // Save to localStorage
    localStorage.setItem('currentPortfolioTab', value)
    // Navigate to new tab
    navigate(`/portfolio/${value}`, { replace: true })
  }

  return (
    <div className="leading-[100%] bg-[#F5F5F5]">
      <div className="sticky z-[50] top-0 left-0 right-0 flex flex-col font-inter max-w-md mx-auto pt-4 bg-white mb-auto">
        <div className="border-[0.33px] border-x-0 border-t-0 border-b border-[#DBC5F7] w-full flex justify-center pb-2">
          <h1 className="text-xl font-[500] text-[#2C2D32] mx-auto">
            My Portfolio
          </h1>
        </div>
        <Tabs
          className="w-full font-[500] text-xs"
          value={status}
          onValueChange={handleTabChange}
        >
          <div className="w-full left-0 right-0 bg-[#F5F5F5] z-[50] px-4 py-4">
            <TabsList className="w-full rounded-full space-x-2 bg-transparent text-[#2C2D32] p-0 h-8">
              <TabsTrigger
                value="open"
                className="w-full py-2.5 space-x-2 rounded-full border bg-white data-[state=active]:text-[#EFF0FF] data-[state=active]:bg-[#492C82] text-[13px] font-light h-auto"
              >
                <span>
                  <img
                    src={
                      status === 'open'
                        ? OpenEventsActiveIcon
                        : OpenEventsInActiveIcon
                    }
                    alt=""
                  />
                </span>
                <span>Open Events</span>
              </TabsTrigger>
              <TabsTrigger
                value="closed"
                className="w-full py-2.5 space-x-2 rounded-full border bg-white data-[state=active]:text-[#EFF0FF] data-[state=active]:bg-[#E26F64] text-[13px] font-light"
              >
                <span>
                  <img
                    src={
                      status === 'closed'
                        ? ClosedEventsActiveIcon
                        : ClosedEventsInactiveIcon
                    }
                    alt=""
                  />
                </span>
                <span>Closed Events</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      {status === 'open' && (
        <>
          <div className="bg-[#F5F5F5] pb-2 max-w-md mx-auto relative px-4">
            <div className="bg-[#FFF8F2] p-4 flex flex-col font-inter gap-4 rounded-[5px] border-[0.5px] border-[#E26F64]">
              <div className="flex gap-1 justify-between items-center">
                <div className="flex items-center gap-1">
                  <div>
                    <img src={BriefcaseIcon} className="" alt="" />
                  </div>
                  <div className="font-inter text-sm text-[#E26F64]">
                    Portfolio
                  </div>
                </div>
                <div>
                  <img src={InfoIcon} alt="" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col  items-center">
                  <span className="font-semibold text-xl">&#8377;5.5</span>
                  <span className="font-normal text-xs">Investment</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-xl text-[#DB342C]">
                    &#8377;5.4
                  </span>
                  <span className="font-normal text-xs">Investment</span>
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <span className="font-normal text-xs">
                Live Gains - &#8377;0.1
              </span>
            </div>
          </div>

          <div className="pb-2 pt-2 space-y-4 px-4">
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-normal text-[10px] flex items-center gap-2 p-1"
                  style={{
                    background:
                      'linear-gradient(90deg, #FFD6D3 0%, rgba(255, 231, 228, 0) 100%)',
                  }}
                >
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span>{' '}
                  <span>Gains - &#8377;0.1</span>
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-[10px] flex items-center gap-2">
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span> Gains
                  - &#8377;0.1
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-[10px] flex items-center gap-2">
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span> Gains
                  - &#8377;0.1
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-[10px] flex items-center gap-2">
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span> Gains
                  - &#8377;0.1
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {status === 'closed' && (
        <>
          <div className="bg-[#F5F5F5] pb-2 max-w-md mx-auto relative px-4">
            <div className="bg-[#FFF8F2] p-4 flex flex-col font-inter gap-4 rounded-[5px] border-[0.5px] border-[#E26F64]">
              <div className="flex gap-1 justify-between items-center">
                <div className="flex items-center gap-1">
                  <div>
                    <img src={BriefcaseIcon} className="" alt="" />
                  </div>
                  <div className="font-inter text-sm text-[#E26F64]">
                    Portfolio
                  </div>
                </div>
                <div>
                  <img src={InfoIcon} alt="" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex flex-col  items-center">
                  <span className="font-semibold text-xl">&#8377;5.5</span>
                  <span className="font-normal text-xs">Investment</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-xl text-[#DB342C]">
                    &#8377;5.4
                  </span>
                  <span className="font-normal text-xs">Investment</span>
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <span className="font-normal text-xs">
                Live Gains - &#8377;0.1
              </span>
            </div>
          </div>

          <div className="pb-2 pt-2 space-y-4 px-4">
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="font-normal text-[10px] flex items-center gap-2 p-1"
                  style={{
                    background:
                      'linear-gradient(90deg, #FFD6D3 0%, rgba(255, 231, 228, 0) 100%)',
                  }}
                >
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span>{' '}
                  <span>Gains - &#8377;0.1</span>
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-[10px] flex items-center gap-2">
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span> Gains
                  - &#8377;0.1
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 flex flex-col font-inter gap-4 rounded-[5px]">
              <div className="flex items-center gap-1">
                <p className="bg-[#33726533] px-1.5 text-[8px] font-[500] tracking-[2%] text-[#1C895E] rounded-[2px]">
                  Matched
                </p>
              </div>
              <div className="flex justify-between items-start gap-4">
                <div className="w-[10%]">
                  <img src={CricketIcon} alt="" />
                </div>
                <div className="w-[90%] flex font-normal text-xs">
                  Hyderabad to win the match vs Mumbai?
                </div>
              </div>
              <div className="w-full">
                <Separator></Separator>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-normal text-[10px] flex items-center gap-2">
                  Invested &#8377;5.5{' '}
                  <span className="flex border bg-[#2C2D32] -mx-1"></span> Gains
                  - &#8377;0.1
                </span>
                <div>
                  <button className="font-semibold text-xs flex ">
                    Exit <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Portfolio
