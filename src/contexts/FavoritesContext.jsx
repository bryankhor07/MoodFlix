import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('moodflix-favorites')
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites)
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : [])
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
      setFavorites([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('moodflix-favorites', JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    }
  }, [favorites, isLoading])

  const addFavorite = (movie) => {
    if (!movie || !movie.imdbID) {
      console.warn('Cannot add favorite: invalid movie object', movie)
      return false
    }

    // Check if already in favorites
    if (favorites.some(fav => fav.imdbID === movie.imdbID)) {
      console.log('Movie already in favorites:', movie.Title)
      return false
    }

    // Create a clean favorite object with essential metadata
    const favoriteMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Genre: movie.Genre,
      Runtime: movie.Runtime,
      imdbRating: movie.imdbRating,
      Plot: movie.Plot,
      Type: movie.Type || 'movie',
      addedAt: new Date().toISOString()
    }

    setFavorites(prev => [...prev, favoriteMovie])
    console.log('Added to favorites:', movie.Title)
    return true
  }

  const removeFavorite = (imdbID) => {
    if (!imdbID) {
      console.warn('Cannot remove favorite: invalid imdbID')
      return false
    }

    const movieToRemove = favorites.find(fav => fav.imdbID === imdbID)
    if (!movieToRemove) {
      console.log('Movie not in favorites:', imdbID)
      return false
    }

    setFavorites(prev => prev.filter(fav => fav.imdbID !== imdbID))
    console.log('Removed from favorites:', movieToRemove.Title)
    return true
  }

  const toggleFavorite = (movie) => {
    if (!movie || !movie.imdbID) {
      console.warn('Cannot toggle favorite: invalid movie object')
      return false
    }

    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID)
    
    if (isFavorite) {
      return removeFavorite(movie.imdbID)
    } else {
      return addFavorite(movie)
    }
  }

  const isFavorite = (imdbID) => {
    return favorites.some(fav => fav.imdbID === imdbID)
  }

  const clearAllFavorites = () => {
    setFavorites([])
    console.log('Cleared all favorites')
  }

  const getFavoriteCount = () => {
    return favorites.length
  }

  const getFavoritesByGenre = () => {
    const genreMap = {}
    favorites.forEach(movie => {
      if (movie.Genre && movie.Genre !== 'N/A') {
        const genres = movie.Genre.split(', ')
        genres.forEach(genre => {
          if (!genreMap[genre]) {
            genreMap[genre] = []
          }
          genreMap[genre].push(movie)
        })
      }
    })
    return genreMap
  }

  const value = {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    getFavoriteCount,
    getFavoritesByGenre
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
