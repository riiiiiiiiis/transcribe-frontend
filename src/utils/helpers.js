// Format duration from seconds to human readable format
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return 'неизвестно'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  }
  return `${minutes}m ${remainingSeconds}s`
}

// Format timestamp to relative time (e.g., "2 hours ago")
export const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMs = now - time
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  
  if (diffInMinutes < 1) return 'только что'
  if (diffInMinutes < 60) return `${diffInMinutes} минут назад`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} час${diffInHours > 1 ? 'ов' : ''} назад`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'день' : 'дней'} назад`
  
  return time.toLocaleDateString('ru-RU')
}

// Validate YouTube URL
export const isValidYouTubeUrl = (url) => {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/
  return regex.test(url)
}

// Extract video ID from YouTube URL
export const extractVideoId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return match ? match[1] : null
}

// Truncate text to specified length
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Get status color classes for Tailwind
export const getStatusColorClasses = (status) => {
  const statusColors = {
    'completed': 'bg-green-50 border-green-200 text-green-800',
    'processing': 'bg-yellow-50 border-yellow-200 text-yellow-800',
    'failed': 'bg-red-50 border-red-200 text-red-800',
    'pending': 'bg-blue-50 border-blue-200 text-blue-800',
    'queued': 'bg-gray-50 border-gray-200 text-gray-800'
  }
  
  return statusColors[status] || statusColors.queued
}