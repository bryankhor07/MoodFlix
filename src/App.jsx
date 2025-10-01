import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          MoodFlix
        </h1>
        <p className="text-xl text-purple-200 mb-8">
          Find movies that match your mood
        </p>
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md">
          <p className="text-white/90">
            ✨ TailwindCSS is working!
          </p>
          <p className="text-white/70 text-sm mt-2">
            React Router v6 and React Query are installed and ready.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
