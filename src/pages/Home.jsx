import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchMoviesByTitle } from '../lib/omdb.js'

export default function Home({ selectedMood, moodMovies, searchQuery }) {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Handle search when searchQuery prop changes
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery)
    }
  }, [searchQuery])

  const handleSearch = async (query) => {
    setLoading(true)
    try {
      const results = await searchMoviesByTitle(query, 1)
      setSearchResults(results.movies || [])
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  // Determine what to display
  const displayMovies = searchQuery ? searchResults : moodMovies
  const displayTitle = searchQuery 
    ? `Search Results for "${searchQuery}"` 
    : selectedMood 
      ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Movies`
      : 'Welcome to MoodFlix'

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            {displayTitle}
          </h1>
          {!searchQuery && !selectedMood && (
            <p className="text-xl text-purple-200 mb-8">
              Choose a mood from the dropdown above to discover movies that match your vibe
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2">Loading movies...</p>
          </div>
        )}

        {/* Movies Grid */}
        {displayMovies && displayMovies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && displayMovies && displayMovies.length === 0 && searchQuery && (
          <div className="text-center text-white">
            <p className="text-xl mb-4">No movies found for "{searchQuery}"</p>
            <p className="text-purple-200">Try a different search term or browse by mood</p>
          </div>
        )}

        {/* API Error State */}
        {!loading && displayMovies && displayMovies.length === 0 && selectedMood && (
          <div className="text-center text-white">
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-8 max-w-2xl mx-auto">
              <svg className="w-16 h-16 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-2xl font-bold mb-4">API Temporarily Unavailable</h2>
              <p className="text-yellow-200 mb-4">
                The movie database is experiencing high traffic or temporary issues.
              </p>
              <p className="text-yellow-300 text-sm mb-6">
                This is common with free API tiers. Please try again in a few minutes.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Welcome State */}
        {!loading && !searchQuery && !selectedMood && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">How it works</h2>
              <div className="space-y-4 text-purple-200">
                <p>🎭 <strong>Choose a mood</strong> - Select from the dropdown or try "Random Mood"</p>
                <p>🔍 <strong>Search movies</strong> - Use the search icon to find specific titles</p>
                <p>❤️ <strong>Save favorites</strong> - Click the heart icon to save movies you love</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Check if movie is in favorites on mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('moodflix-favorites') || '[]')
    setIsFavorite(favorites.some(fav => fav.imdbID === movie.imdbID))
  }, [movie.imdbID])

  // Don't allow favoriting fallback movies
  const canFavorite = !movie._isFallback

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('moodflix-favorites') || '[]')
    
    if (isFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter(fav => fav.imdbID !== movie.imdbID)
      localStorage.setItem('moodflix-favorites', JSON.stringify(newFavorites))
      setIsFavorite(false)
    } else {
      // Add to favorites
      const newFavorites = [...favorites, movie]
      localStorage.setItem('moodflix-favorites', JSON.stringify(newFavorites))
      setIsFavorite(true)
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 group">
      <Link to={`/movie/${movie.imdbID}`} className="block">
        <div className="aspect-[2/3] relative overflow-hidden">
          {movie.Poster && movie.Poster !== 'N/A' ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
              </svg>
            </div>
          )}
          
          {/* Favorite Button Overlay */}
          {canFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite()
              }}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <svg 
                className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          )}

          {/* Fallback Data Indicator */}
          {movie._isFallback && (
            <div className="absolute top-2 right-2 p-2 bg-yellow-600/80 rounded-full">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/movie/${movie.imdbID}`}>
          <h3 className="font-semibold text-white mb-1 hover:text-purple-300 transition-colors line-clamp-2">
            {movie.Title}
          </h3>
        </Link>
        <p className="text-purple-200 text-sm">{movie.Year}</p>
        {movie.Genre && (
          <p className="text-purple-300 text-xs mt-1">{movie.Genre}</p>
        )}
      </div>
    </div>
  )
}
