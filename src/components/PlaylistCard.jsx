import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import ArtTile from './ArtTile'
import { useMusic } from '../context/MusicContext'
import { songs } from '../data/songs'

export default function PlaylistCard({ playlist }) {
  const { playSong } = useMusic()
  const playlistSongs = songs.filter((s) => playlist.songIds.includes(s.id))

  const handlePlay = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (playlistSongs.length) playSong(playlistSongs[0], playlistSongs)
  }

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="group relative bg-base-elevated hover:bg-base-highlight light:bg-light-surface light:hover:bg-light-elevated
                 rounded-lg p-3 sm:p-4 transition-colors duration-200 block"
    >
      <div className="relative mb-3 sm:mb-4">
        <ArtTile gradient={playlist.gradient} seed={playlist.songIds.length + playlist.name.length} className="aspect-square w-full" />
        <button
          onClick={handlePlay}
          aria-label={`Play ${playlist.name}`}
          disabled={!playlistSongs.length}
          className="absolute bottom-2 right-2 flex items-center justify-center w-10 h-10 rounded-full
                     bg-accent text-black shadow-lg shadow-black/40 opacity-0 translate-y-2
                     group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200
                     hover:scale-105 hover:bg-accent-light disabled:opacity-0 disabled:pointer-events-none"
        >
          <Play size={18} fill="black" className="ml-0.5" />
        </button>
      </div>
      <p className="font-semibold text-sm truncate text-white light:text-neutral-900">{playlist.name}</p>
      <p className="text-xs text-neutral-400 mt-1">{playlistSongs.length} song{playlistSongs.length === 1 ? '' : 's'}</p>
    </Link>
  )
}
