import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Table,
  Box,
  TextFilter,
  Pagination,
  CollectionPreferences,
  Modal,
  Form,
  FormField,
  Input,
  Textarea,
  Select,
  Multiselect,
  Alert,
  Badge,
  StatusIndicator
} from '@cloudscape-design/components';
import { Question, QuestionInput } from '@/types';
import { DemoAPI } from '@/services/demo';

interface QuestionBankManagerProps {
  onQuestionSelect?: (question: Question) => void;
}

const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({ onQuestionSelect }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Question[]>([]);
  const [filterText, setFilterText] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState<Partial<QuestionInput>>({});
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const certificationOptions = [
    { label: 'AWS Cloud Practitioner (CLF-C01)', value: 'CLF-C01' },
    { label: 'AWS Solutions Architect Associate (SAA-C03)', value: 'SAA-C03' },
    { label: 'AWS Developer Associate (DVA-C01)', value: 'DVA-C01' },
    { label: 'AWS SysOps Administrator (SOA-C02)', value: 'SOA-C02' },
    { label: 'AWS Solutions Architect Professional (SAP-C02)', value: 'SAP-C02' }
  ];

  const difficultyOptions = [
    { label: 'Easy', value: 'EASY' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Hard', value: 'HARD' }
  ];

  const questionTypeOptions = [
    { label: 'Multiple Choice (Single Answer)', value: 'MULTIPLE_CHOICE' },
    { label: 'Multiple Select (Multiple Answers)', value: 'MULTIPLE_SELECT' }
  ];

  const domainOptions = [
    { label: 'Design Secure Architectures', value: 'Design Secure Architectures' },
    { label: 'Design Resilient Architectures', value: 'Design Resilient Architectures' },
    { label: 'Design High-Performing Architectures', value: 'Design High-Performing Architectures' },
    { label: 'Design Cost-Optimized Architectures', value: 'Design Cost-Optimized Architectures' },
    { label: 'Cloud Concepts', value: 'Cloud Concepts' },
    { label: 'Security and Compliance', value: 'Security and Compliance' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Billing and Pricing', value: 'Billing and Pricing' }
  ];

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const result = await DemoAPI.Question.getQuestionsByFilters({});
      setQuestions(result.questions);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to load questions' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      if (!formData.questionText || !formData.certification || !formData.domain) {
        setNotification({ type: 'error', message: 'Please fill in all required fields' });
        return;
      }

      await DemoAPI.Question.createQuestion(formData as QuestionInput);
      setNotification({ type: 'success', message: 'Question created successfully' });
      setShowCreateModal(false);
      setFormData({});
      loadQuestions();
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to create question' });
    }
  };

  const handleEditQuestion = async () => {
    try {
      if (!editingQuestion || !formData.questionText) {
        setNotification({ type: 'error', message: 'Please fill in all required fields' });
        return;
      }

      await DemoAPI.Question.updateQuestion({
        questionId: editingQuestion.questionId,
        ...formData
      });
      setNotification({ type: 'success', message: 'Question updated successfully' });
      setShowEditModal(false);
      setEditingQuestion(null);
      setFormData({});
      loadQuestions();
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update question' });
    }
  };

  const handleDeleteQuestions = async () => {
    try {
      for (const question of selectedItems) {
        await DemoAPI.Question.deleteQuestion(question.questionId);
      }
      setNotification({ type: 'success', message: `${selectedItems.length} question(s) deleted successfully` });
      setSelectedItems([]);
      loadQuestions();
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to delete questions' });
    }
  };

  const openEditModal = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      certification: question.certification,
      domain: question.domain,
      difficulty: question.difficulty,
      questionType: question.questionType,
      options: question.options,
      correctAnswers: question.correctAnswers,
      explanation: question.explanation,
      references: question.references,
      tags: question.tags
    });
    setShowEditModal(true);
  };

  const filteredQuestions = questions.filter(question =>
    question.questionText.toLowerCase().includes(filterText.toLowerCase()) ||
    question.certification.toLowerCase().includes(filterText.toLowerCase()) ||
    question.domain.toLowerCase().includes(filterText.toLowerCase())
  );

  const paginatedQuestions = filteredQuestions.slice(
    (currentPageIndex - 1) * pageSize,
    currentPageIndex * pageSize
  );

  const columnDefinitions = [
    {
      id: 'questionText',
      header: 'Question',
      cell: (item: Question) => (
        <Box>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {item.questionText.substring(0, 100)}...
          </div>
          <SpaceBetween direction="horizontal" size="xs">
            <Badge color="blue">{item.certification}</Badge>
            <Badge color="grey">{item.difficulty}</Badge>
          </SpaceBetween>
        </Box>
      ),
      width: 400,
      minWidth: 300
    },
    {
      id: 'domain',
      header: 'Domain',
      cell: (item: Question) => item.domain,
      width: 200
    },
    {
      id: 'type',
      header: 'Type',
      cell: (item: Question) => (
        <Badge color={item.questionType === 'MULTIPLE_CHOICE' ? 'green' : 'blue'}>
          {item.questionType === 'MULTIPLE_CHOICE' ? 'MCQ' : 'MRQ'}
        </Badge>
      ),
      width: 100
    },
    {
      id: 'options',
      header: 'Options',
      cell: (item: Question) => `${item.options.length} options`,
      width: 100
    },
    {
      id: 'created',
      header: 'Created',
      cell: (item: Question) => new Date(item.createdAt).toLocaleDateString(),
      width: 120
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item: Question) => (
        <SpaceBetween direction="horizontal" size="xs">
          <Button
            variant="link"
            onClick={() => openEditModal(item)}
          >
            Edit
          </Button>
          {onQuestionSelect && (
            <Button
              variant="link"
              onClick={() => onQuestionSelect(item)}
            >
              Select
            </Button>
          )}
        </SpaceBetween>
      ),
      width: 120
    }
  ];

  return (
    <Container
      header={
        <Header
          variant="h2"
          description="Manage your question bank with CRUD operations, import/export, and bulk actions"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                variant="normal"
                disabled={selectedItems.length === 0}
                onClick={handleDeleteQuestions}
              >
                Delete Selected ({selectedItems.length})
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Question
              </Button>
            </SpaceBetween>
          }
        >
          Question Bank Manager
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="l">
        {notification && (
          <Alert
            statusIconAriaLabel={notification.type}
            type={notification.type}
            dismissible
            onDismiss={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        )}

        <Table
          columnDefinitions={columnDefinitions}
          items={paginatedQuestions}
          loading={loading}
          loadingText="Loading questions..."
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          selectionType="multi"
          ariaLabels={{
            selectionGroupLabel: "Items selection",
            allItemsSelectionLabel: ({ selectedItems }) =>
              `${selectedItems.length} ${selectedItems.length === 1 ? "item" : "items"} selected`,
            itemSelectionLabel: ({ selectedItems }, item) => {
              const isItemSelected = selectedItems.filter(i => i.questionId === item.questionId).length;
              return `${item.questionText} is ${isItemSelected ? "" : "not"} selected`;
            }
          }}
          renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
            `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
          }
          variant="full-page"
          stickyHeader
          header={
            <Header
              counter={`(${filteredQuestions.length})`}
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button
                    iconName="refresh"
                    onClick={loadQuestions}
                  />
                </SpaceBetween>
              }
            >
              Questions
            </Header>
          }
          filter={
            <TextFilter
              filteringText={filterText}
              onChange={({ detail }) => setFilterText(detail.filteringText)}
              filteringPlaceholder="Search questions..."
            />
          }
          pagination={
            <Pagination
              currentPageIndex={currentPageIndex}
              onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
              pagesCount={Math.ceil(filteredQuestions.length / pageSize)}
            />
          }
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                pageSize: pageSize,
                visibleContent: ['questionText', 'domain', 'type', 'options', 'created', 'actions']
              }}
              pageSizePreference={{
                title: "Page size",
                options: [
                  { value: 10, label: "10 questions" },
                  { value: 20, label: "20 questions" },
                  { value: 50, label: "50 questions" }
                ]
              }}
              onConfirm={({ detail }) => {
                setPageSize(detail.pageSize || 10);
              }}
            />
          }
        />

        {/* Create Question Modal */}
        <Modal
          visible={showCreateModal}
          onDismiss={() => setShowCreateModal(false)}
          header="Create New Question"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCreateQuestion}>
                  Create Question
                </Button>
              </SpaceBetween>
            </Box>
          }
          size="large"
        >
          <Form>
            <SpaceBetween direction="vertical" size="l">
              <FormField label="Question Text" constraintText="Required">
                <Textarea
                  value={formData.questionText || ''}
                  onChange={({ detail }) => setFormData({ ...formData, questionText: detail.value })}
                  placeholder="Enter the question text..."
                  rows={4}
                />
              </FormField>

              <FormField label="Certification" constraintText="Required">
                <Select
                  selectedOption={certificationOptions.find(opt => opt.value === formData.certification) || null}
                  onChange={({ detail }) => setFormData({ ...formData, certification: detail.selectedOption.value })}
                  options={certificationOptions}
                  placeholder="Select certification"
                />
              </FormField>

              <FormField label="Domain" constraintText="Required">
                <Select
                  selectedOption={domainOptions.find(opt => opt.value === formData.domain) || null}
                  onChange={({ detail }) => setFormData({ ...formData, domain: detail.selectedOption.value })}
                  options={domainOptions}
                  placeholder="Select domain"
                />
              </FormField>

              <FormField label="Difficulty">
                <Select
                  selectedOption={difficultyOptions.find(opt => opt.value === formData.difficulty) || null}
                  onChange={({ detail }) => setFormData({ ...formData, difficulty: detail.selectedOption.value as any })}
                  options={difficultyOptions}
                  placeholder="Select difficulty"
                />
              </FormField>

              <FormField label="Question Type">
                <Select
                  selectedOption={questionTypeOptions.find(opt => opt.value === formData.questionType) || null}
                  onChange={({ detail }) => setFormData({ ...formData, questionType: detail.selectedOption.value as any })}
                  options={questionTypeOptions}
                  placeholder="Select question type"
                />
              </FormField>

              <FormField label="Explanation">
                <Textarea
                  value={formData.explanation || ''}
                  onChange={({ detail }) => setFormData({ ...formData, explanation: detail.value })}
                  placeholder="Explain why the answer is correct..."
                  rows={3}
                />
              </FormField>
            </SpaceBetween>
          </Form>
        </Modal>

        {/* Edit Question Modal */}
        <Modal
          visible={showEditModal}
          onDismiss={() => setShowEditModal(false)}
          header="Edit Question"
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleEditQuestion}>
                  Save Changes
                </Button>
              </SpaceBetween>
            </Box>
          }
          size="large"
        >
          <Form>
            <SpaceBetween direction="vertical" size="l">
              <FormField label="Question Text" constraintText="Required">
                <Textarea
                  value={formData.questionText || ''}
                  onChange={({ detail }) => setFormData({ ...formData, questionText: detail.value })}
                  placeholder="Enter the question text..."
                  rows={4}
                />
              </FormField>

              <FormField label="Explanation">
                <Textarea
                  value={formData.explanation || ''}
                  onChange={({ detail }) => setFormData({ ...formData, explanation: detail.value })}
                  placeholder="Explain why the answer is correct..."
                  rows={3}
                />
              </FormField>
            </SpaceBetween>
          </Form>
        </Modal>
      </SpaceBetween>
    </Container>
  );
};

export default QuestionBankManager;