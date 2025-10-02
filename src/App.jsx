import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Context
import { FavoritesProvider } from './contexts/FavoritesContext'

// Components
import NavBar from './components/NavBar'
import RouteTest from './components/RouteTest'
import ApiStatus from './components/ApiStatus'
import AccessibilityTest from './components/AccessibilityTest'

// Pages
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Favorites from './pages/Favorites'

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen">
          <NavBar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:imdbID" element={<MovieDetails />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
          
          {/* Development Components - Remove in production */}
          {/* <RouteTest />
          <ApiStatus />
          <AccessibilityTest /> */}
        </div>
      </Router>
    </FavoritesProvider>
  )
}

export default App
