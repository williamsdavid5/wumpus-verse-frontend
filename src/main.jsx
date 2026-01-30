import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ConfirmProvider } from './contexts/ConfirmContext.jsx'
import { ExecutionProvider } from './contexts/ExecutionContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <ExecutionProvider>
      <ConfirmProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ConfirmProvider>
    </ExecutionProvider>
  </StrictMode>
)
