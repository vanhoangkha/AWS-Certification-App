import React from 'react'
import { AppLayout as CloudscapeAppLayout } from '@cloudscape-design/components'
import Navigation from './Navigation'
import TopNavigation from './TopNavigation'

interface AppLayoutProps {
  children: React.ReactNode
  navigationHide?: boolean
  toolsHide?: boolean
  breadcrumbs?: React.ReactNode
  notifications?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  navigationHide = false,
  toolsHide = true,
  breadcrumbs,
  notifications
}) => {
  return (
    <>
      <TopNavigation />
      <CloudscapeAppLayout
        navigation={navigationHide ? undefined : <Navigation />}
        navigationHide={navigationHide}
        content={children}
        toolsHide={toolsHide}
        breadcrumbs={breadcrumbs}
        notifications={notifications}
        navigationWidth={280}
        maxContentWidth={1200}
      />
    </>
  )
}

export default AppLayout