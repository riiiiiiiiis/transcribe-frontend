import { supabase } from '../lib/supabase'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

// Export API_BASE for use in other components
export { API_BASE }

// Получить заголовки с токеном аутентификации
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers = {
    'Content-Type': 'application/json',
  }
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  
  return headers
}

// Обработка ответов API с проверкой аутентификации
const handleApiResponse = async (response) => {
  if (response.status === 401) {
    // Токен истек или недействителен
    console.warn('Токен аутентификации недействителен, выполняется выход из системы')
    await supabase.auth.signOut()
    throw new Error('Сессия истекла. Пожалуйста, войдите в систему снова.')
  }
  
  if (response.status === 403) {
    throw new Error('Доступ запрещен')
  }
  
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// Получить список всех видео
export const getVideos = async () => {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE}/videos/`, { headers })
  return handleApiResponse(response)
}

// Добавить новое видео
export const addVideo = async (url) => {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE}/videos/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url })
  })
  return handleApiResponse(response)
}

// Получить транскрипт конкретного видео
export const getTranscript = async (videoId) => {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE}/videos/${videoId}`, { headers })
  return handleApiResponse(response)
}

// Обновить статус видео (для отслеживания изменений)
export const getVideoStatus = async (videoId) => {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE}/videos/${videoId}/status`, { headers })
  return handleApiResponse(response)
}

// Установить рейтинг видео
export const setVideoRating = async (videoId, rating) => {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE}/videos/${videoId}/rating`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ rating })
  })
  return handleApiResponse(response)
}

// Регенерировать insights для видео
export const regenerateInsights = async (videoId) => {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE}/videos/${videoId}/insights/regenerate`, {
    method: 'POST',
    headers
  })
  return handleApiResponse(response)
}