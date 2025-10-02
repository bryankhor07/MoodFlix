import { useState } from 'react'
import './App.css'
import { searchMoviesByTitle, lookupMovieById } from './lib/omdb.js'
import { getSeedIdsForMood, prefetchSeedDetails, getAvailableMoods, getMoodStats } from './lib/moodMap.js'

function App() {
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testSearch = async () => {
    setLoading(true)
    const result = await searchMoviesByTitle('inception')
    setTestResult({ type: 'search', data: result })
    setLoading(false)
  }

  const testLookup = async () => {
    setLoading(true)
    const result = await lookupMovieById('tt0133093', 'short')
    setTestResult({ type: 'lookup', data: result })
    setLoading(false)
  }

  const testMoodSeeds = async () => {
    setLoading(true)
    const seeds = getSeedIdsForMood('hype', 8)
    setTestResult({ type: 'mood-seeds', data: { mood: 'hype', seeds } })
    setLoading(false)
  }

  const testPrefetch = async () => {
    setLoading(true)
    const movies = await prefetchSeedDetails('chill', 4)
    setTestResult({ type: 'prefetch', data: { mood: 'chill', movies } })
    setLoading(false)
  }

  const testMoodStats = async () => {
    setLoading(true)
    const stats = getMoodStats()
    const moods = getAvailableMoods()
    setTestResult({ type: 'mood-stats', data: { moods, stats } })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-bold text-white mb-4">MoodFlix</h1>
        <p className="text-xl text-purple-200 mb-8">
          Find movies that match your mood
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 mb-4">
          <p className="text-white/90 mb-2">✨ TailwindCSS is working!</p>
          <p className="text-white/70 text-sm">
            React Router v6 and React Query are installed and ready.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            API & Mood System Tests
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={testSearch}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              Test Search
            </button>
            <button
              onClick={testLookup}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              Test Lookup
            </button>
            <button
              onClick={testMoodSeeds}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              Test Mood Seeds
            </button>
            <button
              onClick={testPrefetch}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              Test Prefetch
            </button>
            <button
              onClick={testMoodStats}
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-800 text-white px-4 py-2 rounded-lg font-semibold transition text-sm col-span-2"
            >
              Test Mood Stats
            </button>
          </div>

          {loading && <p className="text-white/80">Loading...</p>}

          {testResult && !loading && (
            <div className="bg-black/30 rounded-lg p-4 text-left overflow-auto max-h-96">
              <p className="text-purple-300 font-semibold mb-2">
                {testResult.type === 'search' && 'Search Results:'}
                {testResult.type === 'lookup' && 'Movie Details:'}
                {testResult.type === 'mood-seeds' && `Mood Seeds (${testResult.data.mood}):`}
                {testResult.type === 'prefetch' && `Prefetched Movies (${testResult.data.mood}):`}
                {testResult.type === 'mood-stats' && 'Mood Statistics:'}
              </p>
              <pre className="text-white/90 text-xs">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
