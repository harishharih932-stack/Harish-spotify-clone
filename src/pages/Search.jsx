import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { songs, genres, genreGradients } from '../data/songs'
import SongCard from '../components/SongCard'
import SearchBar from '../components/SearchBar'
import { SearchX } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

export default function Search() {
  const { searchSongs, searchResults } = useMusic()
  const [params, setParams] = useSearchParams()
  const [activeGenre, setActiveGenre] = useState(null)
  const query = params.get('q') || ''

  const setQuery = (val) => {
    setParams(val ? { q: val } : {})
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchSongs(query)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [query, searchSongs])

  const results = useMemo(() => {
    if (query && searchResults.length > 0) {
      return searchResults
    }
    const q = query.trim().toLowerCase()
    return songs.filter((s) => {
      const matchesQuery =
        !q || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      const matchesGenre = !activeGenre || s.genre === activeGenre
      return matchesQuery && matchesGenre
    })
  }, [query, activeGenre, searchResults])

  const showBrowse = !query && !activeGenre

  return (
    <div className="px-4 sm:px-6 pb-8 pt-2 animate-fade-in">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-white light:text-neutral-900 mb-6">Search</h1>
      <SearchBar query={query} onQueryChange={setQuery} activeGenre={activeGenre} onGenreChange={setActiveGenre} />

      {showBrowse ? (
        <div>
          <h2 className="font-display font-semibold text-lg text-white light:text-neutral-900 mb-4">Browse all genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {genres.map((g) => {
              const [from, to] = genreGradients[g]
              return (
                <button
                  key={g}
                  onClick={() => setActiveGenre(g)}
                  className="aspect-[2/1] rounded-lg p-4 text-left font-display font-semibold text-white text-lg overflow-hidden relative
                             hover:scale-[1.02] transition-transform"
                  style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                >
                  <span className="absolute inset-0 bg-black/10" />
                  <span className="relative z-10">{g}</span>
                </button>
              )
            })}
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {results.map((song) => (
            <SongCard key={song.id} song={song} sourceList={results} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 text-neutral-400">
          <SearchX size={40} className="mb-4 text-neutral-600" />
          <p className="font-semibold text-white light:text-neutral-900">No results for "{query || activeGenre}"</p>
          <p className="text-sm mt-1">Try a different title, artist, or genre.</p>
        </div>
      )}
    </div>
  )
}
