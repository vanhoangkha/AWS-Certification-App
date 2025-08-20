import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Components
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ExamPage from './pages/exam/ExamPage'
import ResultsPage from './pages/results/ResultsPage'
import AdminPage from './pages/admin/AdminPage'
import PracticePage from './pages/practice/PracticePage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import HelpPage from './pages/HelpPage'
import SampleQuestionsPage from './pages/SampleQuestionsPage'

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
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/exam/:sessionId?"
          element={
            <ProtectedRoute>
              <AppLayout navigationHide>
                <ExamPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PracticePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/results/:resultId?"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ResultsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AppLayout>
                <AdminPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AnalyticsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <AppLayout>
                <HelpPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/sample-questions"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SampleQuestionsPage />
              </AppLayout>
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