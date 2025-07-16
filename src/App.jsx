import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import TranscriptPage from './pages/TranscriptPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transcript/:videoId" element={<TranscriptPage />} />
      </Routes>
    </Router>
  )
}

export default App