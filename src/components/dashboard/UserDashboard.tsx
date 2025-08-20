import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Box,
  Grid,
  ColumnLayout,
  Cards,
  Badge,
  ProgressBar,
  LineChart,
  BarChart,
  StatusIndicator,
  Link
} from '@cloudscape-design/components';
import { ExamResult, UserProgress } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { DemoAPI } from '@/services/demo';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentResults, setRecentResults] = useState<ExamResult[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Load recent exam results
      const results = await DemoAPI.Result.getUserResults(user.userId);
      setRecentResults(results.slice(0, 5)); // Last 5 results

      // Generate mock progress data
      const mockProgress: UserProgress = {
        userId: user.userId,
        certification: 'SAP-C02',
        totalAttempts: results.length,
        bestScore: results.length > 0 ? Math.max(...results.map(r => r.scaledScore)) : 0,
        averageScore: results.length > 0 ? results.reduce((sum, r) => sum + r.scaledScore, 0) / results.length : 0,
        domainProgress: [
          {
            domain: 'Design Secure Architectures',
            attempts: 5,
            averageScore: 750,
            bestScore: 850,
            trend: [
              { date: '2024-01-01', score: 650 },
              { date: '2024-01-15', score: 720 },
              { date: '2024-01-30', score: 750 }
            ]
          },
          {
            domain: 'Design Resilient Architectures',
            attempts: 4,
            averageScore: 680,
            bestScore: 780,
            trend: [
              { date: '2024-01-01', score: 600 },
              { date: '2024-01-15', score: 650 },
              { date: '2024-01-30', score: 680 }
            ]
          }
        ],
        achievements: [
          {
            id: 'first_pass',
            title: 'First Pass',
            description: 'Passed your first exam',
            earnedAt: '2024-01-15T10:00:00Z'
          }
        ],
        streaks: {
          currentStreak: 3,
          longestStreak: 5,
          lastStudyDate: '2024-01-30'
        },
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUserProgress(mockProgress);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 800) return 'green';
    if (score >= 720) return 'blue';
    if (score >= 600) return 'grey';
    return 'red';
  };

  const getPerformanceData = () => {
    if (!userProgress) return [];
    
    return userProgress.domainProgress.flatMap(domain =>
      domain.trend.map(point => ({
        x: point.date,
        y: point.score,
        domain: domain.domain
      }))
    );
  };

  const getDomainComparisonData = () => {
    if (!userProgress) return [];
    
    return userProgress.domainProgress.map(domain => ({
      domain: domain.domain.substring(0, 20) + '...',
      average: domain.averageScore,
      best: domain.bestScore
    }));
  };

  if (loading) {
    return (
      <Container>
        <Box textAlign="center" padding="xxl">
          <StatusIndicator type="loading">Loading dashboard...</StatusIndicator>
        </Box>
      </Container>
    );
  }

  return (
    <SpaceBetween direction="vertical" size="l">
      {/* Welcome Header */}
      <Container>
        <Header
          variant="h1"
          description={`Welcome back! Here's your AWS certification progress.`}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary" href="/exam">
                Take Mock Exam
              </Button>
              <Button variant="normal" href="/practice">
                Practice Questions
              </Button>
            </SpaceBetween>
          }
        >
          Hello, {user?.name}!
        </Header>
      </Container>

      {/* Quick Stats */}
      <Grid gridDefinition={[{ colspan: 3 }, { colspan: 3 }, { colspan: 3 }, { colspan: 3 }]}>
        <Container>
          <Box textAlign="center" padding="m">
            <Header variant="h2" color="text-status-info">
              {userProgress?.totalAttempts || 0}
            </Header>
            <div>Total Exams</div>
          </Box>
        </Container>
        
        <Container>
          <Box textAlign="center" padding="m">
            <Header variant="h2" color="text-status-success">
              {userProgress?.bestScore || 0}
            </Header>
            <div>Best Score</div>
          </Box>
        </Container>
        
        <Container>
          <Box textAlign="center" padding="m">
            <Header variant="h2" color="text-status-warning">
              {Math.round(userProgress?.averageScore || 0)}
            </Header>
            <div>Average Score</div>
          </Box>
        </Container>
        
        <Container>
          <Box textAlign="center" padding="m">
            <Header variant="h2" color="text-status-info">
              {userProgress?.streaks.currentStreak || 0}
            </Header>
            <div>Study Streak</div>
          </Box>
        </Container>
      </Grid>

      {/* Performance Charts */}
      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
        <Container
          header={
            <Header variant="h2">
              Performance Trend
            </Header>
          }
        >
          {userProgress && userProgress.domainProgress.length > 0 ? (
            <LineChart
              series={userProgress.domainProgress.map(domain => ({
                title: domain.domain,
                type: 'line',
                data: domain.trend.map(point => ({ x: new Date(point.date), y: point.score }))
              }))}
              xDomain={[
                new Date('2024-01-01'),
                new Date('2024-02-01')
              ]}
              yDomain={[0, 1000]}
              i18nStrings={{
                filterLabel: "Filter displayed data",
                filterPlaceholder: "Filter data",
                filterSelectedAriaLabel: "selected",
                legendAriaLabel: "Legend",
                chartAriaRoleDescription: "line chart",
                xTickFormatter: (e) => new Date(e).toLocaleDateString(),
                yTickFormatter: (e) => e.toString()
              }}
              ariaLabel="Performance trend over time"
              height={300}
            />
          ) : (
            <Box textAlign="center" padding="l">
              <div>No performance data available yet.</div>
              <div>Take some exams to see your progress!</div>
            </Box>
          )}
        </Container>

        <Container
          header={
            <Header variant="h2">
              Domain Performance
            </Header>
          }
        >
          {userProgress && userProgress.domainProgress.length > 0 ? (
            <BarChart
              series={[
                {
                  title: "Average Score",
                  type: "bar",
                  data: getDomainComparisonData().map(item => ({ x: item.domain, y: item.average }))
                },
                {
                  title: "Best Score",
                  type: "bar", 
                  data: getDomainComparisonData().map(item => ({ x: item.domain, y: item.best }))
                }
              ]}
              xDomain={getDomainComparisonData().map(item => item.domain)}
              yDomain={[0, 1000]}
              i18nStrings={{
                filterLabel: "Filter displayed data",
                filterPlaceholder: "Filter data",
                filterSelectedAriaLabel: "selected",
                legendAriaLabel: "Legend",
                chartAriaRoleDescription: "bar chart",
                xTickFormatter: (e) => e,
                yTickFormatter: (e) => e.toString()
              }}
              ariaLabel="Domain performance comparison"
              height={300}
            />
          ) : (
            <Box textAlign="center" padding="l">
              <div>No domain data available yet.</div>
            </Box>
          )}
        </Container>
      </Grid>

      {/* Recent Exam Results */}
      <Container
        header={
          <Header
            variant="h2"
            actions={
              <Button variant="link" href="/results">
                View All Results
              </Button>
            }
          >
            Recent Exam Results
          </Header>
        }
      >
        {recentResults.length > 0 ? (
          <Cards
            ariaLabels={{
              itemSelectionLabel: (e, t) => `select ${t.certification}`,
              selectionGroupLabel: "Item selection"
            }}
            cardDefinition={{
              header: item => (
                <SpaceBetween direction="horizontal" size="xs">
                  <Link href={`/results/${item.resultId}`}>
                    {item.certification}
                  </Link>
                  <Badge color={item.passed ? 'green' : 'red'}>
                    {item.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </SpaceBetween>
              ),
              sections: [
                {
                  id: "score",
                  header: "Score",
                  content: item => (
                    <SpaceBetween direction="vertical" size="xs">
                      <div>
                        <strong>{item.scaledScore}/1000</strong>
                      </div>
                      <ProgressBar
                        value={(item.scaledScore / 1000) * 100}
                        variant={item.passed ? 'success' : 'error'}
                      />
                    </SpaceBetween>
                  )
                },
                {
                  id: "details",
                  header: "Details",
                  content: item => (
                    <ColumnLayout columns={2}>
                      <div>
                        <strong>Questions:</strong> {item.correctAnswers}/{item.totalQuestions}
                      </div>
                      <div>
                        <strong>Time:</strong> {item.timeSpent}m
                      </div>
                      <div>
                        <strong>Type:</strong> {item.examType}
                      </div>
                      <div>
                        <strong>Date:</strong> {new Date(item.completedAt).toLocaleDateString()}
                      </div>
                    </ColumnLayout>
                  )
                }
              ]
            }}
            cardsPerRow={[
              { cards: 1 },
              { minWidth: 500, cards: 2 }
            ]}
            items={recentResults}
            loadingText="Loading results"
            empty={
              <Box textAlign="center" color="inherit">
                <b>No exam results</b>
                <Box
                  padding={{ bottom: "s" }}
                  variant="p"
                  color="inherit"
                >
                  You haven't taken any exams yet.
                </Box>
                <Button href="/exam">Take Your First Exam</Button>
              </Box>
            }
          />
        ) : (
          <Box textAlign="center" padding="l">
            <Header variant="h3">No exam results yet</Header>
            <p>Take your first exam to start tracking your progress!</p>
            <SpaceBetween direction="horizontal" size="s">
              <Button variant="primary" href="/exam">
                Take Mock Exam
              </Button>
              <Button variant="normal" href="/practice">
                Start Practicing
              </Button>
            </SpaceBetween>
          </Box>
        )}
      </Container>

      {/* Achievements */}
      {userProgress && userProgress.achievements.length > 0 && (
        <Container
          header={
            <Header variant="h2">
              Achievements
            </Header>
          }
        >
          <SpaceBetween direction="horizontal" size="s">
            {userProgress.achievements.map((achievement, index) => (
              <Box key={index} padding="s" variant="outlined">
                <SpaceBetween direction="vertical" size="xs">
                  <Badge color="green">🏆</Badge>
                  <div>
                    <strong>{achievement.title}</strong>
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {achievement.description}
                  </div>
                </SpaceBetween>
              </Box>
            ))}
          </SpaceBetween>
        </Container>
      )}

      {/* Study Recommendations */}
      <Container
        header={
          <Header variant="h2">
            Study Recommendations
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          <Box>
            <Header variant="h4">Based on your performance:</Header>
            <ul>
              <li>Focus on domains where you scored below 70%</li>
              <li>Review AWS documentation for weak areas</li>
              <li>Take more practice questions in problem domains</li>
              <li>Consider hands-on labs for practical experience</li>
            </ul>
          </Box>
          
          <SpaceBetween direction="horizontal" size="s">
            <Button variant="primary" href="/practice">
              Practice Weak Areas
            </Button>
            <Button variant="normal" href="/sample-questions">
              Review Sample Questions
            </Button>
            <Button variant="link" href="/help">
              Study Resources
            </Button>
          </SpaceBetween>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};

export default UserDashboard;