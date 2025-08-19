import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth'
import type { UserProfile } from '@/types'

interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      
      // Check if we have a demo user in localStorage
      const demoUser = localStorage.getItem('demoUser')
      if (demoUser) {
        setUser(JSON.parse(demoUser))
        setIsLoading(false)
        return
      }

      const currentUser = await getCurrentUser()
      const session = await fetchAuthSession()
      
      // Transform Cognito user to our UserProfile format
      const userProfile: UserProfile = {
        userId: currentUser.userId,
        email: currentUser.signInDetails?.loginId || '',
        name: currentUser.username,
        targetCertifications: [], // Will be loaded from user preferences
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
          autoSave: true,
          examReminders: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setUser(userProfile)
    } catch (error) {
      console.log('No authenticated user, running in demo mode')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Demo mode - create a mock user
      const demoUser: UserProfile = {
        userId: 'demo-user-123',
        email: email || 'demo@example.com',
        name: 'Demo User',
        targetCertifications: ['SAA-C03', 'CLF-C01'],
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
          autoSave: true,
          examReminders: true
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Store in localStorage for demo
      localStorage.setItem('demoUser', JSON.stringify(demoUser))
      setUser(demoUser)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Clear demo user
      localStorage.removeItem('demoUser')
      setUser(null)
      
      // Try Amplify signOut if available
      try {
        await signOut()
      } catch (e) {
        // Ignore if Amplify not configured
      }
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}