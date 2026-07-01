import { useMemo, useState } from 'react'
import { X, Search, Plus, Check } from 'lucide-react'
import { songs } from '../data/songs'

export default function AddSongsModal({ open, onClose, existingIds, onAdd }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return songs.slice(0, 30)
    return songs.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q))
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in px-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[80vh] flex flex-col bg-base-elevated light:bg-light-surface rounded-xl p-5 sm:p-6 animate-slide-up shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-white light:text-neutral-900">Add songs</h2>
          <button onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="relative mb-4 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs or artists"
            className="w-full bg-base-highlight light:bg-light-elevated text-white light:text-neutral-900 placeholder:text-neutral-500
                       rounded-md pl-10 pr-4 py-2.5 text-sm outline-none border border-transparent focus:border-accent transition-colors"
          />
        </div>

        <div className="overflow-y-auto flex-1 -mx-2 px-2">
          {results.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-8">No songs match your search.</p>
          ) : (
            results.map((song) => {
              const added = existingIds.includes(song.id)
              return (
                <div key={song.id} className="flex items-center justify-between gap-3 py-2 px-1 rounded-md hover:bg-base-highlight light:hover:bg-light-elevated">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white light:text-neutral-900 truncate">{song.title}</p>
                    <p className="text-xs text-neutral-400 truncate">{song.artist} · {song.genre}</p>
                  </div>
                  <button
                    onClick={() => onAdd(song.id)}
                    disabled={added}
                    aria-label={added ? 'Already added' : `Add ${song.title}`}
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                      added ? 'text-accent' : 'text-neutral-300 hover:text-white hover:bg-base-border'
                    }`}
                  >
                    {added ? <Check size={16} /> : <Plus size={16} />}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
