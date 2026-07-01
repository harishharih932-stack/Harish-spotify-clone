import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, ListMusic, Plus, Radio } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { useState } from 'react'
import CreatePlaylistModal from './CreatePlaylistModal'

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/liked', label: 'Liked Songs', icon: Heart },
]

export default function Sidebar({ onNavigate }) {
  const { playlists, createPlaylist } = useMusic()
  const [modalOpen, setModalOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
      isActive
        ? 'text-white bg-base-highlight light:bg-light-elevated light:text-neutral-900'
        : 'text-neutral-400 hover:text-white light:hover:text-neutral-900'
    }`

  return (
    <aside className="flex flex-col h-full w-full bg-black light:bg-light-bg light:border-r light:border-light-border">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-white light:text-neutral-900">
          <Radio className="text-accent" size={26} strokeWidth={2.5} />
          Wavelength
        </div>
      </div>

      <nav className="px-3 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className={linkClass}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 px-3 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between px-3 py-2">
          <NavLink
            to="/playlists"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2 text-sm font-semibold transition-colors ${
                isActive ? 'text-white light:text-neutral-900' : 'text-neutral-400 hover:text-white light:hover:text-neutral-900'
              }`
            }
          >
            <ListMusic size={18} />
            Playlists
          </NavLink>
          <button
            onClick={() => setModalOpen(true)}
            aria-label="Create playlist"
            className="w-6 h-6 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-base-highlight light:hover:bg-light-elevated transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-1 pb-3">
          {playlists.length === 0 ? (
            <p className="px-3 text-xs text-neutral-500 mt-2 leading-relaxed">
              Create your first playlist to start organizing songs.
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {playlists.map((p) => (
                <li key={p.id}>
                  <NavLink
                    to={`/playlist/${p.id}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-sm truncate transition-colors ${
                        isActive
                          ? 'text-white bg-base-highlight light:bg-light-elevated light:text-neutral-900'
                          : 'text-neutral-400 hover:text-white light:hover:text-neutral-900'
                      }`
                    }
                  >
                    {p.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CreatePlaylistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(name) => createPlaylist(name)}
      />
    </aside>
  )
}
