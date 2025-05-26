import { Navigate } from 'react-router-dom'

export default function PortfolioRedirect() {
  const currentPortfolioTab = localStorage.getItem('currentPortfolioTab')
  const validTabs = ['open', 'closed']
  const fallbackTab = validTabs.includes(currentPortfolioTab || '')
    ? currentPortfolioTab
    : 'open'

  return <Navigate to={`/portfolio/${fallbackTab}`} replace />
}
