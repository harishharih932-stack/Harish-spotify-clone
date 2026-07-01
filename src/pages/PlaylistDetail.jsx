import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Plus, Pencil, Trash2, Check, X as XIcon } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { songs } from '../data/songs'
import ArtTile from '../components/ArtTile'
import SongRow from '../components/SongRow'
import AddSongsModal from '../components/AddSongsModal'

export default function PlaylistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { playlists, playSong, addToPlaylist, removeFromPlaylist, deletePlaylist, renamePlaylist } = useMusic()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')

  const playlist = playlists.find((p) => p.id === id)
  const playlistSongs = useMemo(
    () => (playlist ? songs.filter((s) => playlist.songIds.includes(s.id)) : []),
    [playlist]
  )

  if (!playlist) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-white light:text-neutral-900 font-semibold">Playlist not found</p>
        <button onClick={() => navigate('/playlists')} className="text-accent text-sm mt-2 hover:underline">
          Back to playlists
        </button>
      </div>
    )
  }

  const startEditing = () => {
    setNameDraft(playlist.name)
    setEditingName(true)
  }

  const saveName = () => {
    renamePlaylist(playlist.id, nameDraft.trim() || playlist.name)
    setEditingName(false)
  }

  const handleDelete = () => {
    if (confirm(`Delete "${playlist.name}"? This can't be undone.`)) {
      deletePlaylist(playlist.id)
      navigate('/playlists')
    }
  }

  return (
    <div className="px-4 sm:px-6 pb-8 pt-2 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 mb-6">
        <ArtTile
          gradient={playlist.gradient}
          seed={playlist.songIds.length + playlist.name.length}
          rounded="rounded-lg"
          className="w-28 h-28 sm:w-40 sm:h-40 shrink-0 shadow-xl shadow-black/40"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wide">Playlist</p>
          {editingName ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
                className="font-display font-bold text-xl sm:text-3xl bg-base-highlight light:bg-light-elevated text-white light:text-neutral-900
                           rounded-md px-2 py-1 outline-none border border-accent max-w-full"
              />
              <button onClick={saveName} aria-label="Save name" className="text-accent hover:text-accent-light">
                <Check size={20} />
              </button>
              <button onClick={() => setEditingName(false)} aria-label="Cancel" className="text-neutral-400 hover:text-white">
                <XIcon size={20} />
              </button>
            </div>
          ) : (
            <button onClick={startEditing} className="group flex items-center gap-2 mt-1 text-left">
              <h1 className="font-display font-bold text-2xl sm:text-4xl text-white light:text-neutral-900 truncate">
                {playlist.name}
              </h1>
              <Pencil size={16} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          )}
          <p className="text-sm text-neutral-400 mt-2">
            {playlistSongs.length} song{playlistSongs.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => playlistSongs.length && playSong(playlistSongs[0], playlistSongs)}
          disabled={!playlistSongs.length}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-accent text-black hover:scale-105 hover:bg-accent-light transition-all disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Play playlist"
        >
          <Play size={22} fill="black" className="ml-0.5" />
        </button>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-600 light:border-neutral-300 text-white light:text-neutral-900 text-sm font-semibold hover:border-white light:hover:border-neutral-900 transition-colors"
        >
          <Plus size={16} />
          Add songs
        </button>
        <button
          onClick={handleDelete}
          aria-label="Delete playlist"
          className="ml-auto text-neutral-400 hover:text-red-400 transition-colors"
        >
          <Trash2 size={19} />
        </button>
      </div>

      {playlistSongs.length === 0 ? (
        <div className="text-center py-16 text-neutral-400">
          <p className="font-semibold text-white light:text-neutral-900">This playlist is empty</p>
          <p className="text-sm mt-1">Add songs to start building it out.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {playlistSongs.map((song, i) => (
            <SongRow
              key={song.id}
              song={song}
              index={i + 1}
              sourceList={playlistSongs}
              onRemove={(songId) => removeFromPlaylist(playlist.id, songId)}
            />
          ))}
        </div>
      )}

      <AddSongsModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        existingIds={playlist.songIds}
        onAdd={(songId) => addToPlaylist(playlist.id, songId)}
      />
    </div>
  )
}
