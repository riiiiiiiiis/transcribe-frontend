import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, Loader, AlertCircle, Play } from 'lucide-react'

const VideoTable = ({ videos }) => {
  const navigate = useNavigate()

  const handleVideoClick = (videoId, status) => {
    if (status === 'completed') {
      navigate(`/transcript/${videoId}`)
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing': return <Loader className="w-4 h-4 text-yellow-600 animate-spin" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <Play className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Готово'
      case 'processing': return 'Обработка'
      case 'failed': return 'Ошибка'
      case 'pending': return 'Ожидание'
      default: return 'В очереди'
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '—'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeAgo = (timestamp) => {
    const diffHours = Math.floor((new Date() - new Date(timestamp)) / (1000 * 60 * 60))
    if (diffHours < 1) return 'только что'
    if (diffHours < 24) return `${diffHours}ч назад`
    return new Date(timestamp).toLocaleDateString('ru-RU')
  }

  const formatViewCount = (viewCount) => {
    if (!viewCount || viewCount === 0) return '—'
    if (viewCount < 1000) return viewCount.toString()
    if (viewCount < 1000000) return `${(viewCount / 1000).toFixed(0)}K`
    return `${(viewCount / 1000000).toFixed(1)}M`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Канал
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Длительность
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Просмотры
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Добавлено
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {videos.map((video) => (
              <tr 
                key={video.id}
                className={`
                  hover:bg-gray-50 transition-colors
                  ${video.status === 'completed' ? 'cursor-pointer' : 'cursor-default'}
                `}
                onClick={() => handleVideoClick(video.id, video.status)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(video.status)}
                    <span className="text-sm font-medium text-gray-900">
                      {getStatusText(video.status)}
                    </span>
                    {video.status === 'completed' && video.insights && !video.insights.error && (
                      <span className="text-blue-600 text-xs" title="Insights доступны">
                        🧠
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-mono text-gray-900 max-w-xs truncate">
                    {video.title || 'Загрузка названия...'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {video.channel || '—'}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">
                    {formatDuration(video.duration)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {formatViewCount(video.view_count)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {formatTimeAgo(video.created_at)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VideoTable