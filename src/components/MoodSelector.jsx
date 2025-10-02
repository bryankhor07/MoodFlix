import { getAvailableMoods, getSeedIdsForMood, prefetchSeedDetails } from '../lib/moodMap.js'

export default function MoodSelector({ onMoodSelect, selectedMood, loading }) {
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

  const getMoodGradient = (mood) => {
    const gradientMap = {
      chill: 'from-blue-500 to-cyan-400',
      hype: 'from-orange-500 to-red-500',
      sad: 'from-indigo-500 to-blue-600',
      nostalgic: 'from-amber-500 to-orange-400',
      spooky: 'from-purple-600 to-indigo-700',
      funny: 'from-yellow-400 to-orange-400',
      thoughtful: 'from-teal-500 to-emerald-500'
    }
    return gradientMap[mood] || 'from-purple-500 to-pink-500'
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/10">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        How are you feeling today?
      </h2>

      {/* Preset Mood Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {presetMoods.map((mood) => (
          <button
            key={mood}
            onClick={() => handlePresetMoodClick(mood)}
            disabled={loading}
            className={`
              relative p-6 rounded-2xl font-semibold transition-all duration-300 overflow-hidden
              ${selectedMood === mood 
                ? `bg-gradient-to-br ${getMoodGradient(mood)} shadow-2xl scale-105 border-2 border-white/30` 
                : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 hover:scale-105'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
            `}
          >
            {selectedMood === mood && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
            )}
            <div className="relative z-10">
              <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{getMoodEmoji(mood)}</div>
              <div className="capitalize text-base text-white">{mood}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        {/* Random Mood Button */}
        <button
          onClick={handleRandomMood}
          disabled={loading}
          className={`
            px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
            text-white font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-purple-600/50
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-105'}
          `}
        >
          <span className="text-xl">🎲</span>
          <span>Random Mood</span>
        </button>
      </div>
      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center mt-6 animate-fadeIn">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400 mr-3"></div>
          <span className="text-white">Finding perfect movies for your mood...</span>
        </div>
      )}
    </div>
  )
}