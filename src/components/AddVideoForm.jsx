import { useState } from 'react'
import { Plus, Loader } from 'lucide-react'
import { addVideo } from '../services/api'

const AddVideoForm = ({ onVideoAdded }) => {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateYouTubeUrl = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|live\/)|youtu\.be\/)[a-zA-Z0-9_-]+/
    return regex.test(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateYouTubeUrl(url)) {
      setError('Пожалуйста, введите корректную ссылку на YouTube')
      return
    }

    setIsLoading(true)
    try {
      await addVideo(url)
      setUrl('')
      onVideoAdded()
      // Показать успешное уведомление
    } catch (error) {
      setError('Ошибка при добавлении видео: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... или youtu.be/... или youtube.com/live/..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            disabled={isLoading || !url}
            className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Добавляю...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Добавить
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default AddVideoForm