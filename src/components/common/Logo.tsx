import React from 'react'
import { Box } from '@cloudscape-design/components'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizeMap = {
    small: { width: '24px', height: '24px', fontSize: 'body-s' },
    medium: { width: '32px', height: '32px', fontSize: 'body-m' },
    large: { width: '48px', height: '48px', fontSize: 'heading-m' }
  }

  const { width, height, fontSize } = sizeMap[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width,
          height,
          background: 'linear-gradient(135deg, #FF9900 0%, #FF6600 100%)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: size === 'small' ? '12px' : size === 'medium' ? '16px' : '20px'
        }}
      >
        AWS
      </div>
      {showText && (
        <Box fontSize={fontSize} fontWeight="bold" color="text-label">
          Cert Platform
        </Box>
      )}
    </div>
  )
}

export default Logo