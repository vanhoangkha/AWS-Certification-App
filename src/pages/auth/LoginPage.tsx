import React, { useState } from 'react'
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  FormField,
  Input,
  Button,
  Alert,
  Link
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Login functionality not yet implemented. This is a demo.')
      // For demo purposes, simulate successful login
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-center full-height">
      <Container
        header={
          <Header variant="h1">
            AWS Certification Practice Platform
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="l">
          <Alert type="info" header="Demo Mode">
            This is a demo version. Authentication is not fully implemented yet. 
            Click "Sign In" to continue to the dashboard.
          </Alert>

          <form onSubmit={handleLogin}>
            <SpaceBetween direction="vertical" size="m">
              <FormField label="Email">
                <Input
                  value={email}
                  onChange={({ detail }) => setEmail(detail.value)}
                  placeholder="Enter your email"
                  type="email"
                />
              </FormField>

              <FormField label="Password">
                <Input
                  value={password}
                  onChange={({ detail }) => setPassword(detail.value)}
                  placeholder="Enter your password"
                  type="password"
                />
              </FormField>

              {error && (
                <Alert type="warning">
                  {error}
                </Alert>
              )}

              <Button
                variant="primary"
                loading={isLoading}
                type="submit"
                fullWidth
              >
                Sign In
              </Button>
            </SpaceBetween>
          </form>

          <Box textAlign="center">
            <SpaceBetween direction="vertical" size="s">
              <Link href="#" onClick={(e) => e.preventDefault()}>
                Forgot your password?
              </Link>
              <Box variant="small">
                Don't have an account? <Link href="#" onClick={(e) => e.preventDefault()}>Sign up</Link>
              </Box>
            </SpaceBetween>
          </Box>
        </SpaceBetween>
      </Container>
    </div>
  )
}

export default LoginPage