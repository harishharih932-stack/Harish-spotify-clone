import { Play, Pause, Heart, X } from 'lucide-react'
import { useMusic } from '../context/MusicContext'

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function SongRow({ song, index, sourceList, onRemove }) {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLike, isLiked } = useMusic()
  const active = currentSong?.id === song.id

  const handleRowClick = () => {
    if (active) togglePlay()
    else playSong(song, sourceList)
  }

  return (
    <div
      onClick={handleRowClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleRowClick()}
      className="group grid grid-cols-[24px_1fr_auto] sm:grid-cols-[32px_3fr_2fr_auto_auto] items-center gap-3 sm:gap-4
                 px-2 sm:px-3 py-2.5 rounded-md hover:bg-base-highlight light:hover:bg-light-elevated cursor-pointer transition-colors"
    >
      <div className="w-5 sm:w-6 flex items-center justify-center text-sm text-neutral-400">
        {active && isPlaying ? (
          <Pause size={14} className="text-accent" fill="currentColor" />
        ) : (
          <>
            <span className={`group-hover:hidden ${active ? 'text-accent' : ''}`}>{index}</span>
            <Play size={14} className="hidden group-hover:block text-white" fill="white" />
          </>
        )}
      </div>

      <div className="min-w-0">
        <p className={`text-sm font-medium truncate ${active ? 'text-accent' : 'text-white light:text-neutral-900'}`}>{song.title}</p>
        <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
      </div>

      <p className="hidden sm:block text-xs text-neutral-400 truncate">{song.genre}</p>

      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleLike(song.id)
        }}
        aria-label={isLiked(song.id) ? 'Unlike' : 'Like'}
        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
      >
        <Heart size={15} className={isLiked(song.id) ? 'fill-accent text-accent' : 'text-neutral-400 hover:text-white'} />
      </button>

      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-400 tabular-nums w-10 text-right">{formatDuration(song.duration)}</span>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(song.id)
            }}
            aria-label="Remove from playlist"
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-neutral-400 hover:text-white transition-opacity"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
