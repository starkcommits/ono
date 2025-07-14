import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useFrappeEventListener, useFrappeGetDoc } from 'frappe-react-sdk'
import OpenMarketHoldings from '../components/OpenMarketHoldings'
import ResolvedMarketHoldings from './ResolvedMarketHoldings'

const OpenClosedResolvedMarketHoldings = () => {
  const [marketPrices, setMarketPrices] = useState({
    market_yes_price: 0,
    market_no_price: 0,
    market_status: 'OPEN',
  })

  const { market_id } = useParams()

  const { data: market } = useFrappeGetDoc(
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

  useFrappeEventListener('market_event', (marketUpdated) => {
    console.log('Updated open cclosed: ', marketUpdated)
    if (marketUpdated.name === market_id) {
      setMarketPrices({
        market_yes_price: parseFloat(marketUpdated.yes_price),
        market_no_price: parseFloat(marketUpdated.no_price),
        market_status: marketUpdated.status,
      })
    }
  })

  if (marketPrices.market_status === 'OPEN')
    return (
      <OpenMarketHoldings
        marketPrices={marketPrices}
        setMarketPrices={setMarketPrices}
      />
    )

  if (
    marketPrices.market_status === 'CLOSED' ||
    marketPrices.market_status === 'RESOLVED'
  ) {
    return <ResolvedMarketHoldings marketPrices={marketPrices} />
  }
}

export default OpenClosedResolvedMarketHoldings
