import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  SideNavigation,
  Badge
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'
import Logo from '@/components/common/Logo'

const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const navigationItems = [
    {
      type: 'link' as const,
      text: 'Dashboard',
      href: '/dashboard',
      info: <Badge color="blue">Home</Badge>
    },
    {
      type: 'divider' as const
    },
    {
      type: 'section' as const,
      text: 'Study & Practice',
      items: [
        {
          type: 'link' as const,
          text: 'Practice Mode',
          href: '/practice',
          info: <Badge color="green">Free</Badge>
        },
        {
          type: 'link' as const,
          text: 'Sample Questions',
          href: '/sample-questions',
          info: <Badge color="blue">New</Badge>
        },
        {
          type: 'link' as const,
          text: 'Mock Exams',
          href: '/exam',
          info: <Badge color="red">Timed</Badge>
        }
      ]
    },
    {
      type: 'divider' as const
    },
    {
      type: 'section' as const,
      text: 'Results & Progress',
      items: [
        {
          type: 'link' as const,
          text: 'My Results',
          href: '/results'
        },
        {
          type: 'link' as const,
          text: 'Progress Analytics',
          href: '/analytics'
        }
      ]
    },
    {
      type: 'divider' as const
    },
    {
      type: 'section' as const,
      text: 'Support',
      items: [
        {
          type: 'link' as const,
          text: 'Help & Documentation',
          href: '/help'
        }
      ]
    }
  ]

  // Add admin section if user is admin
  if (user?.role === 'admin') {
    navigationItems.push(
      {
        type: 'divider' as const
      },
      {
        type: 'section' as const,
        text: 'Administration',
        items: [
          {
            type: 'link' as const,
            text: 'Question Bank',
            href: '/admin/questions',
            info: <Badge color="red">Admin</Badge>
          },
          {
            type: 'link' as const,
            text: 'User Management',
            href: '/admin/users',
            info: <Badge color="red">Admin</Badge>
          },
          {
            type: 'link' as const,
            text: 'Analytics',
            href: '/admin/analytics',
            info: <Badge color="red">Admin</Badge>
          }
        ]
      }
    )
  }

  const handleFollow = (event: any) => {
    if (!event.detail.external) {
      event.preventDefault()
      navigate(event.detail.href)
    }
  }

  return (
    <SideNavigation
      activeHref={location.pathname}
      header={{
        href: '/dashboard',
        text: <Logo size="medium" />
      }}
      items={navigationItems}
      onFollow={handleFollow}
    />
  )
}

export default Navigation