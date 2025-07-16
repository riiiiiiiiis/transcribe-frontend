import { Clock, CheckCircle, Loader, AlertCircle, Play } from 'lucide-react'
import StarRating from './StarRating'

const VideoCard = ({ video, onClick }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing': return <Loader className="w-4 h-4 text-yellow-600 animate-spin" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <Play className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status, processingStage) => {
    switch(status) {
      case 'completed': return 'Готово'
      case 'processing': {
        switch(processingStage) {
          case 'downloading': return 'Загрузка видео...'
          case 'transcribing': return 'Транскрибация...'
          case 'generating_insights': return 'Генерация инсайтов...'
          default: return 'Обработка'
        }
      }
      case 'failed': return 'Ошибка'
      case 'pending': return 'Ожидание'
      default: return 'В очереди'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      case 'processing': return 'bg-blue-50 border-blue-200 hover:bg-blue-100'
      case 'failed': return 'bg-red-50 border-red-200 hover:bg-red-100'
      default: return 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return 'неизвестно'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const formatTimeAgo = (timestamp) => {
    const diffHours = Math.floor((new Date() - new Date(timestamp)) / (1000 * 60 * 60))
    if (diffHours < 1) return 'только что'
    if (diffHours < 24) return `${diffHours}ч назад`
    return new Date(timestamp).toLocaleDateString('ru-RU')
  }

  return (
    <div 
      className={`
        border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer
        ${getStatusColor(video.status)}
        ${video.status === 'completed' ? 'hover:shadow-md' : 'cursor-default'}
      `}
      onClick={() => video.status === 'completed' && onClick(video.id)}
    >
      <h3 className="font-medium text-base mb-1 text-gray-700 leading-tight font-mono">
        {video.title || 'Загрузка названия...'}
      </h3>
      
      {video.channel && (
        <p className="text-sm text-gray-600 mb-2">
          {video.channel} {video.view_count > 0 && `• ${(video.view_count / 1000).toFixed(0)}K просмотров`}
        </p>
      )}
      
      <div className="flex items-center gap-2 mb-2 text-gray-600">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{formatDuration(video.duration)}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(video.status)}
          {video.status !== 'completed' && (
            <span className="text-sm font-medium">
              {getStatusText(video.status, video.processing_stage)}
            </span>
          )}
          {video.status === 'completed' && video.insights && !video.insights.error && (
            <span className="text-blue-600 text-xs" title="Insights доступны">
              🧠
            </span>
          )}
        </div>
        
        <span className="text-xs text-gray-500">
          {formatTimeAgo(video.created_at)}
        </span>
      </div>

      {/* Rating display */}
      {video.status === 'completed' && (
        <div className="flex items-center justify-between">
          <StarRating 
            rating={video.rating || 0} 
            readonly={true} 
            size="sm"
          />
        </div>
      )}

      {video.error && (
        <div className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded">
          {video.error}
        </div>
      )}
    </div>
  )
}

export default VideoCard