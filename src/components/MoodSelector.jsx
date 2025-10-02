import { useState } from 'react'
import { getAvailableMoods, getSeedIdsForMood, prefetchSeedDetails } from '../lib/moodMap.js'

export default function MoodSelector({ onMoodSelect, selectedMood, loading }) {
  const [customMood, setCustomMood] = useState('')
  const [isCustomMode, setIsCustomMode] = useState(false)

  const presetMoods = getAvailableMoods()

  const handlePresetMoodClick = async (mood) => {
    if (loading) return
    
    console.log(`Preset mood selected: ${mood}`)
    
    try {
      const movies = await prefetchSeedDetails(mood, 12)
      onMoodSelect(mood, movies)
    } catch (error) {
      console.error('Error fetching mood movies:', error)
      onMoodSelect(mood, [])
    }
  }

  const handleCustomMoodSubmit = async (e) => {
    e.preventDefault()
    if (!customMood.trim() || loading) return

    const mood = customMood.trim().toLowerCase()
    console.log(`Custom mood selected: ${mood}`)

    try {
      // For custom moods, we'll try to map to existing genres or use a fallback
      const movies = await prefetchSeedDetails(mood, 12)
      onMoodSelect(mood, movies)
      setCustomMood('')
      setIsCustomMode(false)
    } catch (error) {
      console.error('Error fetching custom mood movies:', error)
      onMoodSelect(mood, [])
    }
  }

  const handleRandomMood = async () => {
    if (loading) return
    
    const randomMood = presetMoods[Math.floor(Math.random() * presetMoods.length)]
    console.log(`Random mood selected: ${randomMood}`)
    
    try {
      const movies = await prefetchSeedDetails(randomMood, 12)
      onMoodSelect(randomMood, movies)
    } catch (error) {
      console.error('Error fetching random mood movies:', error)
      onMoodSelect(randomMood, [])
    }
  }

  const getMoodEmoji = (mood) => {
    const emojiMap = {
      chill: '😌',
      hype: '🔥',
      sad: '😢',
      nostalgic: '🌅',
      spooky: '👻',
      funny: '😂',
      thoughtful: '🤔'
    }
    return emojiMap[mood] || '🎭'
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        How are you feeling?
      </h2>

      {/* Preset Mood Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {presetMoods.map((mood) => (
          <button
            key={mood}
            onClick={() => handlePresetMoodClick(mood)}
            disabled={loading}
            className={`
              p-4 rounded-lg font-semibold transition-all duration-200 
              ${selectedMood === mood 
                ? 'bg-purple-600 text-white shadow-lg scale-105' 
                : 'bg-white/10 hover:bg-white/20 text-white hover:scale-102'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
            `}
          >
            <div className="text-2xl mb-1">{getMoodEmoji(mood)}</div>
            <div className="capitalize text-sm">{mood}</div>
          </button>
        ))}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
        {/* Random Mood Button */}
        <button
          onClick={handleRandomMood}
          disabled={loading}
          className={`
            px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
            text-white font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105'}
          `}
        >
          <span>🎲</span>
          <span>Random Mood</span>
        </button>

        {/* Custom Mood Toggle */}
        <button
          onClick={() => setIsCustomMode(!isCustomMode)}
          disabled={loading}
          className={`
            px-6 py-3 border-2 border-white/30 hover:border-white/50 text-white font-semibold 
            rounded-lg transition-all duration-200 flex items-center space-x-2
            ${isCustomMode ? 'bg-white/20' : 'hover:bg-white/10'}
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span>✏️</span>
          <span>Custom Mood</span>
        </button>
      </div>

      {/* Custom Mood Input */}
      {isCustomMode && (
        <form onSubmit={handleCustomMoodSubmit} className="mt-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={customMood}
              onChange={(e) => setCustomMood(e.target.value)}
              placeholder="Enter your mood (e.g., adventurous, romantic, mysterious...)"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!customMood.trim() || loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              Go
            </button>
          </div>
          <p className="text-purple-200 text-sm mt-2 text-center">
            We'll try to match your custom mood to our movie collection
          </p>
        </form>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
          <span className="text-white">Finding perfect movies for your mood...</span>
        </div>
      )}
    </div>
  )
}
