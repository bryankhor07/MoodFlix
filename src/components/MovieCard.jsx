import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'

export default function MovieCard({ movie }) {
  const [imageError, setImageError] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  const canFavorite = !movie._isFallback
  const movieIsFavorite = isFavorite(movie.imdbID)

  const handleFavoriteToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!canFavorite) return
    toggleFavorite(movie)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.location.href = `/movie/${movie.imdbID}`
    }
  }

  const handleFavoriteKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      if (canFavorite) {
        toggleFavorite(movie)
      }
    }
  }

  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-400'
    const numRating = parseFloat(rating)
    if (numRating >= 8) return 'text-green-400'
    if (numRating >= 7) return 'text-yellow-400'
    if (numRating >= 6) return 'text-orange-400'
    return 'text-red-400'
  }

  const getImdbRating = () => {
    if (movie.imdbRating && movie.imdbRating !== 'N/A') {
      return movie.imdbRating
    }
    if (movie.Ratings) {
      const imdbRating = movie.Ratings.find(r => r.Source === 'Internet Movie Database')
      if (imdbRating) {
        return imdbRating.Value.split('/')[0]
      }
    }
    return null
  }

  const rating = getImdbRating()

  const getAccessibleDescription = () => {
    const parts = [movie.Title]
    if (movie.Year) parts.push(`Released ${movie.Year}`)
    if (movie.Runtime && movie.Runtime !== 'N/A') parts.push(`Runtime ${movie.Runtime}`)
    if (rating) parts.push(`IMDb rating ${rating}`)
    if (movie.Genre && movie.Genre !== 'N/A') parts.push(`Genres: ${movie.Genre}`)
    return parts.join(', ')
  }

  return (
    <article 
      className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 group hover:scale-105 hover:shadow-2xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-transparent"
      role="article"
      aria-label={`Movie: ${movie.Title}`}
    >
      <Link 
        to={`/movie/${movie.imdbID}`} 
        className="block focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset rounded-t-2xl"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label={`View details for ${movie.Title}`}
        aria-describedby={`movie-desc-${movie.imdbID}`}
      >
        {/* Poster Section */}
        <div className="aspect-[2/3] relative overflow-hidden">
          {movie.Poster && movie.Poster !== 'N/A' && !imageError ? (
            <img
              src={movie.Poster}
              alt={`${movie.Title} movie poster`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div 
              className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
              role="img"
              aria-label={`No poster available for ${movie.Title}`}
            >
              <div className="text-center text-gray-400">
                <svg 
                  className="w-16 h-16 mx-auto mb-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p className="text-xs">No Image</p>
              </div>
            </div>
          )}
          
          {/* Overlay with badges and favorite button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500">
            {/* Rating Badge */}
            {rating && (
              <div className="absolute top-3 left-3">
                <div 
                  className="bg-black/80 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center space-x-1.5 border border-yellow-500/30"
                  role="img"
                  aria-label={`IMDb rating: ${rating} out of 10`}
                >
                  <svg 
                    className="w-4 h-4 text-yellow-400 fill-current" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className={`text-sm font-bold ${getRatingColor(rating)}`}>
                    {rating}
                  </span>
                </div>
              </div>
            )}

            {/* Favorite Button */}
            {canFavorite && (
              <button
                onClick={handleFavoriteToggle}
                onKeyDown={handleFavoriteKeyDown}
                className="absolute top-3 right-3 p-2.5 bg-black/80 backdrop-blur-md rounded-full hover:bg-black/90 focus:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-300 border border-white/20 hover:scale-110"
                aria-label={movieIsFavorite ? `Remove ${movie.Title} from favorites` : `Add ${movie.Title} to favorites`}
                tabIndex={0}
              >
                <svg 
                  className={`w-5 h-5 transition-all duration-300 ${
                    movieIsFavorite 
                      ? 'text-red-500 fill-current scale-110' 
                      : 'text-white hover:text-red-400'
                  }`} 
                  fill={movieIsFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}

            {/* Fallback Data Indicator */}
            {movie._isFallback && (
              <div 
                className="absolute top-3 right-3 p-2 bg-yellow-600/90 backdrop-blur-md rounded-full border border-yellow-500/50" 
                role="img"
                aria-label="Limited movie data available"
              >
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            )}

            {/* Watch Now Button */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="w-full py-3 bg-white/20 backdrop-blur-md rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center space-x-2 border border-white/30">
                <span>View Details</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Movie Info Section */}
      <div className="p-5">
        <div id={`movie-desc-${movie.imdbID}`} className="sr-only">
          {getAccessibleDescription()}
        </div>

        {/* Movie Title */}
        <h3 className="font-bold text-white mb-3 line-clamp-2 leading-tight text-lg">
          <Link 
            to={`/movie/${movie.imdbID}`}
            className="hover:text-purple-300 focus:text-purple-300 focus:outline-none focus:underline transition-colors"
            tabIndex={-1}
          >
            {movie.Title}
          </Link>
        </h3>
        
        {/* Year and Runtime */}
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-purple-200 font-medium" aria-label={`Released in ${movie.Year}`}>
            {movie.Year}
          </span>
          {movie.Runtime && movie.Runtime !== 'N/A' && (
            <span className="text-purple-300 flex items-center space-x-1" aria-label={`Runtime: ${movie.Runtime}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{movie.Runtime}</span>
            </span>
          )}
        </div>
        
        {/* Genre Badges */}
        {movie.Genre && movie.Genre !== 'N/A' && (
          <div className="mb-3" role="group" aria-label="Movie genres">
            <div className="flex flex-wrap gap-2">
              {movie.Genre.split(', ').slice(0, 2).map((genre, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 rounded-full text-xs font-medium border border-purple-500/30"
                  role="text"
                >
                  {genre}
                </span>
              ))}
              {movie.Genre.split(', ').length > 2 && (
                <span 
                  className="px-3 py-1 bg-white/10 text-purple-300 rounded-full text-xs font-medium border border-white/20"
                  role="text"
                  aria-label={`${movie.Genre.split(', ').length - 2} more genres`}
                >
                  +{movie.Genre.split(', ').length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Plot Preview */}
        {movie.Plot && movie.Plot !== 'N/A' && movie.Plot.length > 0 && (
          <p className="text-purple-200/70 text-xs line-clamp-2 leading-relaxed" aria-label="Movie plot summary">
            {movie.Plot}
          </p>
        )}
      </div>
    </article>
  )
}