import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, List, ArrowUpDown } from 'lucide-react'
import VideoCard from './VideoCard'
import VideoTable from './VideoTable'

const VideoGrid = ({ videos, isLoading }) => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'
  const [sortBy, setSortBy] = useState('created_at') // 'created_at', 'rating', 'duration'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'

  const handleVideoClick = (videoId) => {
    navigate(`/transcript/${videoId}`)
  }

  // Sort videos
  const sortedVideos = [...(videos || [])].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'rating':
        aValue = a.rating || 0
        bValue = b.rating || 0
        break
      case 'duration':
        aValue = a.duration || 0
        bValue = b.duration || 0
        break
      case 'created_at':
      default:
        aValue = new Date(a.created_at || 0)
        bValue = new Date(b.created_at || 0)
        break
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('desc')
    }
  }

  if (isLoading && videos.length === 0) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-40"></div>
            ))}
          </div>
        ) : (
          <div className="animate-pulse bg-gray-200 rounded-lg h-60"></div>
        )}
      </div>
    )
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🎥</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Пока нет видео
        </h3>
        <p className="text-gray-600 mb-4">
          Добавьте первое YouTube видео для транскрипции
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Сортировка:</span>
            <button
              onClick={() => handleSortChange('created_at')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                sortBy === 'created_at' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Дата
              {sortBy === 'created_at' && <ArrowUpDown className="w-3 h-3" />}
            </button>
            <button
              onClick={() => handleSortChange('rating')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                sortBy === 'rating' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Рейтинг
              {sortBy === 'rating' && <ArrowUpDown className="w-3 h-3" />}
            </button>
            <button
              onClick={() => handleSortChange('duration')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1 ${
                sortBy === 'duration' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Длительность
              {sortBy === 'duration' && <ArrowUpDown className="w-3 h-3" />}
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          {videos.length} видео
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={handleVideoClick}
            />
          ))}
        </div>
      ) : (
        <VideoTable videos={sortedVideos} />
      )}
    </div>
  )
}

export default VideoGrid