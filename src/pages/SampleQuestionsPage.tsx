import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppLayout,
  BreadcrumbGroup,
  ContentLayout,
  SpaceBetween,
  Alert,
  Box
} from '@cloudscape-design/components';
import Navigation from '../components/layout/Navigation';
import TopNavigation from '../components/layout/TopNavigation';
import SampleQuestionViewer from '../components/questions/SampleQuestionViewer';

const SampleQuestionsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartPractice = (questionIds: string[]) => {
    // Navigate to practice page with selected questions
    navigate('/practice', { 
      state: { 
        selectedQuestions: questionIds,
        mode: 'sample'
      }
    });
  };

  return (
    <AppLayout
      navigation={<Navigation />}
      content={
        <ContentLayout
          header={
            <SpaceBetween direction="vertical" size="m">
              <BreadcrumbGroup
                items={[
                  { text: 'Home', href: '/' },
                  { text: 'Sample Questions', href: '/sample-questions' }
                ]}
              />
            </SpaceBetween>
          }
        >
          <SpaceBetween direction="vertical" size="l">
            <Alert
              statusIconAriaLabel="Info"
              header="Sample AWS SAP-C02 Questions"
            >
              These are real-world style questions similar to what you'll encounter in the AWS Solutions Architect Professional certification exam. 
              Each question includes detailed explanations and references to help you understand the concepts.
            </Alert>

            <Box>
              <SampleQuestionViewer onStartPractice={handleStartPractice} />
            </Box>
          </SpaceBetween>
        </ContentLayout>
      }
      headerSelector="#top-nav"
      footerSelector="#footer"
    />
  );
};

export default SampleQuestionsPage;