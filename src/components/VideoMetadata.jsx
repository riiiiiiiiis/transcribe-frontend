import { 
  Calendar, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Users, 
  Tag, 
  Monitor, 
  Volume2, 
  Clock,
  Globe,
  Shield,
  Play,
  List
} from 'lucide-react'

const VideoMetadata = ({ video }) => {
  if (!video) return null

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num?.toLocaleString() || '0'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Неизвестно'
    try {
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      return new Date(`${year}-${month}-${day}`).toLocaleDateString('ru-RU')
    } catch {
      return dateStr
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return 'Неизвестно'
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatBytes = (bytes) => {
    if (!bytes) return 'Неизвестно'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold serif text-slate-900 mb-4">
        Метаданные видео
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        
        {/* Основная статистика */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800 border-b pb-1">Статистика</h4>
          
          {video.view_count > 0 && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Просмотры:</span>
              <span className="font-medium">{formatNumber(video.view_count)}</span>
            </div>
          )}
          
          {video.like_count > 0 && (
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Лайки:</span>
              <span className="font-medium">{formatNumber(video.like_count)}</span>
            </div>
          )}
          
          {video.comment_count > 0 && (
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Комментарии:</span>
              <span className="font-medium">{formatNumber(video.comment_count)}</span>
            </div>
          )}
          
          {video.subscriber_count > 0 && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Подписчики:</span>
              <span className="font-medium">{formatNumber(video.subscriber_count)}</span>
            </div>
          )}
        </div>

        {/* Техническая информация */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800 border-b pb-1">Технические данные</h4>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">Длительность:</span>
            <span className="font-medium">{formatDuration(video.duration)}</span>
          </div>
          
          {video.resolution && (
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Разрешение:</span>
              <span className="font-medium">{video.resolution}</span>
            </div>
          )}
          
          {(video.width && video.height) && (
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Размер:</span>
              <span className="font-medium">{video.width}×{video.height}</span>
            </div>
          )}
          
          {video.fps > 0 && (
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">FPS:</span>
              <span className="font-medium">{video.fps}</span>
            </div>
          )}
          
          {(video.filesize || video.filesize_approx) && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Размер файла:</span>
              <span className="font-medium">{formatBytes(video.filesize || video.filesize_approx)}</span>
            </div>
          )}
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-800 border-b pb-1">Дополнительно</h4>
          
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600">Дата загрузки:</span>
            <span className="font-medium">{formatDate(video.upload_date)}</span>
          </div>
          
          {video.language && (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Язык:</span>
              <span className="font-medium">{video.language}</span>
            </div>
          )}
          
          {video.age_limit > 0 && (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Возрастное ограничение:</span>
              <span className="font-medium">{video.age_limit}+</span>
            </div>
          )}
          
          {video.live_status && (
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Статус:</span>
              <span className="font-medium">{video.live_status}</span>
            </div>
          )}
          
          {video.subtitles && video.subtitles.length > 0 && (
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Субтитры:</span>
              <span className="font-medium">{video.subtitles.slice(0, 3).join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Теги */}
      {video.tags && video.tags.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Теги:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {video.tags.slice(0, 10).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 10 && (
              <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs">
                +{video.tags.length - 10} еще
              </span>
            )}
          </div>
        </div>
      )}

      {/* Главы видео */}
      {video.chapters && video.chapters.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <List className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Главы:</span>
          </div>
          <div className="space-y-1">
            {video.chapters.slice(0, 5).map((chapter, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">{formatDuration(chapter.start_time)}</span>
                <span className="text-slate-700">{chapter.title}</span>
              </div>
            ))}
            {video.chapters.length > 5 && (
              <div className="text-xs text-slate-500">
                +{video.chapters.length - 5} глав еще
              </div>
            )}
          </div>
        </div>
      )}

      {/* Описание */}
      {video.description && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-800 mb-2">Описание:</h4>
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
            {video.description}
          </p>
        </div>
      )}
    </div>
  )
}

export default VideoMetadata