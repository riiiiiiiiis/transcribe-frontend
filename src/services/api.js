const API_BASE = 'http://localhost:8002/api'

// Export API_BASE for use in other components
export { API_BASE }

// Получить список всех видео
export const getVideos = async () => {
  const response = await fetch(`${API_BASE}/videos/`)
  if (!response.ok) throw new Error('Ошибка загрузки списка видео')
  return response.json()
}

// Добавить новое видео
export const addVideo = async (url) => {
  const response = await fetch(`${API_BASE}/videos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  })
  if (!response.ok) throw new Error('Ошибка добавления видео')
  return response.json()
}

// Получить транскрипт конкретного видео
export const getTranscript = async (videoId) => {
  const response = await fetch(`${API_BASE}/videos/${videoId}`)
  if (!response.ok) throw new Error('Ошибка загрузки транскрипта')
  return response.json()
}

// Обновить статус видео (для отслеживания изменений)
export const getVideoStatus = async (videoId) => {
  const response = await fetch(`${API_BASE}/videos/${videoId}/status`)
  if (!response.ok) throw new Error('Ошибка получения статуса')
  return response.json()
}

// Установить рейтинг видео
export const setVideoRating = async (videoId, rating) => {
  const response = await fetch(`${API_BASE}/videos/${videoId}/rating`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating })
  })
  if (!response.ok) throw new Error('Ошибка установки рейтинга')
  return response.json()
}

// Регенерировать insights для видео
export const regenerateInsights = async (videoId) => {
  const response = await fetch(`${API_BASE}/videos/${videoId}/insights/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  if (!response.ok) throw new Error('Ошибка регенерации insights')
  return response.json()
}