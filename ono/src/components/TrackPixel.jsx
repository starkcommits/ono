// TrackPixel.jsx
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useFrappeAuth } from 'frappe-react-sdk'

const TrackPixel = () => {
  const location = useLocation()
  const { currentUser } = useFrappeAuth()

  useEffect(() => {
    const img = new Image()
    if (currentUser)
      img.src = `https://prt.privacycard.in/api/method/frappe_whatsapp.api.track_event?user=${encodeURIComponent(
        currentUser
      )}`
    console.log('Hello')
  }, [location.pathname])

  return null
}

export default TrackPixel
