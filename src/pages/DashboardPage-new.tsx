import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UserDashboard from '@/components/dashboard/UserDashboard'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return <div>Please log in to access your dashboard.</div>
  }

  return <UserDashboard />
}

export default DashboardPage