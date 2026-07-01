import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CreatePlaylistModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setName('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && open && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate(name.trim() || 'New Playlist')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-base-elevated light:bg-light-surface rounded-xl p-6 animate-slide-up shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-white light:text-neutral-900">New playlist</h2>
          <button onClick={onClose} aria-label="Close" className="text-neutral-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="playlist-name" className="text-xs text-neutral-400 mb-1 block">
            Give it a name
          </label>
          <input
            id="playlist-name"
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Playlist #1"
            maxLength={60}
            className="w-full bg-base-highlight light:bg-light-elevated text-white light:text-neutral-900 rounded-md px-3 py-2.5 text-sm
                       outline-none border border-transparent focus:border-accent transition-colors"
          />
          <div className="flex justify-end gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-accent hover:bg-accent-light text-black rounded-full transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
