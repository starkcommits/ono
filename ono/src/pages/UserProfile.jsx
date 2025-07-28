import React, { useEffect, useState } from 'react'
import Back from '@/assets/Back.svg'
import ShareAndroid from '@/assets/ShareAndroid.svg'
import UpdateDetails from '@/assets/UpdateDetails.svg'
import ShareProfile from '@/assets/ShareProfile.svg'
import LogoutAllDevices from '@/assets/LogoutAllDevices.svg'
import LogoutProfile from '@/assets/LogoutProfile.svg'

import VerticalKebab from '@/assets/VerticalKebab.svg'
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

import { useFrappeAuth, useFrappeGetDoc } from 'frappe-react-sdk'
import { Navigate, useParams } from 'react-router-dom'
import MyProfile from '../components/MyProfile'
import OthersProfile from '../components/OthersProfile'

const UserProfile = () => {
  const { currentUser } = useFrappeAuth()
  const { username } = useParams()
  const [user, setUser] = useState({})
  const { data: userData, isLoading: userDataLoading } = useFrappeGetDoc(
    'User',
    username,
    username ? undefined : null
  )

  console.log(userData)

  useEffect(() => {
    if (!userDataLoading && userData) {
      setUser(userData)
    }
  }, [userData])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  if (currentUser === username) return <MyProfile user={user} />

  if (!userDataLoading && userData === undefined) {
    return <Navigate to="/" />
  }
  return <OthersProfile user={user} />
}

export default UserProfile
