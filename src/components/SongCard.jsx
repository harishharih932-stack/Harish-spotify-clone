import { Play, Pause, Heart } from 'lucide-react'
import ArtTile from './ArtTile'
import { useMusic } from '../context/MusicContext'

export default function SongCard({ song, sourceList }) {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked } = useMusic()
  const active = currentSong?.id === song.id

  const handlePlayClick = (e) => {
    e.stopPropagation()
    if (active) togglePlay()
    else playSong(song, sourceList)
  }

  return (
    <div
      onClick={handlePlayClick}
      className="group relative bg-base-elevated hover:bg-base-highlight
                 light:bg-light-surface light:hover:bg-light-elevated
                 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors duration-200"
    >
      <div className="relative mb-3 sm:mb-4">
        <ArtTile genre={song.genre} image={song.artwork} seed={song.id} className="aspect-square w-full" />
        <button
          onClick={handlePlayClick}
          aria-label={active && isPlaying ? 'Pause' : 'Play'}
          className={`absolute bottom-2 right-2 flex items-center justify-center w-10 h-10 rounded-full
                      bg-accent text-black shadow-lg shadow-black/40
                      transition-all duration-200
                      ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}
                      hover:scale-105 hover:bg-accent-light`}
        >
          {active && isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
        </button>
      </div>
      <p className={`font-semibold text-sm truncate ${active ? 'text-accent' : 'text-white'}`}>{song.title}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleLike(song.id)
          }}
          aria-label={isLiked(song.id) ? 'Unlike' : 'Like'}
          className="shrink-0 ml-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
        >
          <Heart size={14} className={isLiked(song.id) ? 'fill-accent text-accent' : 'text-neutral-400 hover:text-white'} />
        </button>
      </div>
    </div>
  )
}
