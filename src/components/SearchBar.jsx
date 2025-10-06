import { useState, useEffect, useCallback } from 'react'
import { searchMoviesByTitle, lookupMovieById } from '../lib/omdb.js'

export default function SearchBar({
  onSearchResults,
  searchQuery,
  setSearchQuery,
  loading,
  setLoading,
}) {
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 800)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery.trim())
    } else {
      onSearchResults([])
    }
  }, [debouncedQuery])

  const performSearch = useCallback(
    async (query) => {
      if (!query.trim()) return

      setLoading(true)
      console.log(`Searching for: ${query}`)

      try {
        const searchResults = await searchMoviesByTitle(query, 1)

        if (!searchResults.movies || searchResults.movies.length === 0) {
          onSearchResults([])
          setLoading(false)
          return
        }

        const moviesWithDetails = []
        const maxResults = Math.min(searchResults.movies.length, 12)

        const batchSize = 3
        for (let i = 0; i < maxResults; i += batchSize) {
          const batch = searchResults.movies.slice(i, i + batchSize)

          const batchPromises = batch.map(async (movie) => {
            try {
              const fullDetails = await lookupMovieById(movie.imdbID, 'short')
              return fullDetails || movie
            } catch (error) {
              console.warn(`Failed to get details for ${movie.imdbID}:`, error)
              return movie
            }
          })

          const batchResults = await Promise.all(batchPromises)
          moviesWithDetails.push(
            ...batchResults.filter((movie) => movie !== null)
          )

          if (i + batchSize < maxResults) {
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
        }

        console.log(
          `Search completed: ${moviesWithDetails.length} movies found for "${query}"`
        )
        onSearchResults(moviesWithDetails)
      } catch (error) {
        console.error('Search error:', error)
        onSearchResults([])
      } finally {
        setLoading(false)
      }
    },
    [onSearchResults, setLoading]
  )

  const clearSearch = () => {
    setSearchQuery('')
    onSearchResults([])
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/10">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Search Movies
      </h2>

      <div className="relative">
        <div className="flex items-center">
          {/* Search Icon */}
          <div className="absolute left-5 text-white/60 pointer-events-none">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies by title..."
            className="w-full pl-14 pr-14 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg backdrop-blur-sm transition-all duration-300 hover:border-white/30"
            disabled={loading}
          />

          {/* Loading Indicator */}
          {loading && searchQuery && (
            <div className="absolute right-14 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
            </div>
          )}

          {/* Clear Button */}
          {searchQuery && !loading && (
            <button
              onClick={clearSearch}
              className="absolute right-5 text-white/60 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
              disabled={loading}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Info */}
      <div className="mt-4 text-center">
        {searchQuery && !loading && (
          <p className="text-purple-200 text-sm flex items-center justify-center space-x-2">
            <svg
              className="w-4 h-4 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>
              {debouncedQuery
                ? `Searching for "${debouncedQuery}"...`
                : 'Type to search movies'}
            </span>
          </p>
        )}
        {!searchQuery && (
          <p className="text-purple-300/80 text-sm">
            Try searching for movies like "Inception", "The Matrix", or
            "Avengers"
          </p>
        )}
      </div>
    </div>
  )
}
