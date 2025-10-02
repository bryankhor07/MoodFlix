import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAvailableMoods, prefetchSeedDetails } from '../lib/moodMap.js'

export default function NavBar({ onMoodSelect, onSearchToggle }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const moods = getAvailableMoods()

  const handleRandomMood = async () => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)]
    console.log(`Random mood selected: ${randomMood}`)
    
    try {
      const movies = await prefetchSeedDetails(randomMood, 8)
      
      if (movies.length === 0) {
        console.warn('No movies available for random mood. API may be temporarily unavailable.')
        // Still navigate to show the mood selection, even with no movies
        onMoodSelect?.(randomMood, [])
      } else {
        onMoodSelect?.(randomMood, movies)
      }
      
      navigate('/')
    } catch (error) {
      console.error('Error fetching random mood movies:', error)
      // Navigate anyway to show error state
      onMoodSelect?.(randomMood, [])
      navigate('/')
    }
  }

  const handleMoodSelect = async (mood) => {
    console.log(`Mood selected: ${mood}`)
    
    try {
      const movies = await prefetchSeedDetails(mood, 8)
      
      if (movies.length === 0) {
        console.warn(`No movies available for mood: ${mood}. API may be temporarily unavailable.`)
      }
      
      onMoodSelect?.(mood, movies)
      navigate('/')
    } catch (error) {
      console.error('Error fetching mood movies:', error)
      // Still navigate to show the mood, even if API failed
      onMoodSelect?.(mood, [])
      navigate('/')
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearchToggle?.(searchQuery.trim())
      setSearchQuery('')
      setIsSearchOpen(false)
      navigate('/')
    }
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    onSearchToggle?.()
  }

  return (
    <nav className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Name - Left */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-white hover:text-purple-300 transition-colors"
          >
            MoodFlix
          </Link>

          {/* Center - Search Bar (when open) */}
          {isSearchOpen && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
            </form>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Mood Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                <span>🎭</span>
                <span className="hidden sm:inline">Mood</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-lg border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <button
                    onClick={handleRandomMood}
                    className="w-full text-left px-4 py-2 text-purple-300 hover:bg-white/10 transition-colors font-semibold"
                  >
                    🎲 Random Mood
                  </button>
                  <div className="border-t border-white/10 my-2"></div>
                  {moods.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => handleMoodSelect(mood)}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors capitalize"
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Toggle */}
            <button
              onClick={toggleSearch}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              title="Search movies"
            >
              {isSearchOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>

            {/* Favorites Link */}
            <Link
              to="/favorites"
              className="flex items-center space-x-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              title="Favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
