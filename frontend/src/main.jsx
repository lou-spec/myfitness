import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import LandingPage from './components/LandingPage'
import TrialExpired from './components/TrialExpired'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<App page="login" />} />
        <Route path="/register" element={<App page="register" />} />
        <Route path="/dashboard" element={<App page="dashboard" />} />
        <Route path="/trial-expired" element={<TrialExpired />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
