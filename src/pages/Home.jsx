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
    // Clear search when mood is selected
    setSearchQuery('')
    setSearchResults([])
  }

  const handleSearchResults = (results) => {
    setSearchResults(results)
    // Clear mood when searching
    if (results.length > 0 || searchQuery) {
      setSelectedMood('')
      setMoodMovies([])
    }
  }

  // Determine what to display
  const displayMovies = searchQuery ? searchResults : moodMovies
  const displayTitle = searchQuery 
    ? `Search Results for "${searchQuery}"` 
    : selectedMood 
      ? `${selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Movies`
      : null

  const showWelcome = !searchQuery && !selectedMood && !loading

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        {showWelcome && (
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4">
              Welcome to MoodFlix
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Discover movies that match your mood or search for specific titles
            </p>
          </div>
        )}

        {/* Results Header */}
        {displayTitle && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {displayTitle}
            </h1>
            <p className="text-purple-200">
              {displayMovies.length} movie{displayMovies.length !== 1 ? 's' : ''} found
            </p>
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p className="text-white text-lg">
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
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-2xl mx-auto">
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
            <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg p-8 max-w-2xl mx-auto">
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
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Welcome Instructions */}
        {showWelcome && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">How it works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-purple-200">
                <div className="text-center">
                  <div className="text-4xl mb-3">🎭</div>
                  <h3 className="font-semibold text-white mb-2">Choose Your Mood</h3>
                  <p className="text-sm">
                    Select from preset moods or enter a custom mood to get personalized movie recommendations
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="font-semibold text-white mb-2">Search Movies</h3>
                  <p className="text-sm">
                    Type any movie title to search our extensive database with detailed information
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">❤️</div>
                  <h3 className="font-semibold text-white mb-2">Save Favorites</h3>
                  <p className="text-sm">
                    Click the heart icon to save movies to your personal favorites collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
