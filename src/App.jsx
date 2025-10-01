import { useState } from 'react'
import './App.css'
import { searchMoviesByTitle, lookupMovieById } from './lib/omdb.js'

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
            OMDb API Wrapper Test
          </h2>

          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={testSearch}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Test Search
            </button>
            <button
              onClick={testLookup}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Test Lookup
            </button>
          </div>

          {loading && <p className="text-white/80">Loading...</p>}

          {testResult && !loading && (
            <div className="bg-black/30 rounded-lg p-4 text-left overflow-auto max-h-96">
              <p className="text-purple-300 font-semibold mb-2">
                {testResult.type === 'search' ? 'Search Results:' : 'Movie Details:'}
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
