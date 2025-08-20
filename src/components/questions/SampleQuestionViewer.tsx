import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Box,
  Button,
  Cards,
  Badge,
  ExpandableSection,
  TextContent,
  Link,
  Select,
  FormField,
  Grid,
  ColumnLayout
} from '@cloudscape-design/components';
import { sampleQuestions, questionsByDomain, questionsByDifficulty } from '../../data/sample-questions';

interface SampleQuestionViewerProps {
  onStartPractice?: (questionIds: string[]) => void;
}

const SampleQuestionViewer: React.FC<SampleQuestionViewerProps> = ({ onStartPractice }) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const domainOptions = [
    { label: 'All Domains', value: 'all' },
    ...Object.keys(questionsByDomain).map(domain => ({
      label: domain,
      value: domain
    }))
  ];

  const difficultyOptions = [
    { label: 'All Difficulties', value: 'all' },
    { label: 'Easy', value: 'EASY' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Hard', value: 'HARD' }
  ];

  const filteredQuestions = sampleQuestions.filter(question => {
    const domainMatch = selectedDomain === 'all' || question.domain === selectedDomain;
    const difficultyMatch = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return domainMatch && difficultyMatch;
  });

  const toggleQuestionExpansion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'green';
      case 'MEDIUM': return 'blue';
      case 'HARD': return 'red';
      default: return 'grey';
    }
  };

  const renderQuestionCard = (question: any) => (
    <Box key={question.id} padding="l" variant="outlined">
      <SpaceBetween direction="vertical" size="m">
        <div>
          <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
            <div>
              <Header
                variant="h3"
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Badge color={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge color="grey">{question.certification}</Badge>
                  </SpaceBetween>
                }
              >
                Question #{sampleQuestions.indexOf(question) + 1}
              </Header>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button
                variant="link"
                onClick={() => toggleQuestionExpansion(question.id)}
              >
                {expandedQuestions.has(question.id) ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </Grid>
        </div>

        <Box variant="p">
          <strong>Domain:</strong> {question.domain}
        </Box>

        <TextContent>
          <p>{question.questionText}</p>
        </TextContent>

        <ExpandableSection
          headerText="Answer Options"
          expanded={expandedQuestions.has(question.id)}
          onChange={() => toggleQuestionExpansion(question.id)}
        >
          <SpaceBetween direction="vertical" size="s">
            {question.options.map((option: any, index: number) => (
              <Box
                key={index}
                padding="s"
                variant={option.isCorrect ? "success" : "default"}
              >
                <SpaceBetween direction="horizontal" size="s">
                  <Badge color={option.isCorrect ? "green" : "grey"}>
                    {String.fromCharCode(65 + index)}
                  </Badge>
                  <span>{option.text}</span>
                  {option.isCorrect && <Badge color="green">Correct</Badge>}
                </SpaceBetween>
              </Box>
            ))}
          </SpaceBetween>
        </ExpandableSection>

        {expandedQuestions.has(question.id) && (
          <ExpandableSection headerText="Explanation" defaultExpanded>
            <SpaceBetween direction="vertical" size="m">
              <TextContent>
                <p>{question.explanation}</p>
              </TextContent>

              {question.references && question.references.length > 0 && (
                <Box>
                  <Header variant="h4">References</Header>
                  <SpaceBetween direction="vertical" size="xs">
                    {question.references.map((ref: any, index: number) => (
                      <Link
                        key={index}
                        href={ref.url}
                        external
                        variant="primary"
                      >
                        {ref.title}
                      </Link>
                    ))}
                  </SpaceBetween>
                </Box>
              )}

              {question.tags && question.tags.length > 0 && (
                <Box>
                  <Header variant="h4">Tags</Header>
                  <SpaceBetween direction="horizontal" size="xs">
                    {question.tags.map((tag: string, index: number) => (
                      <Badge key={index} color="blue">{tag}</Badge>
                    ))}
                  </SpaceBetween>
                </Box>
              )}
            </SpaceBetween>
          </ExpandableSection>
        )}
      </SpaceBetween>
    </Box>
  );

  return (
    <Container
      header={
        <Header
          variant="h1"
          description="Sample AWS SAP-C02 certification questions for practice and review"
          actions={
            onStartPractice && (
              <Button
                variant="primary"
                onClick={() => onStartPractice(filteredQuestions.map(q => q.id))}
              >
                Start Practice with Filtered Questions
              </Button>
            )
          }
        >
          Sample Questions ({filteredQuestions.length})
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {/* Filters */}
        <ColumnLayout columns={2}>
          <FormField label="Filter by Domain">
            <Select
              selectedOption={domainOptions.find(opt => opt.value === selectedDomain)}
              onChange={({ detail }) => setSelectedDomain(detail.selectedOption.value!)}
              options={domainOptions}
              placeholder="Select domain"
            />
          </FormField>
          <FormField label="Filter by Difficulty">
            <Select
              selectedOption={difficultyOptions.find(opt => opt.value === selectedDifficulty)}
              onChange={({ detail }) => setSelectedDifficulty(detail.selectedOption.value!)}
              options={difficultyOptions}
              placeholder="Select difficulty"
            />
          </FormField>
        </ColumnLayout>

        {/* Statistics */}
        <Grid gridDefinition={[{ colspan: 3 }, { colspan: 3 }, { colspan: 3 }, { colspan: 3 }]}>
          <Box textAlign="center" padding="m" variant="outlined">
            <Box fontSize="heading-xl" fontWeight="bold" color="text-status-success">
              {sampleQuestions.length}
            </Box>
            <Box fontSize="body-s">Total Questions</Box>
          </Box>
          <Box textAlign="center" padding="m" variant="outlined">
            <Box fontSize="heading-xl" fontWeight="bold" color="text-status-info">
              {Object.keys(questionsByDomain).length}
            </Box>
            <Box fontSize="body-s">Domains Covered</Box>
          </Box>
          <Box textAlign="center" padding="m" variant="outlined">
            <Box fontSize="heading-xl" fontWeight="bold" color="text-status-warning">
              {questionsByDifficulty.MEDIUM?.length || 0}
            </Box>
            <Box fontSize="body-s">Medium Questions</Box>
          </Box>
          <Box textAlign="center" padding="m" variant="outlined">
            <Box fontSize="heading-xl" fontWeight="bold" color="text-status-error">
              {questionsByDifficulty.HARD?.length || 0}
            </Box>
            <Box fontSize="body-s">Hard Questions</Box>
          </Box>
        </Grid>

        {/* Questions */}
        <SpaceBetween direction="vertical" size="m">
          {filteredQuestions.length === 0 ? (
            <Box textAlign="center" padding="xxl">
              <Header variant="h2">No questions match your filters</Header>
              <p>Try adjusting your domain or difficulty filters to see more questions.</p>
            </Box>
          ) : (
            filteredQuestions.map(renderQuestionCard)
          )}
        </SpaceBetween>

        {/* Domain Breakdown */}
        <ExpandableSection headerText="Domain Breakdown">
          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            {Object.entries(questionsByDomain).map(([domain, questions]) => (
              <Box key={domain} padding="m" variant="outlined">
                <Header variant="h4">{domain}</Header>
                <SpaceBetween direction="vertical" size="xs">
                  <div>Questions: {questions.length}</div>
                  <SpaceBetween direction="horizontal" size="xs">
                    {['EASY', 'MEDIUM', 'HARD'].map(difficulty => {
                      const count = questions.filter(q => q.difficulty === difficulty).length;
                      return count > 0 ? (
                        <Badge key={difficulty} color={getDifficultyColor(difficulty)}>
                          {difficulty}: {count}
                        </Badge>
                      ) : null;
                    })}
                  </SpaceBetween>
                </SpaceBetween>
              </Box>
            ))}
          </Grid>
        </ExpandableSection>
      </SpaceBetween>
    </Container>
  );
};

export default SampleQuestionViewer;