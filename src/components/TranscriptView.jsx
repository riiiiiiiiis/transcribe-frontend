import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, ExternalLink, Clock, Calendar, Loader, Brain, Sparkles } from 'lucide-react'
import { getTranscript, API_BASE, setVideoRating, regenerateInsights } from '../services/api'
import ReactMarkdown from 'react-markdown'
import StarRating from './StarRating'
import VideoMetadata from './VideoMetadata'

// Component to render insights content in separate cards
const InsightsContent = ({ content }) => {
  // Split content by headings to create separate cards
  const sections = content.split(/(?=^# )/m).filter(section => section.trim())
  
  if (!sections.length) {
    return <div className="text-slate-600">Инсайты недоступны</div>
  }

  return (
    <div className="space-y-8">
      {/* Small cards in grid layout for sections with less content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.filter((section, index) => {
          const lines = section.trim().split('\n')
          const contentText = lines.slice(1).join('\n')
          return contentText.length < 500 // Short sections get grid layout
        }).map((section, index) => {
          const lines = section.trim().split('\n')
          const titleLine = lines[0]
          const isTitle = titleLine.startsWith('#')
          const title = isTitle ? titleLine.replace(/^#+\s*/, '') : `Раздел ${index + 1}`
          const contentText = isTitle ? lines.slice(1).join('\n') : section
          
          return (
            <div key={`grid-${index}`} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold serif text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                {title}
              </h3>
              
              <div className="prose prose-slate max-w-none prose-sm
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-2
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-ul:my-2 prose-ul:space-y-1
                prose-li:text-slate-600 prose-li:leading-relaxed
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                ">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => null,
                    h2: ({children}) => <h4 className="text-base font-semibold text-slate-800 mt-3 mb-2">{children}</h4>,
                    h3: ({children}) => <h5 className="text-sm font-semibold text-slate-700 mt-2 mb-1">{children}</h5>,
                    ul: ({children}) => <ul className="space-y-1">{children}</ul>,
                    li: ({children}) => (
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="flex-1">{children}</span>
                      </li>
                    ),
                    strong: ({children}) => (
                      <strong className="font-semibold text-slate-900">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {contentText}
                </ReactMarkdown>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full-width cards for longer sections */}
      <div className="space-y-6">
        {sections.filter((section, index) => {
          const lines = section.trim().split('\n')
          const contentText = lines.slice(1).join('\n')
          return contentText.length >= 500 // Long sections get full width
        }).map((section, index) => {
          const lines = section.trim().split('\n')
          const titleLine = lines[0]
          const isTitle = titleLine.startsWith('#')
          const title = isTitle ? titleLine.replace(/^#+\s*/, '') : `Раздел ${index + 1}`
          const contentText = isTitle ? lines.slice(1).join('\n') : section
          
          return (
            <div key={`full-${index}`} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold serif text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                {title}
              </h3>
              
              <div className="prose prose-slate max-w-none
                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-3
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ul:space-y-2
                prose-li:text-slate-700 prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
                prose-blockquote:bg-blue-50 prose-blockquote:py-3 prose-blockquote:pr-3 prose-blockquote:rounded-r-lg
                prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                prose-a:text-blue-600 hover:prose-a:text-blue-800
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                ">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => null,
                    h2: ({children}) => <h4 className="text-lg font-semibold text-blue-800 mt-4 mb-2">{children}</h4>,
                    h3: ({children}) => <h5 className="text-base font-semibold text-blue-700 mt-3 mb-2">{children}</h5>,
                    ul: ({children}) => <ul className="space-y-2">{children}</ul>,
                    li: ({children}) => (
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="flex-1">{children}</span>
                      </li>
                    ),
                    strong: ({children}) => (
                      <strong className="font-semibold text-slate-900 bg-yellow-100 px-1 rounded">
                        {children}
                      </strong>
                    ),
                  }}
                >
                  {contentText}
                </ReactMarkdown>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TranscriptView = () => {
  const { videoId } = useParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [generatingInsights, setGeneratingInsights] = useState(false)
  const [regeneratingInsights, setRegeneratingInsights] = useState(false)
  const [insightsError, setInsightsError] = useState(null)
  const [isUpdatingRating, setIsUpdatingRating] = useState(false)
  const [regenerationProgress, setRegenerationProgress] = useState(null)

  // Ref to track active polling timeouts for cleanup
  const pollingTimeoutRef = useRef(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    loadTranscript()
    
    // Cleanup function to cancel polling when component unmounts
    return () => {
      isMountedRef.current = false
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current)
        pollingTimeoutRef.current = null
      }
    }
  }, [videoId])

  const loadTranscript = async () => {
    try {
      const data = await getTranscript(videoId)
      setVideo(data)
    } catch (error) {
      console.error('Ошибка загрузки транскрипта:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(video.transcript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Ошибка копирования:', error)
    }
  }

  // Enhanced polling logic for regeneration tracking
  const handleInsightsGeneration = async (isRegeneration = false) => {
    if (!video || !video.transcript) return
    
    // Prevent multiple simultaneous operations
    if (generatingInsights || regeneratingInsights) return
    
    // Store original insights for preservation during regeneration
    const originalInsights = isRegeneration ? video.insights : null
    
    try {
      // Clear any previous errors
      setInsightsError(null)
      
      // Set appropriate loading state
      if (isRegeneration) {
        setRegeneratingInsights(true)
        setRegenerationProgress({ attempts: 0, maxAttempts: 90, message: 'Запуск регенерации...' })
      } else {
        setGeneratingInsights(true)
      }
      
      // Call appropriate API endpoint
      let response
      if (isRegeneration) {
        response = await regenerateInsights(videoId)
      } else {
        response = await fetch(`${API_BASE}/videos/${videoId}/insights`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!response.ok) {
          throw new Error('Ошибка генерации insights')
        }
      }
      
      // Enhanced polling with different timeouts and intervals for regeneration
      let attempts = 0
      const maxAttempts = isRegeneration ? 90 : 60 // Longer timeout for regeneration (90 seconds)
      const pollInterval = isRegeneration ? 2000 : 1000 // Slower polling for regeneration (2 seconds)
      let lastInsightsTimestamp = originalInsights?.updated_at || null
      
      const pollForInsights = async () => {
        try {
          const updatedVideo = await getTranscript(videoId)
          console.log(`Polling for ${isRegeneration ? 'regeneration' : 'generation'}, attempt ${attempts + 1}/${maxAttempts}`)
          
          // Update progress for regeneration
          if (isRegeneration) {
            const progressPercent = Math.round((attempts / maxAttempts) * 100)
            setRegenerationProgress({
              attempts: attempts + 1,
              maxAttempts,
              message: `Регенерация insights... (${progressPercent}%)`
            })
          }
          
          // For regeneration, check if insights have been updated
          if (isRegeneration) {
            // Check if insights have been updated (new timestamp or different content)
            const hasNewInsights = updatedVideo.insights && (
              !lastInsightsTimestamp || 
              updatedVideo.insights.updated_at !== lastInsightsTimestamp ||
              JSON.stringify(updatedVideo.insights) !== JSON.stringify(originalInsights)
            )
            
            if (hasNewInsights) {
              console.log('Regeneration completed - insights updated')
              setVideo(updatedVideo)
              
              // Check if there's an error in the new insights
              if (updatedVideo.insights.error) {
                setInsightsError(updatedVideo.insights.error)
              }
              
              setRegeneratingInsights(false)
              setRegenerationProgress(null)
              return
            }
          } else {
            // For initial generation, check if insights exist
            if (updatedVideo.insights) {
              console.log('Initial generation completed - insights created')
              setVideo(updatedVideo)
              
              // Check if there's an error in the insights
              if (updatedVideo.insights.error) {
                setInsightsError(updatedVideo.insights.error)
              }
              
              setGeneratingInsights(false)
              return
            }
          }
          
          attempts++
          if (attempts < maxAttempts && isMountedRef.current) {
            pollingTimeoutRef.current = setTimeout(pollForInsights, pollInterval)
          } else {
            console.log(`Timeout reached after ${attempts} attempts, stopping polling`)
            
            // Handle timeout - preserve original insights for regeneration
            if (isRegeneration && originalInsights) {
              console.log('Regeneration timeout - preserving original insights')
              setVideo(prev => ({
                ...prev,
                insights: originalInsights
              }))
              setInsightsError('Таймаут регенерации insights. Исходные insights сохранены. Попробуйте еще раз.')
            } else {
              const timeoutMessage = isRegeneration 
                ? 'Таймаут регенерации insights. Попробуйте еще раз.' 
                : 'Таймаут генерации insights. Попробуйте обновить страницу.'
              setInsightsError(timeoutMessage)
            }
            
            setGeneratingInsights(false)
            setRegeneratingInsights(false)
            setRegenerationProgress(null)
          }
        } catch (error) {
          console.error('Ошибка опроса insights:', error)
          
          // Preserve original insights on polling error during regeneration
          if (isRegeneration && originalInsights) {
            console.log('Polling error during regeneration - preserving original insights')
            setVideo(prev => ({
              ...prev,
              insights: originalInsights
            }))
            setInsightsError('Ошибка при регенерации insights. Исходные insights сохранены.')
          } else {
            const errorMessage = isRegeneration 
              ? 'Ошибка при регенерации insights' 
              : 'Ошибка при генерации insights'
            setInsightsError(errorMessage)
          }
          
          setGeneratingInsights(false)
          setRegeneratingInsights(false)
          setRegenerationProgress(null)
        }
      }
      
      // Start polling with a small delay to allow backend processing to begin
      if (isMountedRef.current) {
        pollingTimeoutRef.current = setTimeout(pollForInsights, 1000)
      }
      
    } catch (error) {
      console.error('Ошибка обработки insights:', error)
      
      // Preserve original insights on API error during regeneration
      if (isRegeneration && originalInsights) {
        console.log('API error during regeneration - preserving original insights')
        setVideo(prev => ({
          ...prev,
          insights: originalInsights
        }))
        setInsightsError('Не удалось запустить регенерацию insights. Исходные insights сохранены.')
      } else {
        const errorMessage = isRegeneration 
          ? 'Не удалось запустить регенерацию insights' 
          : 'Не удалось запустить генерацию insights'
        setInsightsError(errorMessage)
      }
      
      setGeneratingInsights(false)
      setRegeneratingInsights(false)
    }
  }

  // Wrapper functions for clarity
  const generateInsights = () => handleInsightsGeneration(false)
  const handleRegenerateInsights = () => handleInsightsGeneration(true)

  const handleRatingChange = async (newRating) => {
    if (!video || isUpdatingRating) return
    
    try {
      setIsUpdatingRating(true)
      await setVideoRating(videoId, newRating)
      
      // Update local video state
      setVideo(prev => ({
        ...prev,
        rating: newRating
      }))
      
      // Trigger a global refetch to update the main page
      // This will ensure the rating shows up when user navigates back
      window.dispatchEvent(new CustomEvent('video-rating-updated', { 
        detail: { videoId, rating: newRating } 
      }))
      
    } catch (error) {
      console.error('Ошибка обновления рейтинга:', error)
    } finally {
      setIsUpdatingRating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка транскрипта...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Транскрипт не найден</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          Вернуться к списку
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Fixed Table of Contents */}
      <nav className="toc-fixed glass-effect rounded-xl p-6 shadow-xl">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к списку
        </button>
        
        <h3 className="font-bold text-lg mb-4 serif text-slate-800">Содержание</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#video-info" className="text-blue-600 hover:text-blue-800 transition-colors font-semibold">
              Информация о видео
            </a>
          </li>
          {video?.insights && !video.insights.error && (
            <li>
              <a href="#insights" className="text-slate-600 hover:text-blue-600 transition-colors">
                Анализ контента
              </a>
            </li>
          )}
          <li>
            <a href="#transcript" className="text-slate-600 hover:text-blue-600 transition-colors">
              Транскрипт
            </a>
          </li>
        </ul>
        
        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          {/* Initial insights generation button */}
          {video && video.transcript && !video.insights && (
            <button
              onClick={generateInsights}
              disabled={generatingInsights}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                generatingInsights
                  ? 'bg-purple-400 text-white cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:transform hover:-translate-y-0.5'
              }`}
            >
              {generatingInsights ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Генерация insights...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Получить insights
                </>
              )}
            </button>
          )}

          {/* Regeneration button - shown when insights exist */}
          {video && video.transcript && video.insights && (
            <button
              onClick={handleRegenerateInsights}
              disabled={regeneratingInsights}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                regeneratingInsights
                  ? 'bg-orange-400 text-white cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg hover:transform hover:-translate-y-0.5'
              }`}
            >
              {regeneratingInsights ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Регенерация insights...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Регенерировать insights
                </>
              )}
            </button>
          )}
          
          <button
            onClick={copyToClipboard}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:transform hover:-translate-y-0.5'
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Скопировано!' : 'Скопировать текст'}
          </button>

          {/* Regeneration progress display */}
          {regenerationProgress && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Loader className="w-4 h-4 animate-spin text-orange-600" />
                <p className="text-orange-700 text-sm font-medium">{regenerationProgress.message}</p>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((regenerationProgress.attempts / regenerationProgress.maxAttempts) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-orange-600 text-xs mt-1">
                {regenerationProgress.attempts}/{regenerationProgress.maxAttempts} попыток
              </p>
            </div>
          )}

          {/* Error display */}
          {insightsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{insightsError}</p>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation - Only shown on mobile */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </button>
          
          <div className="flex gap-2">
            {/* Initial insights generation button for mobile */}
            {video && video.transcript && !video.insights && (
              <button
                onClick={generateInsights}
                disabled={generatingInsights}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  generatingInsights
                    ? 'bg-purple-400 text-white cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {generatingInsights ? <Loader className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              </button>
            )}

            {/* Regeneration button for mobile */}
            {video && video.transcript && video.insights && (
              <button
                onClick={handleRegenerateInsights}
                disabled={regeneratingInsights}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  regeneratingInsights
                    ? 'bg-orange-400 text-white cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {regeneratingInsights ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
            )}
            
            <button
              onClick={copyToClipboard}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Mobile regeneration progress display */}
        {regenerationProgress && (
          <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Loader className="w-4 h-4 animate-spin text-orange-600" />
              <p className="text-orange-700 text-sm font-medium">{regenerationProgress.message}</p>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((regenerationProgress.attempts / regenerationProgress.maxAttempts) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-orange-600 text-xs mt-1">
              {regenerationProgress.attempts}/{regenerationProgress.maxAttempts} попыток
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="main-content">

        {/* Video Info - Compact */}
        <section id="video-info" className="mb-12">
          <div className="hero-gradient rounded-xl p-6 text-white shadow-lg mb-6">
            <h1 className="text-3xl font-bold serif leading-tight mb-4">
              {video.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-between gap-6 text-blue-100">
              <div className="flex flex-wrap items-center gap-6">
                {video.channel && (
                  <span className="font-medium">{video.channel}</span>
                )}
                {video.view_count > 0 && (
                  <span>
                    {video.view_count >= 1000000 
                      ? `${(video.view_count / 1000000).toFixed(1)}M` 
                      : video.view_count >= 1000 
                      ? `${(video.view_count / 1000).toFixed(0)}K` 
                      : video.view_count} просмотров
                  </span>
                )}
                <span>{Math.floor(video.duration / 60)}m {video.duration % 60}s</span>
                {video.url && (
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    YouTube
                  </a>
                )}
              </div>
              
              {/* Rating section */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-blue-200">Ваш рейтинг:</span>
                <StarRating 
                  rating={video.rating || 0}
                  onRatingChange={handleRatingChange}
                  readonly={isUpdatingRating}
                  size="md"
                />
              </div>
            </div>
          </div>
          
          {/* Extended Video Metadata */}
          <VideoMetadata video={video} />
        </section>

        {/* Insights Section */}
        {video.insights && !video.insights.error && (
          <section id="insights" className="mb-16">
            <h2 className="text-3xl font-bold serif text-slate-900 mb-8">Анализ контента</h2>
            
            <InsightsContent content={video.insights.markdown_content || video.insights.summary || ''} />
          </section>
        )}

        {/* Insights Error */}
        {video.insights && video.insights.error && (
          <section className="mb-16">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-lg mb-3 serif text-orange-800">
                Анализ контента недоступен
              </h4>
              <p className="text-orange-700">
                {video.insights.error}
              </p>
            </div>
          </section>
        )}

        {/* Additional error display for regeneration failures */}
        {insightsError && (
          <section className="mb-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-lg mb-3 serif text-red-800">
                Ошибка обработки insights
              </h4>
              <p className="text-red-700">
                {insightsError}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setInsightsError(null)}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Скрыть ошибку
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Transcript Section */}
        <section id="transcript" className="mb-16">
          <h2 className="text-3xl font-bold serif text-slate-900 mb-6">
            Транскрипт
            <span className="text-lg font-normal text-slate-600 ml-4">
              {Math.floor(video.transcript?.length / 1000 || 0)}K символов
            </span>
          </h2>
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="whitespace-pre-wrap text-slate-800 leading-relaxed font-mono text-sm bg-slate-50 p-6 rounded-lg border border-slate-200 max-h-96 overflow-y-auto">
              {video.transcript}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default TranscriptView