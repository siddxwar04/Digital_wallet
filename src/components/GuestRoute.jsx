import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}
