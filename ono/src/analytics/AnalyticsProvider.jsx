// src/analytics/AnalyticsProvider.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'
import { initGA, setUserId, trackPageView } from './ga'
import { getClientId } from './getClientId'

export const AnalyticsProvider = () => {
  const location = useLocation()
  const { currentUser } = useFrappeAuth()

  useEffect(() => {
    initGA()
  }, [])

  useEffect(() => {
    const userId = currentUser || getClientId()
    if (userId) {
      setUserId(userId)
    }
  }, [currentUser])

  useEffect(() => {
    trackPageView(location.pathname + location.search)
  }, [location])

  return null
}
