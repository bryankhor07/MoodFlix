import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { lookupMovieById } from '../lib/omdb.js'

export default function MovieDetails() {
  const { imdbID } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchMovieDetails()
  }, [imdbID])

  useEffect(() => {
    if (movie) {
      checkFavoriteStatus()
    }
  }, [movie])

  const fetchMovieDetails = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const movieData = await lookupMovieById(imdbID, 'full')
      if (movieData) {
        setMovie(movieData)
      } else {
        setError('Movie not found')
      }
    } catch (err) {
      setError('Failed to load movie details')
      console.error('Error fetching movie details:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem('moodflix-favorites') || '[]')
    setIsFavorite(favorites.some(fav => fav.imdbID === movie.imdbID))
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
          <p className="text-purple-200 mb-8">{error}</p>
          <Link 
            to="/" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (!movie) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Movies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[2/3] bg-gray-800 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
              {/* Title and Favorite Button */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{movie.Title}</h1>
                  <div className="flex items-center space-x-4 text-purple-200">
                    <span>{movie.Year}</span>
                    <span>•</span>
                    <span>{movie.Runtime}</span>
                    <span>•</span>
                    <span>{movie.Rated}</span>
                  </div>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg 
                    className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Genre Tags */}
              {movie.Genre && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.Genre.split(', ').map((genre, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-purple-600/50 text-purple-200 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-3">Plot</h2>
                  <p className="text-purple-200 leading-relaxed">{movie.Plot}</p>
                </div>
              )}

              {/* Movie Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Director</h3>
                    <p className="text-purple-200">{movie.Director}</p>
                  </div>
                )}

                {movie.Actors && movie.Actors !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Cast</h3>
                    <p className="text-purple-200">{movie.Actors}</p>
                  </div>
                )}

                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Writer</h3>
                    <p className="text-purple-200">{movie.Writer}</p>
                  </div>
                )}

                {movie.Language && movie.Language !== 'N/A' && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Language</h3>
                    <p className="text-purple-200">{movie.Language}</p>
                  </div>
                )}
              </div>

              {/* Ratings */}
              {movie.Ratings && movie.Ratings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Ratings</h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.Ratings.map((rating, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-3">
                        <p className="text-purple-300 text-sm font-medium">{rating.Source}</p>
                        <p className="text-white font-semibold">{rating.Value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
