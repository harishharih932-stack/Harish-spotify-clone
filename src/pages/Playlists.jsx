import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import PlaylistCard from '../components/PlaylistCard'
import CreatePlaylistModal from '../components/CreatePlaylistModal'

export default function Playlists() {
  const { playlists, createPlaylist } = useMusic()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="px-4 sm:px-6 pb-8 pt-2 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white light:text-neutral-900">Your Playlists</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent hover:bg-accent-light text-black text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          New Playlist
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="font-semibold text-white light:text-neutral-900">No playlists yet</p>
          <p className="text-sm mt-1">Create one to start grouping your favorite songs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
      )}

      <CreatePlaylistModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={createPlaylist} />
    </div>
  )
}
