import { useState, useEffect, useCallback } from 'react'
import { getVideos } from '../services/api'
import { getErrorMessage, isNetworkError, isAuthError } from '../utils/errorHandling'

export const useVideos = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const loadVideos = useCallback(async (isRetry = false) => {
    try {
      // Only show loading on initial load or manual retry
      if (videos.length === 0 || isRetry) {
        setIsLoading(true)
      }
      
      const data = await getVideos()
      
      setVideos(prevVideos => {
        // Only update if there are actual changes
        const hasChanges = JSON.stringify(prevVideos) !== JSON.stringify(data)
        
        if (!hasChanges) {
          return prevVideos; // No re-render if data is identical
        }
        
        console.log('Videos updated - changes detected')
        return data;
      })
      
      setError(null)
      setRetryCount(0) // Reset retry count on success
    } catch (err) {
      console.error('Error loading videos:', err)
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
      
      // Автоматическая повторная попытка для сетевых ошибок
      if (isNetworkError(err) && retryCount < 3) {
        console.log(`Автоматическая повторная попытка ${retryCount + 1}/3`)
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          loadVideos(true)
        }, 2000 * (retryCount + 1)) // Увеличиваем задержку с каждой попыткой
      }
    } finally {
      if (videos.length === 0 || isRetry) {
        setIsLoading(false)
      }
    }
  }, [videos.length, retryCount])

  useEffect(() => {
    loadVideos()
    
    // Listen for rating updates from TranscriptView
    const handleRatingUpdate = (event) => {
      const { videoId, rating } = event.detail
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { ...video, rating } 
            : video
        )
      )
    }
    
    window.addEventListener('video-rating-updated', handleRatingUpdate)
    
    // Автообновление каждые 3 секунды для отслеживания статусов
    const interval = setInterval(loadVideos, 3000)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('video-rating-updated', handleRatingUpdate)
    }
  }, [loadVideos])

  return {
    videos,
    isLoading,
    error,
    refetch: loadVideos
  }
}