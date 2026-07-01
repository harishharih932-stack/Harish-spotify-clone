import { useMemo } from 'react'
import { Heart, Play } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { getSongById } from '../data/songs'
import SongRow from '../components/SongRow'

export default function Liked() {
  const { likedIds, playSong } = useMusic()
  const likedSongs = useMemo(() => likedIds.map(getSongById).filter(Boolean), [likedIds])

  return (
    <div className="px-4 sm:px-6 pb-8 pt-2 animate-fade-in">
      <div className="flex items-end gap-5 mb-8">
        <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-lg bg-gradient-to-br from-indigo-500 to-accent flex items-center justify-center shrink-0 shadow-xl shadow-black/40">
          <Heart size={44} className="fill-white text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wide">Playlist</p>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-white light:text-neutral-900 mt-1">
            Liked Songs
          </h1>
          <p className="text-sm text-neutral-400 mt-2">{likedSongs.length} song{likedSongs.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      {likedSongs.length > 0 && (
        <button
          onClick={() => playSong(likedSongs[0], likedSongs)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-accent text-black mb-6 hover:scale-105 hover:bg-accent-light transition-all"
          aria-label="Play liked songs"
        >
          <Play size={22} fill="black" className="ml-0.5" />
        </button>
      )}

      {likedSongs.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="font-semibold text-white light:text-neutral-900">Songs you like will appear here</p>
          <p className="text-sm mt-1">Tap the heart on any song to save it.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {likedSongs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i + 1} sourceList={likedSongs} />
          ))}
        </div>
      )}
    </div>
  )
}
