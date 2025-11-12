// TEMP: verify Stripe publishable key at runtime
console.log('[PK]', (import.meta.env.VITE_STRIPE_PK || 'missing').slice(0, 12));
// @ts-ignore
window.__PK__ = import.meta.env.VITE_STRIPE_PK;
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
