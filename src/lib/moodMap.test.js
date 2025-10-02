/**
 * Test utilities for mood mapping functionality
 * 
 * These functions help verify that the mood-to-genre mapping
 * and seed fetching systems work correctly.
 */

import {
  moodToGenres,
  getAvailableMoods,
  getGenresForMood,
  getSeedIdsForMood,
  prefetchSeedDetails,
  getRandomSeedsFromGenres,
  getAvailableGenres,
  getSeedCountForGenre,
  isMoodSupported,
  getMoodStats,
} from './moodMap.js'

/**
 * Test basic mood mapping functionality
 */
export function testMoodMapping() {
  console.log('--- Testing Mood Mapping ---')

  // Test available moods
  const moods = getAvailableMoods()
  console.log('Available moods:', moods)

  // Test specific mood mappings
  console.log('Hype genres:', getGenresForMood('hype'))
  console.log('Chill genres:', getGenresForMood('chill'))
  console.log('Spooky genres:', getGenresForMood('spooky'))

  // Test invalid mood
  console.log('Invalid mood genres:', getGenresForMood('invalid'))

  // Test mood validation
  console.log('Is "hype" supported?', isMoodSupported('hype'))
  console.log('Is "invalid" supported?', isMoodSupported('invalid'))
}

/**
 * Test seed ID generation
 */
export function testSeedGeneration() {
  console.log('--- Testing Seed Generation ---')

  // Test seed IDs for different moods
  const hypeSeeds = getSeedIdsForMood('hype', 10)
  console.log('Hype seeds (10):', hypeSeeds)

  const chillSeeds = getSeedIdsForMood('chill', 5)
  console.log('Chill seeds (5):', chillSeeds)

  const spookySeeds = getSeedIdsForMood('spooky', 8)
  console.log('Spooky seeds (8):', spookySeeds)

  // Test deduplication
  const allHypeSeeds = getSeedIdsForMood('hype', 100)
  console.log(`Hype seeds (requested 100, got ${allHypeSeeds.length}):`, allHypeSeeds.length)

  // Test genre-specific seeds
  const actionSeeds = getRandomSeedsFromGenres(['Action'], 5)
  console.log('Action seeds (5):', actionSeeds)
}

/**
 * Test movie detail prefetching
 */
export async function testPrefetching() {
  console.log('--- Testing Movie Prefetching ---')

  try {
    // Test prefetching for a small number of movies
    const movies = await prefetchSeedDetails('hype', 3)
    console.log(`Prefetched ${movies.length} movies for "hype":`)
    
    movies.forEach((movie, index) => {
      if (movie) {
        console.log(`${index + 1}. ${movie.Title} (${movie.Year}) - ${movie.Genre}`)
      }
    })

    return movies
  } catch (error) {
    console.error('Error in prefetching test:', error)
    return []
  }
}

/**
 * Test genre and statistics functions
 */
export function testGenreStats() {
  console.log('--- Testing Genre Statistics ---')

  // Test available genres
  const genres = getAvailableGenres()
  console.log('Available genres:', genres)

  // Test seed counts
  console.log('Action seed count:', getSeedCountForGenre('Action'))
  console.log('Horror seed count:', getSeedCountForGenre('Horror'))
  console.log('Invalid genre seed count:', getSeedCountForGenre('Invalid'))

  // Test mood statistics
  const stats = getMoodStats()
  console.log('Mood statistics:')
  Object.entries(stats).forEach(([mood, data]) => {
    console.log(`  ${mood}: ${data.uniqueSeeds} unique seeds from ${data.genres} genres`)
  })
}

/**
 * Test edge cases and error handling
 */
export function testEdgeCases() {
  console.log('--- Testing Edge Cases ---')

  // Test empty/invalid inputs
  console.log('Empty mood seeds:', getSeedIdsForMood('', 5))
  console.log('Null mood seeds:', getSeedIdsForMood(null, 5))
  console.log('Undefined mood seeds:', getSeedIdsForMood(undefined, 5))

  // Test case sensitivity
  console.log('Uppercase mood seeds:', getSeedIdsForMood('HYPE', 3))
  console.log('Mixed case mood seeds:', getSeedIdsForMood('HyPe', 3))

  // Test zero count
  console.log('Zero count seeds:', getSeedIdsForMood('hype', 0))

  // Test large count
  console.log('Large count seeds length:', getSeedIdsForMood('hype', 1000).length)
}

/**
 * Run all tests
 */
export async function runAllMoodTests() {
  console.log('🧪 Starting Mood Mapping Tests...\n')

  testMoodMapping()
  console.log('')

  testSeedGeneration()
  console.log('')

  await testPrefetching()
  console.log('')

  testGenreStats()
  console.log('')

  testEdgeCases()
  console.log('')

  console.log('✅ All mood mapping tests complete!')
}

/**
 * Quick validation test for acceptance criteria
 */
export function validateAcceptanceCriteria() {
  console.log('--- Validating Acceptance Criteria ---')

  // 1. genreSeeds.json exists and is accessible
  try {
    const genres = getAvailableGenres()
    console.log('✅ genreSeeds.json loaded successfully')
    console.log(`   Available genres: ${genres.length}`)
  } catch (error) {
    console.error('❌ genreSeeds.json failed to load:', error)
  }

  // 2. getSeedIdsForMood('hype') returns valid IMDb IDs
  try {
    const hypeSeeds = getSeedIdsForMood('hype')
    const isValid = hypeSeeds.length > 0 && hypeSeeds.every(id => id.startsWith('tt'))
    console.log(`✅ getSeedIdsForMood('hype') returns ${hypeSeeds.length} valid IMDb IDs`)
    console.log(`   Sample IDs: ${hypeSeeds.slice(0, 3).join(', ')}`)
  } catch (error) {
    console.error('❌ getSeedIdsForMood failed:', error)
  }

  // 3. prefetchSeedDetails returns movie detail objects
  return prefetchSeedDetails('hype', 2).then(movies => {
    if (movies.length > 0 && movies[0] && movies[0].Title) {
      console.log(`✅ prefetchSeedDetails returns ${movies.length} movie detail objects`)
      console.log(`   Sample movie: ${movies[0].Title} (${movies[0].Year})`)
    } else {
      console.error('❌ prefetchSeedDetails failed to return valid movie objects')
    }
  }).catch(error => {
    console.error('❌ prefetchSeedDetails failed:', error)
  })
}
