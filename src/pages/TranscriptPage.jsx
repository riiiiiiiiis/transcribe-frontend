import Header from '../components/Header'
import TranscriptView from '../components/TranscriptView'

const TranscriptPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header с информацией о пользователе */}
      <Header />
      <TranscriptView />
    </div>
  )
}

export default TranscriptPage