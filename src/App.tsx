import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@cloudscape-design/components'

// Components
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ExamPage from './pages/exam/ExamPage'
import ResultsPage from './pages/results/ResultsPage'
import AdminPage from './pages/admin/AdminPage'
import PracticePage from './pages/practice/PracticePage'

// Temporary placeholder components
const PlaceholderComponent: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '24px', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>This component will be implemented in upcoming tasks.</p>
  </div>
)

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex-center full-height">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="full-height">
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" replace /> : <LoginPage />
          } 
        />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout
                navigation={<div />} // Will be implemented later
                content={<DashboardPage />}
                toolsHide
              />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/exam/:sessionId?"
          element={
            <ProtectedRoute>
              <ExamPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <AppLayout
                navigation={<div />}
                content={<PracticePage />}
                toolsHide
              />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/results/:resultId?"
          element={
            <ProtectedRoute>
              <AppLayout
                navigation={<div />}
                content={<ResultsPage />}
                toolsHide
              />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AppLayout
                navigation={<div />}
                content={<AdminPage />}
                toolsHide
              />
            </ProtectedRoute>
          }
        />
        
        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
        
        {/* Catch all */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </div>
  )
}

export default App