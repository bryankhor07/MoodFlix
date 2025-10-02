/**
 * Development server for testing serverless functions locally
 * Run with: node server.js
 * 
 * This mimics the Vercel serverless environment for local development
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// In-memory cache for trailer results (same as serverless function)
const cache = new Map()
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

// Serverless function handler
const getTrailer = async (req, res) => {
  const { title, year } = req.query

  if (!title) {
    return res.status(400).json({ error: 'Missing required parameter: title' })
  }

  // Check cache first
  const cacheKey = `${title}|${year || ''}`
  const cached = cache.get(cacheKey)
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`✅ Cache hit for: ${title}`)
    return res.status(200).json({ 
      videoId: cached.videoId,
      cached: true,
      ...cached.metadata 
    })
  }

  // Read API key from environment (server-side only)
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY

  // If no API key, return null to trigger fallback
  if (!YOUTUBE_API_KEY) {
    console.log('⚠️  YouTube API key not configured, using fallback')
    return res.status(200).json({ videoId: null, fallback: true })
  }

  try {
    // Construct search query: "${title} official trailer ${year || ''}"
    const searchQuery = `${title} official trailer ${year || ''}`.trim()
    
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&videoDefinition=high&maxResults=5&key=${YOUTUBE_API_KEY}`

    const response = await fetch(youtubeUrl)
    
    if (!response.ok) {
      if (response.status === 403) {
        console.error('YouTube API quota exceeded or invalid key')
        return res.status(200).json({ videoId: null, fallback: true, error: 'quota_exceeded' })
      }
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      console.log(`❌ No YouTube results found for: ${searchQuery}`)
      // Cache the null result to avoid repeated failed searches
      cache.set(cacheKey, {
        videoId: null,
        timestamp: Date.now(),
        metadata: { fallback: true }
      })
      return res.status(200).json({ videoId: null, fallback: true })
    }

    // Find the best match - prioritize official trailers
    let bestMatch = data.items[0]
    
    for (const item of data.items) {
      const videoTitle = item.snippet.title.toLowerCase()
      const channelTitle = item.snippet.channelTitle.toLowerCase()
      
      // Prioritize videos with "official" or "trailer" in title/channel
      if (
        (videoTitle.includes('official') && videoTitle.includes('trailer')) ||
        channelTitle.includes('official') ||
        channelTitle.includes('movieclips') ||
        channelTitle.includes('trailers')
      ) {
        bestMatch = item
        break
      }
    }

    const videoId = bestMatch.id.videoId
    const metadata = {
      title: bestMatch.snippet.title,
      channelTitle: bestMatch.snippet.channelTitle,
      publishedAt: bestMatch.snippet.publishedAt
    }

    // Store in cache to avoid repeated API calls
    cache.set(cacheKey, {
      videoId,
      timestamp: Date.now(),
      metadata
    })

    console.log(`✅ Successfully fetched trailer for: ${title} - videoId: ${videoId}`)

    return res.status(200).json({
      videoId,
      ...metadata
    })

  } catch (error) {
    console.error('Error fetching YouTube trailer:', error)
    return res.status(200).json({ 
      videoId: null, 
      fallback: true,
      error: error.message 
    })
  }
}

// API Routes
app.get('/api/getTrailer', getTrailer)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Development API server running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on http://localhost:${PORT}`)
  console.log(`📺 Trailer endpoint: http://localhost:${PORT}/api/getTrailer?title=Inception&year=2010`)
  console.log('')
  console.log('Note: You need to set VITE_YOUTUBE_API_KEY in .env for trailer functionality')
  console.log('Without API key, the app will fallback to YouTube search links')
})
