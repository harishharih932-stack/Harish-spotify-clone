import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { songs, genreGradients } from '../data/songs'

const MusicContext = createContext(null)

const STORAGE_KEYS = {
  playlists: 'wavelength:playlists',
  liked: 'wavelength:liked',
  volume: 'wavelength:volume',
  theme: 'wavelength:theme',
  recent: 'wavelength:recent',
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const PALETTE = Object.values(genreGradients)

export function MusicProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0–100
  const [volume, setVolumeState] = useState(() => loadJSON(STORAGE_KEYS.volume, 70))
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false) // repeat-one
  const [queueSource, setQueueSource] = useState(songs) // list currentSong was played from
  const [searchResults, setSearchResults] = useState([])

  const audioRef = useRef(new Audio())
  const intervalRef = useRef(null)

  const [playlists, setPlaylists] = useState(() =>
    loadJSON(STORAGE_KEYS.playlists, [
      {
        id: 'starter',
        name: 'Late Night Drive',
        songIds: [1, 3, 20, 22, 26],
        createdAt: Date.now(),
        gradient: PALETTE[0],
      },
    ])
  )
  const [likedIds, setLikedIds] = useState(() => loadJSON(STORAGE_KEYS.liked, [4, 9, 31]))
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => loadJSON(STORAGE_KEYS.recent, []))
  const [theme, setTheme] = useState(() => loadJSON(STORAGE_KEYS.theme, 'dark'))

  // Update volume
  useEffect(() => {
    audioRef.current.volume = volume / 100
  }, [volume])

  const playNextRef = useRef()

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const onEnded = () => {
      playNextRef.current?.()
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  // Persist to localStorage
  useEffect(() => localStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(playlists)), [playlists])
  useEffect(() => localStorage.setItem(STORAGE_KEYS.liked, JSON.stringify(likedIds)), [likedIds])
  useEffect(() => localStorage.setItem(STORAGE_KEYS.volume, JSON.stringify(volume)), [volume])
  useEffect(() => localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recentlyPlayed)), [recentlyPlayed])
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme))
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [theme])

  const addToRecent = useCallback((song) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((id) => id !== song.id)
      return [song.id, ...filtered].slice(0, 12)
    })
  }, [])

  const playSong = useCallback(
    (song, source = songs) => {
      if (currentSong?.id === song.id) {
        // Just toggle play if it's the same song
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.play().catch(e => console.error("Playback failed", e))
          setIsPlaying(true)
        }
        return
      }

      setCurrentSong(song)
      setQueueSource(source)
      
      if (song.previewUrl) {
        audioRef.current.src = song.previewUrl
        audioRef.current.play().catch(e => console.error("Playback failed", e))
        setIsPlaying(true)
      } else {
        // Fallback for mock songs if any remain
        audioRef.current.currentTime = 0
        setIsPlaying(true)
      }
      
      addToRecent(song)
    },
    [currentSong, isPlaying, addToRecent]
  )

  const togglePlay = useCallback(() => {
    if (!currentSong) {
      if (songs.length) playSong(songs[0])
      return
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed", e))
    }
    setIsPlaying((p) => !p)
  }, [currentSong, isPlaying, playSong])

  const searchSongs = useCallback(async (query) => {
    if (!query) {
      setSearchResults([])
      return
    }
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`)
      const data = await response.json()
      const formatted = data.results.map(item => ({
        id: item.trackId,
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName,
        duration: Math.floor(item.trackTimeMillis / 1000),
        previewUrl: item.previewUrl,
        artwork: item.artworkUrl100.replace('100x100', '400x400'),
        genre: item.primaryGenreName
      }))
      setSearchResults(formatted)
    } catch (error) {
      console.error("Search failed", error)
    }
  }, [])

  const stepTrack = useCallback(
    (direction) => {
      if (!currentSong) return
      const list = queueSource.length ? queueSource : songs
      const idx = list.findIndex((s) => s.id === currentSong.id)
      if (shuffle) {
        let randomIdx = Math.floor(Math.random() * list.length)
        if (list.length > 1 && randomIdx === idx) randomIdx = (randomIdx + 1) % list.length
        playSong(list[randomIdx], list)
        return
      }
      const nextIdx = (idx + direction + list.length) % list.length
      playSong(list[nextIdx], list)
    },
    [currentSong, queueSource, shuffle, playSong]
  )

  const playNext = useCallback(() => {
    if (repeat && currentSong) {
      setProgress(0)
      setIsPlaying(true)
      return
    }
    stepTrack(1)
  }, [repeat, currentSong, stepTrack])

  const playPrev = useCallback(() => {
    // If we're more than 3s into the track, restart it instead of skipping back
    if (currentSong && audioRef.current.currentTime > 3) {
      setProgress(0)
      return
    }
    stepTrack(-1)
  }, [stepTrack, currentSong, progress])

  useEffect(() => {
    playNextRef.current = playNext
  }, [playNext])

  const seekTo = useCallback((percent) => {
    if (audioRef.current.duration) {
      audioRef.current.currentTime = (percent / 100) * audioRef.current.duration
      setProgress(percent)
    }
  }, [])

  const setVolume = useCallback((v) => setVolumeState(v), [])

  const toggleLike = useCallback((songId) => {
    setLikedIds((prev) => (prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]))
  }, [])

  const isLiked = useCallback((songId) => likedIds.includes(songId), [likedIds])

  const createPlaylist = useCallback((name) => {
    const newPlaylist = {
      id: `pl_${Date.now()}`,
      name: name?.trim() || 'New Playlist',
      songIds: [],
      createdAt: Date.now(),
      gradient: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }
    setPlaylists((prev) => [newPlaylist, ...prev])
    return newPlaylist.id
  }, [])

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId))
  }, [])

  const renamePlaylist = useCallback((playlistId, name) => {
    setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, name } : p)))
  }, [])

  const addToPlaylist = useCallback((playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId] }
          : p
      )
    )
  }, [])

  const removeFromPlaylist = useCallback((playlistId, songId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, songIds: p.songIds.filter((id) => id !== songId) } : p
      )
    )
  }, [])

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const value = {
    songs,
    currentSong,
    isPlaying,
    progress,
    volume,
    shuffle,
    repeat,
    playlists,
    likedIds,
    recentlyPlayed,
    theme,
    playSong,
    togglePlay,
    playNext,
    playPrev,
    seekTo,
    setVolume,
    setShuffle,
    setRepeat,
    toggleLike,
    isLiked,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    toggleTheme,
    searchResults,
    searchSongs,
  }

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within a MusicProvider')
  return ctx
}