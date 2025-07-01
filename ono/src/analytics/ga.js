// src/analytics/ga.ts
import ReactGA from 'react-ga4'

export const MEASUREMENT_ID = 'G-BTJD31LE98' // ✅ Replace with your real GA4 ID

let initialized = false

export const initGA = () => {
  if (!initialized) {
    ReactGA.initialize(MEASUREMENT_ID)
    initialized = true
  }
}

export const setUserId = (userId) => {
  ReactGA.set({ user_id: userId, user_role: 'Trader' })
}

export const trackPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path })
}

export const trackEvent = (params) => {
  ReactGA.event(params)
}
