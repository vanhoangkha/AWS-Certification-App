import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  AppLayout,
  Container,
  Header,
  SpaceBetween,
  Button,
  Box
} from '@cloudscape-design/components'
import SampleQuestionViewer from './components/questions/SampleQuestionViewer'

const TestApp: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout
        content={
          <Container
            header={
              <Header variant="h1">
                AWS Certification Practice Platform - Test
              </Header>
            }
          >
            <SpaceBetween direction="vertical" size="l">
              <Box>
                <p>Welcome to the AWS Certification Practice Platform test environment!</p>
              </Box>
              
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <div>
                      <Header variant="h2">Sample Questions</Header>
                      <SampleQuestionViewer />
                    </div>
                  } 
                />
                <Route 
                  path="/sample-questions" 
                  element={<SampleQuestionViewer />} 
                />
              </Routes>
            </SpaceBetween>
          </Container>
        }
        navigationHide
        toolsHide
      />
    </BrowserRouter>
  )
}

export default TestApp