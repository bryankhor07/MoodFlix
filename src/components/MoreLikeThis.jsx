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
      // Import genreSeeds dynamically
      const { default: genreSeeds } = await import('../data/genreSeeds.json')
      
      // Get seeds for this genre
      const seeds = genreSeeds[genreName] || []
      
      if (seeds.length === 0) {
        console.log(`No seeds found for genre: ${genreName}`)
        setRecommendations([])
        setLoading(false)
        return
      }

      // Filter out current movie and get random selection
      const filteredSeeds = seeds.filter(id => id !== currentMovieId)
      const shuffled = [...filteredSeeds].sort(() => Math.random() - 0.5)
      const selectedSeeds = shuffled.slice(0, 6) // Get 6 recommendations

      // Fetch movie details in batches
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

        // Small delay between batches
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
        <h2 className="text-3xl font-bold text-white mb-6">More Like This</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mr-4"></div>
          <span className="text-white">Finding similar movies...</span>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-6">
        More Like This
        <span className="text-purple-300 text-lg ml-3">({genre})</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {recommendations.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  )
}
