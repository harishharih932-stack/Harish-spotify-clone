import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { Search, Sun, Moon, Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

export default function Header({ onMenuClick }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { theme, toggleTheme } = useMusic()

  const onSearchPage = location.pathname === '/search'
  // Single source of truth: the URL. Avoids the header field and the
  // Search page's own input ever showing different text.
  const query = onSearchPage ? searchParams.get('q') || '' : ''

  const handleChange = (e) => {
    const val = e.target.value
    navigate(`/search${val ? `?q=${encodeURIComponent(val)}` : ''}`)
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-3 bg-base-bg/95 light:bg-light-bg/95 backdrop-blur-sm">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-base-elevated light:bg-light-elevated text-white light:text-neutral-900"
      >
        <Menu size={18} />
      </button>

      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 light:bg-light-elevated text-white light:text-neutral-900 hover:scale-105 transition-transform"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => navigate(1)}
          aria-label="Go forward"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 light:bg-light-elevated text-white light:text-neutral-900 hover:scale-105 transition-transform"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={query}
          onChange={handleChange}
          placeholder="What do you want to listen to?"
          aria-label="Search songs, artists, playlists"
          className="w-full bg-base-elevated light:bg-light-elevated text-white light:text-neutral-900 placeholder:text-neutral-500
                     rounded-full pl-10 pr-4 py-2.5 text-sm outline-none border border-transparent focus:border-accent transition-colors"
        />
      </div>

      <div className="flex-1" />

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="w-9 h-9 flex items-center justify-center rounded-full bg-base-elevated light:bg-light-elevated text-white light:text-neutral-900 hover:scale-105 transition-transform"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-black text-xs font-bold shrink-0"
        title="Guest listener"
      >
        G
      </div>
    </header>
  )
}
