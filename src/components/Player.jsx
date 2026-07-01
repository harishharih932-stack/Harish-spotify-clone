import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume, Volume1, Volume2, VolumeX, Heart, Repeat1,
} from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import ArtTile from './ArtTile'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Player() {
  const {
    currentSong, isPlaying, currentTime, duration, volume, shuffle, repeat,
    togglePlay, playNext, playPrev, seekTo, setVolume,
    setShuffle, setRepeat, toggleLike, isLiked,
  } = useMusic()

  const VolumeIcon = volume === 0 ? VolumeX : volume < 33 ? Volume : volume < 66 ? Volume1 : Volume2
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <footer className="h-[72px] sm:h-20 bg-base-elevated light:bg-light-surface border-t border-base-border light:border-light-border
                        px-3 sm:px-4 flex items-center gap-3 sm:gap-4">
      {/* Now playing */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        {currentSong ? (
          <>
            <ArtTile
              genre={currentSong.genre}
              image={currentSong.artwork}
              seed={currentSong.id}
              rounded="rounded"
              className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}
            />
            <div className="min-w-0 hidden xs:block">
              <p className="text-sm font-semibold text-white light:text-neutral-900 truncate">{currentSong.title}</p>
              <p className="text-xs text-neutral-400 truncate">{currentSong.artist}</p>
            </div>
            <button
              onClick={() => toggleLike(currentSong.id)}
              aria-label={isLiked(currentSong.id) ? 'Unlike' : 'Like'}
              className="hidden sm:flex shrink-0"
            >
              <Heart size={16} className={isLiked(currentSong.id) ? 'fill-accent text-accent' : 'text-neutral-400 hover:text-white'} />
            </button>
          </>
        ) : (
          <p className="text-xs text-neutral-500">Nothing playing yet — pick a song</p>
        )}
      </div>

      {/* Transport controls */}
      <div className="flex-1 flex flex-col items-center gap-1.5 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            onClick={() => setShuffle((s) => !s)}
            aria-label="Toggle shuffle"
            aria-pressed={shuffle}
            className={`hidden sm:flex transition-colors ${shuffle ? 'text-accent' : 'text-neutral-400 hover:text-white'}`}
          >
            <Shuffle size={17} />
          </button>
          <button
            onClick={playPrev}
            aria-label="Previous track"
            disabled={!currentSong}
            className="text-neutral-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <SkipBack size={19} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" className="ml-0.5" />}
          </button>
          <button
            onClick={playNext}
            aria-label="Next track"
            disabled={!currentSong}
            className="text-neutral-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <SkipForward size={19} fill="currentColor" />
          </button>
          <button
            onClick={() => setRepeat((r) => !r)}
            aria-label="Toggle repeat"
            aria-pressed={repeat}
            className={`hidden sm:flex transition-colors ${repeat ? 'text-accent' : 'text-neutral-400 hover:text-white'}`}
          >
            {repeat ? <Repeat1 size={17} /> : <Repeat size={17} />}
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 w-full">
          <span className="text-[11px] text-neutral-400 w-9 text-right tabular-nums">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => seekTo(Number(e.target.value))}
            aria-label="Seek"
            disabled={!currentSong}
            className="flex-1"
            style={{
              background: `linear-gradient(to right, #1DB954 ${progress}%, #4a4a4a ${progress}%)`,
            }}
          />
          <span className="text-[11px] text-neutral-400 w-9 tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center gap-2 w-[20%] min-w-[120px] justify-end">
        <VolumeIcon size={17} className="text-neutral-400 shrink-0" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="w-24"
          style={{
            background: `linear-gradient(to right, #ffffff ${volume}%, #4a4a4a ${volume}%)`,
          }}
        />
      </div>
    </footer>
  )
}