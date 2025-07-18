import Header from '../components/Header'
import AddVideoForm from '../components/AddVideoForm'
import VideoGrid from '../components/VideoGrid'
import TimeSavedCounter from '../components/TimeSavedCounter'
import { useVideos } from '../hooks/useVideos'
import { useAuth } from '../hooks/useAuth'

const Dashboard = () => {
  const { videos, isLoading, error, refetch } = useVideos()
  const { user } = useAuth()

  const handleVideoAdded = () => {
    // Обновить список видео после добавления нового
    refetch()
  }

  const handleRetry = () => {
    refetch()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header с информацией о пользователе */}
      <Header />
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Welcome message */}
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-2">
            Добро пожаловать, {user?.email}!
          </p>
          <p className="text-gray-600">
            YouTube → Текст + AI-анализ за 3 минуты
          </p>
        </div>

        {/* Time Saved Counter */}
        <div className="flex items-center justify-center mb-6">
          <TimeSavedCounter videos={videos} />
        </div>

        {/* Add Video Form */}
        <AddVideoForm onVideoAdded={handleVideoAdded} />

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-700">Что-то пошло не так: {error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 text-sm text-orange-800 hover:text-orange-900 underline"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* Video Grid */}
        <VideoGrid videos={videos} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default Dashboard