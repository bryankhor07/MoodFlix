/**
 * Manual test script for OMDb API wrapper
 * 
 * Usage: Uncomment the test functions in App.jsx or create a test page
 * This file serves as documentation for how to use the API functions
 */

import {
  searchMoviesByTitle,
  lookupMovieById,
  lookupMovieByTitle,
  clearCache,
  getCacheStats,
} from './omdb.js'

/**
 * Test searchMoviesByTitle
 */
export async function testSearch() {
  console.log('--- Testing searchMoviesByTitle ---')

  // Test with valid query
  const results = await searchMoviesByTitle('inception')
  console.log('Search results for "inception":', results)

  // Test with pagination
  const page2 = await searchMoviesByTitle('matrix', 2)
  console.log('Search results for "matrix" page 2:', page2)

  // Test with empty query
  const empty = await searchMoviesByTitle('')
  console.log('Search results for empty query:', empty)
}

/**
 * Test lookupMovieById
 */
export async function testLookupById() {
  console.log('--- Testing lookupMovieById ---')

  // Test with valid ID
  const movie = await lookupMovieById('tt0133093', 'short')
  console.log('Movie details for The Matrix:', movie)

  // Test caching (should be instant on second call)
  console.time('First lookup')
  await lookupMovieById('tt0468569')
  console.timeEnd('First lookup')

  console.time('Cached lookup')
  await lookupMovieById('tt0468569')
  console.timeEnd('Cached lookup')

  // Test with invalid ID
  const invalid = await lookupMovieById('tt0000000')
  console.log('Invalid ID result:', invalid)

  // Check cache stats
  console.log('Cache stats:', getCacheStats())
}

/**
 * Test lookupMovieByTitle
 */
export async function testLookupByTitle() {
  console.log('--- Testing lookupMovieByTitle ---')

  // Test with title only
  const movie1 = await lookupMovieByTitle('The Matrix')
  console.log('Lookup "The Matrix":', movie1)

  // Test with title and year
  const movie2 = await lookupMovieByTitle('The Matrix', 1999)
  console.log('Lookup "The Matrix" (1999):', movie2)

  // Test with non-existent movie
  const notFound = await lookupMovieByTitle('This Movie Does Not Exist 12345')
  console.log('Non-existent movie:', notFound)
}

/**
 * Run all tests
 */
export async function runAllTests() {
  await testSearch()
  await testLookupById()
  await testLookupByTitle()

  console.log('--- All tests complete ---')
  clearCache()
  console.log('Cache cleared')
}
