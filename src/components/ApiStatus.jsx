import { useState, useEffect } from 'react'
import { lookupMovieById } from '../lib/omdb.js'

export default function ApiStatus() {
  const [status, setStatus] = useState('checking') // 'checking', 'online', 'offline', 'limited'
  const [lastCheck, setLastCheck] = useState(null)

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    setStatus('checking')
    
    try {
      // Test with a well-known movie ID
      const testMovie = await lookupMovieById('tt0111161', 'short') // The Shawshank Redemption
      
      if (testMovie && testMovie.Title) {
        setStatus('online')
      } else {
        setStatus('limited')
      }
    } catch (error) {
      if (error.message.includes('503')) {
        setStatus('offline')
      } else if (error.message.includes('429')) {
        setStatus('limited')
      } else {
        setStatus('offline')
      }
    }
    
    setLastCheck(new Date())
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'checking':
        return {
          color: 'bg-gray-500',
          text: 'Checking API...',
          icon: '⏳'
        }
      case 'online':
        return {
          color: 'bg-green-500',
          text: 'API Online',
          icon: '✅'
        }
      case 'limited':
        return {
          color: 'bg-yellow-500',
          text: 'API Limited',
          icon: '⚠️'
        }
      case 'offline':
        return {
          color: 'bg-red-500',
          text: 'API Offline',
          icon: '❌'
        }
      default:
        return {
          color: 'bg-gray-500',
          text: 'Unknown',
          icon: '❓'
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-3 text-white text-xs z-40">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
        <span>{statusInfo.icon} {statusInfo.text}</span>
        <button
          onClick={checkApiStatus}
          className="ml-2 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs transition-colors"
        >
          Refresh
        </button>
      </div>
      {lastCheck && (
        <p className="text-gray-400 mt-1">
          Last check: {lastCheck.toLocaleTimeString()}
        </p>
      )}
    </div>
  )
}
