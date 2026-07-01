import { Search } from 'lucide-react'
import { genres, genreGradients } from '../data/songs'

export default function SearchBar({ query, onQueryChange, activeGenre, onGenreChange }) {
  return (
    <div className="mb-8">
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Songs, artists..."
          aria-label="Search songs and artists"
          className="w-full bg-base-elevated light:bg-light-elevated text-white light:text-neutral-900 placeholder:text-neutral-500
                     rounded-full pl-11 pr-4 py-3 text-sm outline-none border border-transparent focus:border-accent transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => onGenreChange(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            !activeGenre
              ? 'bg-white text-black'
              : 'bg-base-elevated light:bg-light-elevated text-neutral-300 light:text-neutral-700 hover:text-white light:hover:text-neutral-900'
          }`}
        >
          All genres
        </button>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => onGenreChange(g === activeGenre ? null : g)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeGenre === g
                ? 'bg-white text-black'
                : 'bg-base-elevated light:bg-light-elevated text-neutral-300 light:text-neutral-700 hover:text-white light:hover:text-neutral-900'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: genreGradients[g][0] }}
            />
            {g}
          </button>
        ))}
      </div>
    </div>
  )
}
