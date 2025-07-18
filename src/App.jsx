import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContextProvider'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import TranscriptPage from './pages/TranscriptPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/transcript/:videoId" element={
            <ProtectedRoute>
              <TranscriptPage />
            </ProtectedRoute>
          } />
          {/* Перенаправление всех неизвестных маршрутов на главную */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App