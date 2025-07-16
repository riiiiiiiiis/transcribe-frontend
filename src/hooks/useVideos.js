import { useState, useEffect, useCallback } from 'react'
import { getVideos } from '../services/api'

export const useVideos = () => {
  const [videos, setVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadVideos = useCallback(async () => {
    try {
      // Only show loading on initial load
      if (videos.length === 0) {
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
    } catch (err) {
      setError(err.message)
    } finally {
      if (videos.length === 0) {
        setIsLoading(false)
      }
    }
  }, [videos.length])

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