import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Components
import NavBar from './components/NavBar'
import RouteTest from './components/RouteTest'
import ApiStatus from './components/ApiStatus'

// Pages
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Favorites from './pages/Favorites'

function App() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [moodMovies, setMoodMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleMoodSelect = (mood, movies) => {
    setSelectedMood(mood)
    setMoodMovies(movies)
    setSearchQuery('') // Clear search when mood is selected
  }

  const handleSearchToggle = (query) => {
    if (query) {
      setSearchQuery(query)
      setSelectedMood(null) // Clear mood when searching
      setMoodMovies([])
    } else {
      setSearchQuery('')
    }
  }

  return (
    <Router>
      <div className="min-h-screen">
        <NavBar 
          onMoodSelect={handleMoodSelect}
          onSearchToggle={handleSearchToggle}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                selectedMood={selectedMood}
                moodMovies={moodMovies}
                searchQuery={searchQuery}
              />
            } 
          />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        
        {/* Development Components - Remove in production */}
        <RouteTest />
        <ApiStatus />
      </div>
    </Router>
  )
}

export default App
