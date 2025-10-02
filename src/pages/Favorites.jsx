import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'
import MovieCard from '../components/MovieCard'

export default function Favorites() {
  const { favorites, clearAllFavorites, getFavoriteCount, isLoading } = useFavorites()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
          <p className="text-white text-xl font-medium">Loading favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-pink-500/20 border border-pink-500/30 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-pink-300 font-medium">Your Collection</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-pink-200 to-red-200 bg-clip-text text-transparent">
            Your Favorites
          </h1>
          <p className="text-xl text-purple-200/80">
            {favorites.length > 0 
              ? `${getFavoriteCount()} movie${getFavoriteCount() !== 1 ? 's' : ''} you've saved for later`
              : 'Movies you save will appear here'
            }
          </p>
        </div>

        {/* Action Buttons */}
        {favorites.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <button
              onClick={clearAllFavorites}
              className="px-6 py-3 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50 text-red-300 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Clear All</span>
            </button>

            <button
              onClick={() => {
                const titles = favorites.map(movie => movie.Title).join(', ')
                navigator.clipboard.writeText(`Check out my favorite movies on MoodFlix: ${titles}`)
                alert('Favorites list copied to clipboard!')
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-blue-600/50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share List</span>
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
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-12 max-w-2xl mx-auto border border-white/10">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/50">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">No favorites yet</h2>
              <p className="text-purple-200 mb-8 text-lg">
                Start exploring movies and click the heart icon to save your favorites!
              </p>
              
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-600/50 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Discover Movies</span>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Card */}
        {favorites.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Your Collection Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-4xl font-bold text-purple-400 mb-2">{favorites.length}</div>
                  <div className="text-purple-200 text-sm">Total Movies</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-4xl font-bold text-pink-400 mb-2">
                    {favorites.filter(m => m.imdbRating && parseFloat(m.imdbRating) >= 8).length}
                  </div>
                  <div className="text-purple-200 text-sm">High Rated (8+)</div>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {new Set(favorites.flatMap(m => m.Genre ? m.Genre.split(', ') : [])).size}
                  </div>
                  <div className="text-purple-200 text-sm">Unique Genres</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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