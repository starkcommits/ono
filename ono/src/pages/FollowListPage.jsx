import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Back from '@/assets/Back.svg'
import NoProfilePic from '@/assets/NoProfilePic.svg'

import { useFrappeGetDoc } from 'frappe-react-sdk'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FollowersList from '../components/FollowersList'
import FollowingList from '../components/FollowingList'

const FollowListPage = () => {
  const { username, type } = useParams()

  const [currentFollowTab, setCurrentFollowTab] = useState(
    ['followers', 'following'].includes(type) ? type : 'followers'
  )

  useEffect(() => {
    setCurrentFollowTab(type)
  }, [type])

  const [user, setUser] = useState({})

  const { data: userData, isLoading: userDataLoading } = useFrappeGetDoc(
    'User',
    username,
    username ? undefined : null
  )

  useEffect(() => {
    if (!userDataLoading && userData) setUser(userData)
  }, [userData])

  const handleTabChange = (value) => {
    setCurrentFollowTab(value)
    navigate(`/profile/${username}/${value}`)
  }

  const navigate = useNavigate()
  return (
    <div className="bg-[#F5F5F5] min-h-screen select-none w-full">
      <div className="sticky z-[100] top-0 select-none w-full flex flex-col max-w-md mx-auto">
        <div className="flex justify-between items-center gap-3 px-4 py-4 bg-white border-b border-[#8D8D8D80]/50">
          <div className="flex items-center gap-2">
            <div>
              <img
                src={Back}
                alt=""
                className="cursor-pointer h-4 w-4"
                onClick={() => {
                  navigate(`/profile/${username}`)
                }}
              />
            </div>
            <p className="font-[500] text-xl leading-[100%] text-[#2C2D32]">
              @{user.username}
            </p>
          </div>
        </div>
        <Tabs
          value={currentFollowTab}
          onValueChange={handleTabChange}
          className="w-full font-[500] text-xs"
        >
          <TabsList className="w-full space-x-2 h-full bg-white p-0 rounded-none">
            <TabsTrigger
              value="followers"
              className="text-sm flex gap-2 items-center font-normal data-[state=active]:font-semibold py-4 w-full space-x-2 data-[state=active]:rounded-none text-[#5F5F5F] data-[state=active]:text-[#2C2D32] data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
            >
              Followers
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="text-sm flex gap-2 items-center font-normal data-[state=active]:font-semibold py-4 w-full space-x-2 data-[state=active]:rounded-none text-[#5F5F5F] data-[state=active]:text-[#2C2D32] data-[state=active]:border-b-2 data-[state=active]:border-[#5F5F5F] data-[state=active]:shadow-none bg-transparent data-[state=active]:bg-transparent"
            >
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="bg-white">
        {type === 'followers' ? <FollowersList user={user} /> : null}
        {type === 'following' ? <FollowingList user={user} /> : null}
      </div>
    </div>
  )
}

export default FollowListPage
