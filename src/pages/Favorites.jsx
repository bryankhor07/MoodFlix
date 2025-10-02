import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'
import MovieCard from '../components/MovieCard'

export default function Favorites() {
  const { favorites, clearAllFavorites, getFavoriteCount, isLoading } = useFavorites()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Loading favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Your Favorites
          </h1>
          <p className="text-xl text-purple-200">
            Movies you've saved for later
          </p>
        </div>

        {/* Clear All Button */}
        {favorites.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={clearAllFavorites}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Clear All Favorites
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard 
                key={movie.imdbID} 
                movie={movie}
              />
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 max-w-2xl mx-auto">
              <svg className="w-24 h-24 text-purple-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-4">No favorites yet</h2>
              <p className="text-purple-200 mb-8">
                Start exploring movies and click the heart icon to save your favorites!
              </p>
              <Link 
                to="/" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Discover Movies
              </Link>
            </div>
          </div>
        )}

        {/* Share Favorites */}
        {favorites.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-2">Share Your Favorites</h3>
              <p className="text-purple-200 text-sm mb-4">
                You have {getFavoriteCount()} favorite{getFavoriteCount() !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => {
                  const titles = favorites.map(movie => movie.Title).join(', ')
                  navigator.clipboard.writeText(`Check out my favorite movies on MoodFlix: ${titles}`)
                  alert('Favorites list copied to clipboard!')
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Copy List to Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
