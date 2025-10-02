import { Link, useNavigate } from 'react-router-dom'
import { getAvailableMoods, prefetchSeedDetails } from '../lib/moodMap.js'

export default function NavBar({ onMoodSelect, onSearchToggle }) {
  const navigate = useNavigate()

  const moods = getAvailableMoods()

  const handleRandomMood = async () => {
    const randomMood = moods[Math.floor(Math.random() * moods.length)]
    console.log(`Random mood selected: ${randomMood}`)
    
    try {
      const movies = await prefetchSeedDetails(randomMood, 8)
      
      if (movies.length === 0) {
        console.warn('No movies available for random mood. API may be temporarily unavailable.')
        onMoodSelect?.(randomMood, [])
      } else {
        onMoodSelect?.(randomMood, movies)
      }
      
      navigate('/')
    } catch (error) {
      console.error('Error fetching random mood movies:', error)
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
      onMoodSelect?.(mood, [])
      navigate('/')
    }
  }

  return (
    <nav className="bg-black/60 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Name - Left */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/50">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
              MoodFlix
            </h1>
          </Link>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Mood Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all duration-300 border border-white/10 hover:border-white/30">
                <span className="text-lg">🎭</span>
                <span className="hidden sm:inline font-medium">Mood</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={handleRandomMood}
                    className="w-full text-left px-4 py-3 text-purple-300 hover:bg-gradient-to-r hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-200 font-semibold flex items-center space-x-2"
                  >
                    <span>🎲</span>
                    <span>Random Mood</span>
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

            {/* Favorites Link */}
            <Link
              to="/favorites"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500/20 to-red-500/20 hover:from-pink-500/30 hover:to-red-500/30 backdrop-blur-sm rounded-xl text-white transition-all duration-300 border border-pink-500/30 hover:border-pink-500/50 shadow-lg shadow-pink-500/20"
              title="Favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="hidden sm:inline font-medium">Favorites</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}