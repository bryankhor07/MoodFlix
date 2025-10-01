# MoodFlix 🎬✨

**Find movies that match your mood.**

MoodFlix is a modern web application that suggests movies based on your current mood. Whether you're feeling chill, hype, sad, or nostalgic, MoodFlix maps your emotions to curated movie recommendations powered by the OMDb API.

## Features

- 🎭 **Mood-based recommendations** - Select from preset moods or enter custom moods
- 🎬 **Movie discovery** - Search by title or browse curated suggestions
- 📺 **Trailer previews** - Watch trailers via embedded YouTube player
- ⭐ **Favorites & Watchlist** - Save movies to your personal collection (localStorage)
- 🔗 **Shareable links** - Share your favorite movies with friends
- 💡 **Smart recommendations** - "More like this" suggestions based on genre

## Tech Stack

- **Framework:** Vite + React (JavaScript)
- **Styling:** TailwindCSS
- **Routing:** React Router v6
- **Data Fetching:** React Query (@tanstack/react-query)
- **APIs:** OMDb API, YouTube Data API
- **Deployment:** Vercel / Netlify serverless functions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- API keys:
  - [OMDb API Key](https://www.omdbapi.com/apikey.aspx) (free tier available)
  - [YouTube Data API Key](https://console.cloud.google.com/apis/credentials) (optional for trailer lookup)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd moodflix
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
VITE_OMDB_API_KEY=your_omdb_key_here
VITE_YOUTUBE_API_KEY=your_youtube_key_here
VITE_YOUTUBE_FALLBACK=false
```

4. Start the development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint code with ESLint

## API Documentation

### OMDb API

Base URL: `https://www.omdbapi.com/`

**Key Endpoints:**
- Search by title: `?apikey=YOUR_KEY&s=movie_title&page=1`
- Get by IMDb ID: `?apikey=YOUR_KEY&i=tt1234567`
- Get by exact title: `?apikey=YOUR_KEY&t=exact_title`

**Notes:**
- Genre is available in detail responses but there's no direct genre filter
- Free tier has rate limits - implement caching to reduce calls
- Returns: title, year, poster, plot, genre, director, actors, ratings

Learn more at [OMDb API Documentation](https://www.omdbapi.com/)

### YouTube Data API

Used for automated trailer lookups via serverless functions.

**Endpoint:** `search.list`
- Query: `"Movie Title Trailer"`
- Returns video IDs for embedding

Learn more at [YouTube Data API](https://developers.google.com/youtube/v3)

## Project Structure

```
moodflix/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   ├── context/        # Context providers
│   ├── seeds/          # Genre seed data (curated IMDb IDs)
│   ├── App.jsx         # Main app component
│   └── main.jsx        # App entry point
├── api/                # Serverless functions (Vercel/Netlify)
├── public/             # Static assets
└── .env.example        # Environment variables template
```

## Mood → Genre Mapping

The application uses the following mood-to-genre mappings:

- **Chill** → Drama, Romance, Indie
- **Hype** → Action, Adventure, Thriller
- **Sad** → Drama, Romance
- **Nostalgic** → Family, Drama, Musical, Comedy
- **Spooky** → Horror, Thriller
- **Funny** → Comedy, Family, Romance
- **Thoughtful** → Documentary, Biography, Drama

## License

MIT

## Acknowledgments

- Movie data provided by [OMDb API](https://www.omdbapi.com/)
- Trailer previews via [YouTube](https://www.youtube.com/)
