import { Navigate, Outlet } from 'react-router-dom'
import { useFrappeAuth } from 'frappe-react-sdk'

const ProtectedRoute = () => {
  const { currentUser, isLoading } = useFrappeAuth()

  if (isLoading) {
    return null
  }

  // If user is logged in, redirect to home
  return currentUser ? <Outlet /> : <Navigate to="/signin" replace />
}

export default ProtectedRoute
