import { useState } from 'react'
import MoodSelector from '../components/MoodSelector'
import SearchBar from '../components/SearchBar'
import MovieCard from '../components/MovieCard'

export default function Home() {
  const [selectedMood, setSelectedMood] = useState('')
  const [moodMovies, setMoodMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleMoodSelect = (mood, movies) => {
    setSelectedMood(mood)
    setMoodMovies(movies)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleSearchResults = (results) => {
    setSearchResults(results)
    if (results.length > 0 || searchQuery) {
      setSelectedMood('')
      setMoodMovies([])
    }
  }

  const displayMovies = searchQuery ? searchResults : moodMovies
  const displayTitle = searchQuery 
    ? `Search Results for "${searchQuery}"` 
    : selectedMood 
      ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Movies`
      : null

  const showWelcome = !searchQuery && !selectedMood && !loading

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Welcome Header */}
        {showWelcome && (
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              What's Your Mood?
            </h1>
            <p className="text-xl text-purple-200/80 max-w-2xl mx-auto">
              Discover the perfect movie for any moment. Let your emotions guide your next cinematic adventure.
            </p>
          </div>
        )}

        {/* Results Header */}
        {displayTitle && (
          <div className="mb-8 bg-gradient-to-r from-white/5 to-transparent rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {displayTitle}
                </h1>
                <p className="text-purple-300 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                  <span>{displayMovies.length} movie{displayMovies.length !== 1 ? 's' : ''} found</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mood Selector */}
        <MoodSelector 
          onMoodSelect={handleMoodSelect}
          selectedMood={selectedMood}
          loading={loading}
        />

        {/* Search Bar */}
        <SearchBar 
          onSearchResults={handleSearchResults}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          loading={loading}
          setLoading={setLoading}
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
            <p className="text-white text-lg font-medium">
              {searchQuery ? 'Searching movies...' : 'Finding perfect movies for your mood...'}
            </p>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && displayMovies && displayMovies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {displayMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}

        {/* No Search Results */}
        {!loading && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto border border-white/10">
              <svg className="w-16 h-16 text-purple-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-4">No movies found</h2>
              <p className="text-purple-200 mb-4">
                No movies found for "{searchQuery}"
              </p>
              <p className="text-purple-300 text-sm">
                Try a different search term or browse by mood instead
              </p>
            </div>
          </div>
        )}

        {/* No Mood Results (API Error) */}
        {!loading && selectedMood && moodMovies.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-yellow-600/10 border border-yellow-500/30 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto">
              <svg className="w-16 h-16 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-4">API Temporarily Unavailable</h2>
              <p className="text-yellow-200 mb-4">
                The movie database is experiencing high traffic or temporary issues.
              </p>
              <p className="text-yellow-300 text-sm mb-6">
                This is common with free API tiers. Please try again in a few minutes.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-yellow-600/50"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Welcome Instructions */}
        {showWelcome && (
          <div className="text-center">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-8">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-white mb-3 text-lg">Choose Your Mood</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Select from preset moods or enter a custom mood to get personalized movie recommendations
                  </p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/50">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-white mb-3 text-lg">Search Movies</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Type any movie title to search our extensive database with detailed information
                  </p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/50">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-white mb-3 text-lg">Save Favorites</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">
                    Click the heart icon to save movies to your personal favorites collection
                  </p>
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