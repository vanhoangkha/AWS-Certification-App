import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'admin' | 'trainer' | 'student'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex-center full-height">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Role-based access control (will be implemented with proper user roles)
  if (requiredRole) {
    // For now, just check if user exists
    // In the future, this will check user.role or user.groups
    console.log(`Checking role: ${requiredRole} for user:`, user.userId)
    
    // Placeholder role check - will be implemented with Cognito groups
    const userRole = 'student' // This will come from Cognito user attributes/groups
    
    if (requiredRole === 'admin' && userRole !== 'admin') {
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute