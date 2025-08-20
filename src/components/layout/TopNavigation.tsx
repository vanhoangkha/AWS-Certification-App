import React, { useState } from 'react'
import {
  TopNavigation as CloudscapeTopNavigation,
  ButtonDropdown,
  SpaceBetween,
  Badge
} from '@cloudscape-design/components'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Logo from '@/components/common/Logo'

const TopNavigation: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleUserMenuClick = (event: any) => {
    const { id } = event.detail
    
    switch (id) {
      case 'profile':
        navigate('/profile')
        break
      case 'settings':
        navigate('/settings')
        break
      case 'logout':
        logout()
        break
      default:
        break
    }
    
    setIsUserMenuOpen(false)
  }

  const userMenuItems = [
    {
      id: 'profile',
      text: 'Profile',
      iconName: 'user-profile'
    },
    {
      id: 'settings',
      text: 'Settings',
      iconName: 'settings'
    },
    {
      id: 'divider-1',
      itemType: 'divider' as const
    },
    {
      id: 'logout',
      text: 'Sign out',
      iconName: 'unlocked'
    }
  ]

  const utilities = [
    {
      type: 'button' as const,
      text: 'Notifications',
      iconName: 'notification',
      badge: true,
      onClick: () => {
        // Handle notifications
        console.log('Notifications clicked')
      }
    },
    {
      type: 'menu-dropdown' as const,
      text: user?.name || user?.email || 'User',
      iconName: 'user-profile',
      items: userMenuItems,
      onItemClick: handleUserMenuClick
    }
  ]

  return (
    <CloudscapeTopNavigation
      identity={{
        href: '/dashboard',
        title: <Logo size="medium" />
      }}
      utilities={utilities}
      i18nStrings={{
        searchIconAriaLabel: 'Search',
        searchDismissIconAriaLabel: 'Close search',
        overflowMenuTriggerText: 'More',
        overflowMenuTitleText: 'All',
        overflowMenuBackIconAriaLabel: 'Back',
        overflowMenuDismissIconAriaLabel: 'Close menu'
      }}
    />
  )
}

export default TopNavigation