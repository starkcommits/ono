import { Navigate, Outlet } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'

const PublicRoute = () => {
  const { currentUser, isLoading } = useFrappeAuth()

  if (isLoading) {
    return null
  }

  // If user is not logged in, redirect to SignIn
  return currentUser ? <Navigate to="/" replace /> : <Outlet />
}
export default PublicRoute
