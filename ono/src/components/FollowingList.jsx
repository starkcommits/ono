import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Back from '@/assets/Back.svg'
import NoProfilePic from '@/assets/NoProfilePic.svg'

import { useFrappeGetDoc } from 'frappe-react-sdk'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const FollowingList = () => {
  return (
    <div className="pt-4 flex flex-col gap-4">
      <div className="flex justify-between items-center px-4 pb-4 border-b">
        <div className="flex gap-4 items-center">
          <div>
            <img width={60} height={60} src={NoProfilePic} alt="" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-base text-[#2C2D32]">
              Player One{' '}
            </p>
            <p className="font-normal text-base text-[#2C2D32]">@playerone</p>
          </div>
        </div>
        <div className="bg-[#E26F64] h-[37px] w-[107px] rounded-[5px] p-2.5 flex justify-center items-center">
          <p className="font-semibold text-sm text-white">Following</p>
        </div>
      </div>
      <div className="flex justify-between items-center px-4 pb-4 border-b">
        <div className="flex gap-4 items-center">
          <div>
            <img width={60} height={60} src={NoProfilePic} alt="" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-base text-[#2C2D32]">
              Player One{' '}
            </p>
            <p className="font-normal text-base text-[#2C2D32]">@playerone</p>
          </div>
        </div>
        <div className="bg-[#E26F64] h-[37px] w-[107px] rounded-[5px] p-2.5 flex justify-center items-center">
          <p className="font-semibold text-sm text-white">Following</p>
        </div>
      </div>
      <div className="flex justify-between items-center px-4 pb-4 border-b">
        <div className="flex gap-4 items-center">
          <div>
            <img width={60} height={60} src={NoProfilePic} alt="" />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-base text-[#2C2D32]">
              Player One{' '}
            </p>
            <p className="font-normal text-base text-[#2C2D32]">@playerone</p>
          </div>
        </div>
        <div className="bg-[#E26F64] h-[37px] w-[107px] rounded-[5px] p-2.5 flex justify-center items-center">
          <p className="font-semibold text-sm text-white">Following</p>
        </div>
      </div>
    </div>
  )
}

export default FollowingList
