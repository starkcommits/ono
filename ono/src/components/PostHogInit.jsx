import { useEffect } from 'react'
import posthog from 'posthog-js'

const API_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_API_KEY
const API_HOST = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

export default function PostHogInit() {
  useEffect(() => {
    posthog.init(API_KEY, {
      api_host: API_HOST,
    })
  }, [])

  return null
}
