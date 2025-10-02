/**
 * Mood to Genre Mapping System
 * 
 * This module handles the mapping of user moods to movie genres and provides
 * functions to fetch curated movie seeds based on those moods.
 */

import genreSeeds from '../data/genreSeeds.json'
import { lookupMovieById } from './omdb.js'

/**
 * Mood to Genre mapping
 * Each mood maps to one or more genres that match the emotional tone
 */
export const moodToGenres = {
  chill: ['Drama', 'Romance', 'Indie'],
  hype: ['Action', 'Adventure', 'Thriller'],
  sad: ['Drama', 'Romance'],
  nostalgic: ['Family', 'Drama', 'Musical', 'Comedy'],
  spooky: ['Horror', 'Thriller'],
  funny: ['Comedy', 'Family', 'Romance'],
  thoughtful: ['Documentary', 'Biography', 'Drama'],
}

/**
 * Get available moods
 * @returns {string[]} Array of available mood keys
 */
export function getAvailableMoods() {
  return Object.keys(moodToGenres)
}

/**
 * Get genres for a specific mood
 * @param {string} mood - The mood to get genres for
 * @returns {string[]} Array of genre names
 */
export function getGenresForMood(mood) {
  const normalizedMood = mood.toLowerCase().trim()
  return moodToGenres[normalizedMood] || []
}

/**
 * Get seed IMDb IDs for a specific mood
 * Combines seeds from all genres mapped to the mood and deduplicates
 * 
 * @param {string} mood - The mood to get seeds for
 * @param {number} count - Maximum number of IDs to return (default: 8)
 * @returns {string[]} Array of deduplicated IMDb IDs
 * 
 * @example
 * const seeds = getSeedIdsForMood('hype', 10)
 * // Returns ['tt0133093', 'tt0468569', 'tt0848228', ...]
 */
export function getSeedIdsForMood(mood, count = 8) {
  const genres = getGenresForMood(mood)
  
  if (genres.length === 0) {
    console.warn(`No genres found for mood: ${mood}`)
    return []
  }

  // Collect all seed IDs from the mapped genres
  const allSeeds = []
  
  genres.forEach(genre => {
    const genreSeeds_data = genreSeeds[genre]
    if (genreSeeds_data && Array.isArray(genreSeeds_data)) {
      allSeeds.push(...genreSeeds_data)
    } else {
      console.warn(`No seeds found for genre: ${genre}`)
    }
  })

  // Deduplicate using Set and return sliced array
  const uniqueSeeds = [...new Set(allSeeds)]
  
  // Shuffle the array to provide variety
  const shuffled = shuffleArray(uniqueSeeds)
  
  return shuffled.slice(0, count)
}

/**
 * Prefetch movie details for a specific mood
 * Fetches full movie details for seed IDs and returns ready-to-render objects
 * 
 * @param {string} mood - The mood to prefetch movies for
 * @param {number} count - Number of movies to fetch (default: 8)
 * @returns {Promise<Object[]>} Array of movie detail objects
 * 
 * @example
 * const movies = await prefetchSeedDetails('hype', 6)
 * // Returns [{ Title, Year, Genre, Poster, imdbID, ... }, ...]
 */
export async function prefetchSeedDetails(mood, count = 8) {
  const seedIds = getSeedIdsForMood(mood, count)
  
  if (seedIds.length === 0) {
    console.warn(`No seed IDs found for mood: ${mood}`)
    return []
  }

  console.log(`Prefetching ${seedIds.length} movies for mood: ${mood}`)

  // Fetch movies with retry logic and batch processing
  const batchSize = 3 // Limit concurrent requests to avoid rate limits
  const validMovies = []
  
  for (let i = 0; i < seedIds.length; i += batchSize) {
    const batch = seedIds.slice(i, i + batchSize)
    
    const moviePromises = batch.map(async (imdbId) => {
      try {
        const movie = await lookupMovieById(imdbId, 'short')
        return movie
      } catch (error) {
        console.error(`Failed to fetch movie ${imdbId}:`, error)
        return null
      }
    })

    // Wait for current batch to complete
    const batchResults = await Promise.all(moviePromises)
    const batchValidMovies = batchResults.filter(movie => movie !== null)
    validMovies.push(...batchValidMovies)

    // Add small delay between batches to be respectful to API
    if (i + batchSize < seedIds.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  console.log(`Successfully fetched ${validMovies.length}/${seedIds.length} movies for mood: ${mood}`)

  // If we got very few results due to API issues, provide fallback data
  if (validMovies.length === 0) {
    console.warn(`No movies fetched for mood: ${mood}. API may be unavailable.`)
    return createFallbackMovies(mood, seedIds.slice(0, count))
  }

  return validMovies
}

/**
 * Create fallback movie objects when API is unavailable
 * This provides basic movie data so the UI doesn't break completely
 */
function createFallbackMovies(mood, seedIds) {
  return seedIds.map(imdbId => ({
    imdbID: imdbId,
    Title: `Movie ${imdbId}`,
    Year: 'N/A',
    Poster: 'N/A',
    Genre: getGenresForMood(mood).join(', '),
    Plot: 'Movie details temporarily unavailable. Please try again later.',
    Type: 'movie',
    // Add a flag to indicate this is fallback data
    _isFallback: true
  }))
}

/**
 * Get random seed IDs from multiple genres
 * Useful for creating variety in recommendations
 * 
 * @param {string[]} genres - Array of genre names
 * @param {number} countPerGenre - Number of seeds per genre (default: 3)
 * @returns {string[]} Array of deduplicated IMDb IDs
 */
export function getRandomSeedsFromGenres(genres, countPerGenre = 3) {
  const allSeeds = []
  
  genres.forEach(genre => {
    const genreSeeds_data = genreSeeds[genre]
    if (genreSeeds_data && Array.isArray(genreSeeds_data)) {
      const shuffled = shuffleArray([...genreSeeds_data])
      allSeeds.push(...shuffled.slice(0, countPerGenre))
    }
  })

  // Deduplicate and return
  return [...new Set(allSeeds)]
}

/**
 * Get all available genres from the seeds data
 * @returns {string[]} Array of available genre names
 */
export function getAvailableGenres() {
  return Object.keys(genreSeeds)
}

/**
 * Get seed count for a specific genre
 * @param {string} genre - Genre name
 * @returns {number} Number of seeds available for the genre
 */
export function getSeedCountForGenre(genre) {
  const seeds = genreSeeds[genre]
  return seeds ? seeds.length : 0
}

/**
 * Validate if a mood is supported
 * @param {string} mood - Mood to validate
 * @returns {boolean} True if mood is supported
 */
export function isMoodSupported(mood) {
  const normalizedMood = mood.toLowerCase().trim()
  return normalizedMood in moodToGenres
}

/**
 * Get mood statistics
 * @returns {Object} Statistics about moods and genres
 */
export function getMoodStats() {
  const stats = {}
  
  Object.entries(moodToGenres).forEach(([mood, genres]) => {
    const totalSeeds = genres.reduce((total, genre) => {
      return total + getSeedCountForGenre(genre)
    }, 0)
    
    const uniqueSeeds = getSeedIdsForMood(mood, 1000).length // Get all unique seeds
    
    stats[mood] = {
      genres: genres.length,
      totalSeeds,
      uniqueSeeds,
      genreList: genres,
    }
  })
  
  return stats
}

/**
 * Utility function to shuffle an array
 * Uses Fisher-Yates shuffle algorithm
 * 
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
