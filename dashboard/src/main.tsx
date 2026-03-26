import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FrappeProvider } from 'frappe-react-sdk'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FrappeProvider url='http://localhost:8001' enableSocket={false} >
      <App />
    </FrappeProvider>
  </StrictMode>,
)
