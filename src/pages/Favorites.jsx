import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = () => {
    const savedFavorites = JSON.parse(localStorage.getItem('moodflix-favorites') || '[]')
    setFavorites(savedFavorites)
  }

  const removeFavorite = (imdbID) => {
    const newFavorites = favorites.filter(movie => movie.imdbID !== imdbID)
    localStorage.setItem('moodflix-favorites', JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }

  const clearAllFavorites = () => {
    localStorage.removeItem('moodflix-favorites')
    setFavorites([])
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <FavoriteMovieCard 
                key={movie.imdbID} 
                movie={movie} 
                onRemove={removeFavorite}
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
                You have {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
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

function FavoriteMovieCard({ movie, onRemove }) {
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
          
          {/* Remove Button Overlay */}
          <button
            onClick={(e) => {
              e.preventDefault()
              onRemove(movie.imdbID)
            }}
            className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 rounded-full transition-colors"
            title="Remove from favorites"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
