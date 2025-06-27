import CricketImage from '@/assets/CricketImage.svg'
import DownArrowIcon from '@/assets/DownArrowIcon.svg'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import X from '@/assets/X.svg'
import Back from '@/assets/Back.svg'

import CircleCrossIcon from '@/assets/CircleCrossIcon.svg'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  useFrappeAuth,
  useFrappeEventListener,
  useFrappeGetDoc,
  useFrappeGetDocList,
} from 'frappe-react-sdk'
import OpenMarketHoldings from '../components/OpenMarketHoldings'

const OpenClosedMarketHoldings = () => {
  const [marketPrices, setMarketPrices] = useState({
    market_yes_price: 0,
    market_no_price: 0,
    market_status: 'OPEN',
  })

  const { market_id } = useParams()

  const { data: market, isLoading: marketLoading } = useFrappeGetDoc(
    'Market',
    market_id,
    market_id ? undefined : null
  )

  useEffect(() => {
    if (market) {
      setMarketPrices({
        market_yes_price: parseFloat(market.yes_price),
        market_no_price: parseFloat(market.no_price),
        market_status: market.status,
      })
    }
  }, [market])

  useFrappeEventListener('market_event', (market) => {
    console.log(market)
    if (market.name === market_id) {
      setMarketPrices({
        market_yes_price: parseFloat(market.yes_price),
        market_no_price: parseFloat(market.no_price),
        market_status: market.status,
      })
    }
  })

  if (marketPrices.market_status === 'OPEN')
    return <OpenMarketHoldings marketPrices={marketPrices} />

  if (marketPrices.market_status === 'CLOSED') {
    return 
  }
}

export default OpenClosedMarketHoldings
