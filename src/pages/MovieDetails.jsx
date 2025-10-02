import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { lookupMovieById } from '../lib/omdb.js'
import { useFavorites } from '../contexts/FavoritesContext'
import TrailerEmbed from '../components/TrailerEmbed'
import MoreLikeThis from '../components/MoreLikeThis'

export default function MovieDetails() {
  const { imdbID } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [trailerVideoId, setTrailerVideoId] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [loadingTrailer, setLoadingTrailer] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    fetchMovieDetails()
  }, [imdbID])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showTrailer) {
        setShowTrailer(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showTrailer])

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

  const fetchTrailer = async () => {
    if (!movie) return

    setLoadingTrailer(true)

    try {
      const response = await fetch(`/api/getTrailer?title=${encodeURIComponent(movie.Title)}&year=${movie.Year}`)
      const data = await response.json()

      if (data.videoId) {
        setTrailerVideoId(data.videoId)
        setShowTrailer(true)
      } else {
        const searchQuery = `${movie.Title} ${movie.Year} official trailer`
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank')
      }
    } catch (error) {
      console.error('Error fetching trailer:', error)
      const searchQuery = `${movie.Title} ${movie.Year} official trailer`
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank')
    } finally {
      setLoadingTrailer(false)
    }
  }

  const handleToggleFavorite = () => {
    if (movie) {
      toggleFavorite(movie)
    }
  }

  const getFirstGenre = () => {
    if (!movie || !movie.Genre || movie.Genre === 'N/A') return null
    return movie.Genre.split(', ')[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
          <p className="text-white text-xl font-medium">Loading movie details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
          <p className="text-purple-200 mb-8 text-lg">{error}</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-600/50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    )
  }

  if (!movie) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-purple-300 hover:text-white mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Back to Movies</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl sticky top-8">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              {/* Title and Favorite Button */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-white mb-4 leading-tight">{movie.Title}</h1>
                  <div className="flex items-center flex-wrap gap-3 text-purple-200">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">{movie.Year}</span>
                    {movie.Runtime && movie.Runtime !== 'N/A' && (
                      <>
                        <span className="text-white/30">•</span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{movie.Runtime}</span>
                        </span>
                      </>
                    )}
                    {movie.Rated && movie.Rated !== 'N/A' && (
                      <>
                        <span className="text-white/30">•</span>
                        <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-sm font-medium text-yellow-300">{movie.Rated}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 border border-white/20 hover:scale-110 ml-4"
                  aria-label={isFavorite(movie.imdbID) ? `Remove ${movie.Title} from favorites` : `Add ${movie.Title} to favorites`}
                >
                  <svg 
                    className={`w-7 h-7 transition-colors ${isFavorite(movie.imdbID) ? 'text-red-500 fill-current' : 'text-white'}`} 
                    fill={isFavorite(movie.imdbID) ? 'currentColor' : 'none'}
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Genre Tags */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {movie.Genre.split(', ').map((genre, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 rounded-full text-sm font-medium border border-purple-500/30"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Plot */}
              {movie.Plot && movie.Plot !== 'N/A' && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Plot</h2>
                  <p className="text-purple-200 leading-relaxed text-lg">{movie.Plot}</p>
                </div>
              )}

              {/* Watch Trailer Button */}
              <div className="mb-8">
                <button
                  onClick={fetchTrailer}
                  disabled={loadingTrailer}
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-red-800 disabled:to-pink-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-red-600/50 hover:scale-105"
                >
                  {loadingTrailer ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Loading Trailer...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                      <span>Watch Trailer</span>
                    </>
                  )}
                </button>
              </div>

              {/* Movie Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Director</h3>
                    <p className="text-white text-lg">{movie.Director}</p>
                  </div>
                )}

                {movie.Actors && movie.Actors !== 'N/A' && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Cast</h3>
                    <p className="text-white text-lg">{movie.Actors}</p>
                  </div>
                )}

                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Writer</h3>
                    <p className="text-white text-lg">{movie.Writer}</p>
                  </div>
                )}

                {movie.Language && movie.Language !== 'N/A' && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Language</h3>
                    <p className="text-white text-lg">{movie.Language}</p>
                  </div>
                )}
              </div>

              {/* Ratings */}
              {movie.Ratings && movie.Ratings.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ratings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {movie.Ratings.map((rating, index) => (
                      <div key={index} className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 text-center">
                        <p className="text-purple-300 text-sm font-semibold mb-2 uppercase tracking-wide">{rating.Source}</p>
                        <p className="text-white font-bold text-2xl">{rating.Value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More Like This Section */}
        {getFirstGenre() && (
          <div className="mt-12">
            <MoreLikeThis genre={getFirstGenre()} currentMovieId={movie.imdbID} />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerVideoId && (
        <TrailerEmbed 
          videoId={trailerVideoId} 
          title={movie.Title} 
          onClose={() => setShowTrailer(false)} 
        />
      )}

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}