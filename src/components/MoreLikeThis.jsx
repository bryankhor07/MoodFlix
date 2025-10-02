import { useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import { lookupMovieById } from '../lib/omdb.js'

export default function MoreLikeThis({ genre, currentMovieId }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (genre) {
      fetchRecommendations(genre)
    }
  }, [genre, currentMovieId])

  const fetchRecommendations = async (genreName) => {
    setLoading(true)
    
    try {
      const { default: genreSeeds } = await import('../data/genreSeeds.json')
      
      const seeds = genreSeeds[genreName] || []
      
      if (seeds.length === 0) {
        console.log(`No seeds found for genre: ${genreName}`)
        setRecommendations([])
        setLoading(false)
        return
      }

      const filteredSeeds = seeds.filter(id => id !== currentMovieId)
      const shuffled = [...filteredSeeds].sort(() => Math.random() - 0.5)
      const selectedSeeds = shuffled.slice(0, 6)

      const batchSize = 3
      const movies = []

      for (let i = 0; i < selectedSeeds.length; i += batchSize) {
        const batch = selectedSeeds.slice(i, i + batchSize)
        
        const batchPromises = batch.map(async (imdbId) => {
          try {
            const movie = await lookupMovieById(imdbId, 'short')
            return movie
          } catch (error) {
            console.warn(`Failed to fetch recommendation ${imdbId}:`, error)
            return null
          }
        })

        const batchResults = await Promise.all(batchPromises)
        movies.push(...batchResults.filter(m => m !== null))

        if (i + batchSize < selectedSeeds.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      setRecommendations(movies)
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-2">More Like This</h2>
          <p className="text-purple-300 mb-6">Finding similar {genre} movies...</p>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mr-4"></div>
            <span className="text-purple-200 font-medium">Loading recommendations...</span>
          </div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">
              More Like This
            </h2>
            <p className="text-purple-300 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>Based on <span className="font-semibold text-white">{genre}</span> genre</span>
            </p>
          </div>
          <div className="text-purple-300 text-sm">
            {recommendations.length} movies
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {recommendations.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  )
}