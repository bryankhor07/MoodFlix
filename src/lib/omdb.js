/**
 * OMDb API Wrapper
 * 
 * This module provides a single source of truth for all OMDb API interactions.
 * 
 * RATE LIMITS & CACHING RECOMMENDATIONS:
 * - Free tier: 1,000 daily requests limit
 * - Consider implementing React Query with staleTime/cacheTime for component-level caching
 * - This module includes basic in-memory caching for lookupMovieById to prevent duplicate calls
 * - For production: consider localStorage caching or a more robust caching solution
 * 
 * API Documentation: https://www.omdbapi.com/
 */

const API_KEY = import.meta.env.VITE_OMDB_API_KEY
const BASE = 'https://www.omdbapi.com/'

// In-memory cache for movie details (prevents repeated lookupMovieById calls)
const movieCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Search for movies by title with pagination
 * 
 * @param {string} query - Movie title to search for
 * @param {number} page - Page number (default: 1, max: 100)
 * @returns {Promise<{movies: Array, totalResults: number}>} Search results
 * 
 * @example
 * const results = await searchMoviesByTitle('inception', 1)
 * // returns { movies: [...], totalResults: 15 }
 */
export async function searchMoviesByTitle(query, page = 1) {
  if (!API_KEY) {
    console.error('OMDb API key is not configured. Set VITE_OMDB_API_KEY in .env')
    return { movies: [], totalResults: 0 }
  }

  if (!query || query.trim() === '') {
    return { movies: [], totalResults: 0 }
  }

  try {
    const url = `${BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie&page=${page}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // OMDb returns Response: "False" with an Error field on failure
    if (data.Response === 'False') {
      console.warn(`OMDb search error: ${data.Error}`)
      return { movies: [], totalResults: 0 }
    }

    return {
      movies: data.Search || [],
      totalResults: parseInt(data.totalResults || '0', 10),
    }
  } catch (error) {
    console.error('Error searching movies by title:', error)
    return { movies: [], totalResults: 0 }
  }
}

/**
 * Lookup detailed movie information by IMDb ID
 * Includes in-memory caching to prevent duplicate API calls
 * 
 * @param {string} imdbID - IMDb ID (e.g., 'tt0133093')
 * @param {string} plot - Plot length: 'short' or 'full' (default: 'short')
 * @returns {Promise<Object|null>} Movie details or null on error
 * 
 * @example
 * const movie = await lookupMovieById('tt0133093', 'full')
 * // returns { Title, Year, Genre, Plot, Director, Actors, Ratings, ... }
 */
export async function lookupMovieById(imdbID, plot = 'short') {
  if (!API_KEY) {
    console.error('OMDb API key is not configured. Set VITE_OMDB_API_KEY in .env')
    return null
  }

  if (!imdbID) {
    console.warn('lookupMovieById called without imdbID')
    return null
  }

  // Check cache first
  const cacheKey = `${imdbID}_${plot}`
  const cached = movieCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    const url = `${BASE}?apikey=${API_KEY}&i=${imdbID}&plot=${plot}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // OMDb returns Response: "False" with an Error field on failure
    if (data.Response === 'False') {
      console.warn(`OMDb lookup error for ${imdbID}: ${data.Error}`)
      return null
    }

    // Cache the successful result
    movieCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    })

    return data
  } catch (error) {
    console.error(`Error looking up movie by ID (${imdbID}):`, error)
    return null
  }
}

/**
 * Lookup movie by exact title with optional year filter
 * 
 * @param {string} title - Exact movie title
 * @param {number|string} year - Release year (optional)
 * @returns {Promise<Object|null>} Movie details or null on error
 * 
 * @example
 * const movie = await lookupMovieByTitle('The Matrix', 1999)
 * // returns { Title, Year, Genre, Plot, imdbID, ... }
 */
export async function lookupMovieByTitle(title, year) {
  if (!API_KEY) {
    console.error('OMDb API key is not configured. Set VITE_OMDB_API_KEY in .env')
    return null
  }

  if (!title || title.trim() === '') {
    console.warn('lookupMovieByTitle called without title')
    return null
  }

  try {
    const yearParam = year ? `&y=${year}` : ''
    const url = `${BASE}?apikey=${API_KEY}&t=${encodeURIComponent(title)}${yearParam}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // OMDb returns Response: "False" with an Error field on failure
    if (data.Response === 'False') {
      console.warn(`OMDb lookup error for "${title}": ${data.Error}`)
      return null
    }

    return data
  } catch (error) {
    console.error(`Error looking up movie by title (${title}):`, error)
    return null
  }
}

/**
 * Clear the in-memory movie cache
 * Useful for testing or manual cache invalidation
 */
export function clearCache() {
  movieCache.clear()
}

/**
 * Get cache statistics (useful for debugging)
 */
export function getCacheStats() {
  return {
    size: movieCache.size,
    entries: Array.from(movieCache.keys()),
  }
}
