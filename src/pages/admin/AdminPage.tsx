import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  AppLayout,
  SideNavigation,
  TopNavigation,
  ContentLayout,
  Header,
  SpaceBetween,
  Box
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'
import QuestionManager from '@/components/questions/QuestionManager'

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth()

  const navigationItems = [
    {
      type: 'section',
      text: 'Question Management',
      items: [
        {
          type: 'link',
          text: 'Question Bank',
          href: '/admin/questions'
        },
        {
          type: 'link',
          text: 'Import Questions',
          href: '/admin/questions/import'
        },
        {
          type: 'link',
          text: 'Export Questions',
          href: '/admin/questions/export'
        }
      ]
    },
    {
      type: 'section',
      text: 'Exam Management',
      items: [
        {
          type: 'link',
          text: 'Exam Templates',
          href: '/admin/templates'
        },
        {
          type: 'link',
          text: 'Active Exams',
          href: '/admin/exams'
        }
      ]
    },
    {
      type: 'section',
      text: 'User Management',
      items: [
        {
          type: 'link',
          text: 'Users',
          href: '/admin/users'
        },
        {
          type: 'link',
          text: 'User Groups',
          href: '/admin/groups'
        }
      ]
    },
    {
      type: 'section',
      text: 'Analytics',
      items: [
        {
          type: 'link',
          text: 'Dashboard',
          href: '/admin/analytics'
        },
        {
          type: 'link',
          text: 'Reports',
          href: '/admin/reports'
        },
        {
          type: 'link',
          text: 'Question Performance',
          href: '/admin/question-analytics'
        }
      ]
    },
    {
      type: 'section',
      text: 'System',
      items: [
        {
          type: 'link',
          text: 'Settings',
          href: '/admin/settings'
        },
        {
          type: 'link',
          text: 'Audit Logs',
          href: '/admin/audit'
        }
      ]
    }
  ]

  return (
    <div className="full-height">
      <TopNavigation
        identity={{
          href: '#',
          title: 'AWS Certification Platform',
          logo: {
            src: '/logo.svg',
            alt: 'AWS Certification Platform'
          }
        }}
        utilities={[
          {
            type: 'menu-dropdown',
            text: user?.name || 'Admin',
            description: user?.email,
            iconName: 'user-profile',
            items: [
              {
                id: 'profile',
                text: 'Profile'
              },
              {
                id: 'settings',
                text: 'Settings'
              },
              {
                id: 'signout',
                text: 'Sign out'
              }
            ],
            onItemClick: ({ detail }) => {
              if (detail.id === 'signout') {
                logout()
              }
            }
          }
        ]}
      />

      <AppLayout
        navigationOpen={true}
        navigation={
          <SideNavigation
            header={{
              href: '/admin',
              text: 'Admin Panel'
            }}
            items={navigationItems}
          />
        }
        content={
          <Routes>
            <Route path="/" element={<Navigate to="/admin/questions" replace />} />
            <Route path="/questions/*" element={<QuestionManager />} />
            <Route path="/templates" element={<ExamTemplatesPage />} />
            <Route path="/exams" element={<ActiveExamsPage />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/groups" element={<UserGroupsPage />} />
            <Route path="/analytics" element={<AnalyticsDashboardPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/question-analytics" element={<QuestionAnalyticsPage />} />
            <Route path="/settings" element={<SystemSettingsPage />} />
            <Route path="/audit" element={<AuditLogsPage />} />
          </Routes>
        }
        toolsHide={true}
      />
    </div>
  )
}

// Placeholder components for other admin pages
const ExamTemplatesPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="Manage exam templates and configurations">
        Exam Templates
      </Header>
    }
  >
    <Box>Exam Templates management will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

const ActiveExamsPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="Monitor active exam sessions">
        Active Exams
      </Header>
    }
  >
    <Box>Active exams monitoring will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

const UserManagementPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="Manage user accounts and permissions">
        User Management
      </Header>
    }
  >
    <Box>User management will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

const UserGroupsPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="Manage user groups and roles">
        User Groups
      </Header>
    }
  >
    <Box>User groups management will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

const AnalyticsDashboardPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="View platform analytics and insights">
        Analytics Dashboard
      </Header>
    }
  >
    <Box>Analytics dashboard will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

const ReportsPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="Generate and view reports">
        Reports
      </Header>
    }
  >
    <Box>Reports functionality will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

const QuestionAnalyticsPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="Analyze question performance and difficulty">
        Question Analytics
      </Header>
    }
  >
    <Box>Question analytics will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

const SystemSettingsPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="Configure system settings">
        System Settings
      </Header>
    }
  >
    <Box>System settings will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

const AuditLogsPage: React.FC = () => (
  <ContentLayout
    header={
      <Header variant="h1" description="View system audit logs">
        Audit Logs
      </Header>
    }
  >
    <Box>Audit logs will be implemented in upcoming tasks.</Box>
  </ContentLayout>
)

export default AdminPage