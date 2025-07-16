import { useState } from 'react'
import { Star } from 'lucide-react'

const StarRating = ({ rating = 0, onRatingChange, readonly = false, size = 'md' }) => {
  const [hoveredRating, setHoveredRating] = useState(0)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue)
    }
  }

  const handleMouseEnter = (starValue) => {
    if (!readonly) {
      setHoveredRating(starValue)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0)
    }
  }

  const getStarColor = (starValue) => {
    const currentRating = hoveredRating || rating
    if (starValue <= currentRating) {
      return 'text-yellow-400 fill-yellow-400'
    }
    return 'text-gray-300'
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starValue) => (
        <button
          key={starValue}
          type="button"
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all ${sizeClasses[size]} ${getStarColor(starValue)}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
        >
          <Star className="w-full h-full" />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating}/5
        </span>
      )}
    </div>
  )
}

export default StarRating