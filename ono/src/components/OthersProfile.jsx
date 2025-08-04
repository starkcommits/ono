import React, { useState } from 'react'
import Back from '@/assets/Back.svg'
import ShareAndroid from '@/assets/ShareAndroid.svg'
import UpdateDetails from '@/assets/UpdateDetails.svg'
import ShareProfile from '@/assets/ShareProfile.svg'
import LogoutAllDevices from '@/assets/LogoutAllDevices.svg'
import LogoutProfile from '@/assets/LogoutProfile.svg'
import LeaderboardProfile from '@/assets/LeaderboardProfile.svg'
import LeaderboardGraph from '@/assets/LeaderboardGraph.svg'
import ArrowRight from '@/assets/ArrowRight.svg'
import EditPencil from '@/assets/EditPencil.svg'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VerticalKebab from '@/assets/VerticalKebab.svg'
import SkillScore from '@/assets/SkillScore.svg'
import NoProfilePic from '@/assets/NoProfilePic.svg'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import { useFrappeAuth } from 'frappe-react-sdk'
import { useNavigate } from 'react-router-dom'
import SkillScoreMeter from './SkillScoreMeter'

const OthersProfile = ({ user }) => {
  const navigate = useNavigate()

  const [currentProfileTab, setCurrentProfileTab] = useState('statistics')
  const handleTabChange = (value) => {
    setCurrentProfileTab(value)
  }
  return (
    <div className="bg-[#F5F5F5] min-h-screen select-none w-full">
      <div className="sticky z-[50] top-0 select-none w-full flex flex-col max-w-md mx-auto">
        <div className="flex justify-between items-center gap-3 px-4 py-4 bg-white border-b border-[#8D8D8D80]/50">
          <div className="flex items-center gap-2">
            <div>
              <img
                src={Back}
                alt=""
                className="cursor-pointer h-4 w-4"
                onClick={() => {
                  navigate('/profile')
                }}
              />
            </div>
            <p className="font-[500] text-xl leading-[100%] text-[#2C2D32]">
              @{user.username}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <img src={ShareAndroid} className="cursor-pointer" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 pb-6 bg-[#F5F5F5]">
        <div className="flex gap-[17px] items-center">
          {user.user_image ? (
            <div>
              <img width={87} height={87} src={user.user_image} alt="" />
            </div>
          ) : (
            <div>
              <img width={87} height={87} src={NoProfilePic} alt="" />
            </div>
          )}
          <div className="flex flex-col gap-[7px]">
            <div>
              <p className="font-semibold text-xl leading-[100%] text-[#2C2D32]">
                {user.first_name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-2 items-center bg-white px-2.5 py-[5px] rounded-[20px]">
                <span className="text-sm font-normal text-[#5F5F5F]">
                  Seeker
                </span>
                <img src={ArrowRight} alt="" />
              </div>
            </div>
          </div>
        </div>
        {user.bio ? (
          <div className="w-full p-2.5 rounded-[5px] cursor-pointer">
            <p className="text-[#272727] text-sm font-normal">{user.bio}</p>
          </div>
        ) : null}
        <div className="flex justify-between items-center">
          <div
            className="flex flex-col gap-2 cursor-pointer"
            onClick={() => {
              navigate(`/profile/${user.name}/followers`)
            }}
          >
            <p className="text-[#272727] text-xs font-semibold text-center">
              0
            </p>
            <p className="flex items-center gap-2">
              <span className="text-xs font-normal text-[#272727]">
                Followers
              </span>
              <img src={ArrowRight} alt="" />
            </p>
          </div>
          <div
            className="flex flex-col gap-2 cursor-pointer"
            onClick={() => {
              navigate(`/profile/${user.name}/following`)
            }}
          >
            <p className="text-[#272727] text-xs font-semibold text-center">
              0
            </p>
            <p className="flex items-center gap-2">
              <span className="text-xs font-normal text-[#272727]">
                Following
              </span>
              <img src={ArrowRight} alt="" />
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[#272727] text-xs font-semibold text-center">
              28%
            </p>
            <p className="flex items-center gap-2">
              <span className="text-xs font-normal text-[#272727]">
                Win Rate (30D)
              </span>
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={currentProfileTab}
        onValueChange={handleTabChange}
        className="w-full font-[500] text-xs"
      >
        <TabsList className="w-full space-x-2 h-full bg-white p-0 rounded-none">
          <TabsTrigger
            value="statistics"
            className="text-sm flex gap-2 items-center font-medium py-4 w-full space-x-2 data-[state=active]:rounded-none text-[#5F5F5F] data-[state=active]:text-[#2C2D32] data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
          >
            <p className="font-semibold text-sm">Statistics</p>
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="text-sm flex gap-2 items-center font-medium py-4 w-full space-x-2 data-[state=active]:rounded-none text-[#5F5F5F] data-[state=active]:text-[#2C2D32] data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
          >
            <p className="font-semibold text-sm">Activity</p>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {currentProfileTab === 'statistics' ? (
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col py-4 bg-white rounded-[5px]">
            <div className="flex justify-between items-center text-[#2C2D32] text-sm font-semibold px-4">
              <div className="flex gap-4 items-center">
                <div>
                  <img src={SkillScore} alt="" />
                </div>
                <p className="">Skill Score</p>
              </div>
              <div className="flex gap-4 items-center">
                <p>Share</p>
                <div>
                  <img src={ShareAndroid} alt="" />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center pb-12">
              <SkillScoreMeter value={500} className="py-4" />
            </div>
            <div className="flex justify-between items-center px-4 border-t pt-4">
              <p className="text-sm font-semibold text-[#337265]">
                View Details
              </p>
              <div>
                <img src={ArrowRight} alt="" />
              </div>
            </div>
          </div>
          <div className="flex flex-col py-4 gap-4 bg-white rounded-[5px]">
            <div className="flex justify-between items-center text-[#2C2D32] text-sm font-semibold px-4">
              <div className="flex gap-4 items-center">
                <div>
                  <img src={LeaderboardProfile} alt="" />
                </div>
                <p className="font-semibold text-base text-[#2C2D32]">
                  Leaderboard
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <p className="font-semibold text-sm text-[#2C2D32]">Share</p>
                <div>
                  <img src={ShareAndroid} alt="" />
                </div>
              </div>
            </div>
            <div className="w-full flex justify-between items-end px-4">
              <div className="flex flex-col gap-2.5">
                <p className="font-normal text-sm text-[#2C2D32]">
                  Your rank is
                </p>
                <p className="font-bold text-[32px] text-[#492C82]">
                  2,90,15,751
                </p>
                <p className="text-xs font-semibold text-[#2C2D32]">
                  You&apos;re ahead of 24% ONO Players
                </p>
              </div>
              <div className="">
                <img src={LeaderboardGraph} alt="" />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default OthersProfile
