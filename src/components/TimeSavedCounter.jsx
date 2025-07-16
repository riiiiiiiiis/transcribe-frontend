import { Clock } from 'lucide-react'

const TimeSavedCounter = ({ videos }) => {
  const calculateTimeSaved = () => {
    if (!videos || videos.length === 0) return 0
    
    // Sum up duration of all completed videos (duration is in seconds)
    const totalSeconds = videos
      .filter(video => video.status === 'completed' && video.duration)
      .reduce((total, video) => total + video.duration, 0)
    
    return totalSeconds
  }

  const formatTimeSaved = (totalSeconds) => {
    if (totalSeconds === 0) return '0 мин'
    
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м`
    }
    return `${minutes}м`
  }

  const timeSaved = calculateTimeSaved()
  const completedCount = videos?.filter(video => video.status === 'completed').length || 0

  if (completedCount === 0) return null

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-sm">
      <Clock className="w-4 h-4 text-green-600" />
      <span className="text-green-700 font-medium">
        Сэкономлено времени: {formatTimeSaved(timeSaved)}
      </span>
    </div>
  )
}

export default TimeSavedCounter