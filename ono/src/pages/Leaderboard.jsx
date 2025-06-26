import React from 'react'
import ShareAndroid from '@/assets/ShareAndroid.svg'
import Back from '@/assets/Back.svg'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Leaderboard = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 select-none w-full flex flex-col justify-between items-center gap-4 max-w-md mx-auto leading-[100%]">
        <div className="border-b border-[#8D8D8D80]/50 w-full">
          <div className="flex items-center justify-between w-full p-4">
            <div className="flex items-center gap-3">
              <img
                src={Back}
                alt=""
                className="cursor-pointer h-4 w-4"
                onClick={() => {
                  navigate(-1)
                }}
              />
            </div>
            <div>
              <p className="font-[500] text-lg">Leaderboard</p>
            </div>
            <div>
              <img src={ShareAndroid} alt="" />
            </div>
          </div>
        </div>
        <div className="w-full p-0">
          <Tabs defaultValue="account" className="w-full p-0">
            <TabsList className="w-full p-0 bg-transparent border-none shadow-none rounded-none">
              <TabsTrigger
                className="w-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-[#5F5F5F] rounded-none py-4 text-sm font-medium"
                value="account"
              >
                ONO Players
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b data-[state=active]:border-[#5F5F5F] rounded-none py-4 text-sm font-medium"
                value="password"
              >
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default Leaderboard
