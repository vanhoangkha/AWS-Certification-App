import React from 'react'
import ReactDOM from 'react-dom/client'
// Cloudscape Design System imports
import '@cloudscape-design/global-styles/index.css'

import App from './App-simple'
import './index.css'

// Configure Amplify (skip for demo mode)
console.log('Running in demo mode - Amplify configuration skipped')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)