import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { songs as mockSongs, genreGradients } from '../data/songs'

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
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(() => loadJSON(STORAGE_KEYS.volume, 70))
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [queueSource, setQueueSource] = useState(mockSongs)
  const [searchResults, setSearchResults] = useState([])

  const [playlists, setPlaylists] = useState(() => loadJSON(STORAGE_KEYS.playlists, []))
  const [likedIds, setLikedIds] = useState(() => loadJSON(STORAGE_KEYS.liked, []))
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => loadJSON(STORAGE_KEYS.recent, []))
  const [theme, setTheme] = useState(() => loadJSON(STORAGE_KEYS.theme, 'dark'))

  const audioRef = useRef(new Audio())
  const playNextRef = useRef()

  useEffect(() => {
    audioRef.current.volume = volume / 100
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }
    const onEnded = () => {
      if (playNextRef.current) playNextRef.current()
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.playlists, JSON.stringify(playlists))
    localStorage.setItem(STORAGE_KEYS.liked, JSON.stringify(likedIds))
    localStorage.setItem(STORAGE_KEYS.volume, JSON.stringify(volume))
    localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(recentlyPlayed))
    localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(theme))
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [playlists, likedIds, volume, recentlyPlayed, theme])

  const addToRecent = useCallback((song) => {
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((id) => id !== song.id)
      return [song.id, ...filtered].slice(0, 12)
    })
  }, [])

  const playSong = useCallback(
    (song, source = mockSongs) => {
      if (currentSong?.id === song.id) {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          audioRef.current.play().catch(() => {})
          setIsPlaying(true)
        }
        return
      }

      setCurrentSong(song)
      setQueueSource(source)
      
      const audioUrl = song.url || song.previewUrl
      if (audioUrl) {
        audioRef.current.src = audioUrl
        audioRef.current.load()
        audioRef.current.play().catch(e => console.error("Playback failed", e))
        setIsPlaying(true)
      }
      
      addToRecent(song)
    },
    [currentSong, isPlaying, addToRecent]
  )

  const togglePlay = useCallback(() => {
    if (!currentSong) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }, [currentSong, isPlaying])

  const searchSongs = useCallback(async (query) => {
    if (!query) {
      setSearchResults([])
      return
    }

    try {
      // Prioritize Saavn API for FULL songs
      const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=30`)
      const resData = await response.json()
      
      if (resData.success && resData.data?.results?.length > 0) {
        const formatted = resData.data.results.map(item => ({
          id: item.id,
          title: item.name,
          artist: item.artists.primary[0]?.name || 'Unknown Artist',
          album: item.album?.name || 'Unknown Album',
          duration: parseInt(item.duration) || 0,
          url: item.downloadUrl[item.downloadUrl.length - 1].link,
          artwork: item.image[item.image.length - 1].link,
          genre: 'Popular',
          isFull: true
        }))
        setSearchResults(formatted)
        return // Success, exit
      }
    } catch (error) {
      console.warn("Saavn API error, falling back to iTunes:", error)
    }

    // Fallback to iTunes if Saavn fails
    try {
      const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=40`)
      const itunesData = await itunesRes.json()
      if (itunesData.results) {
        const formatted = itunesData.results.map(item => ({
          id: item.trackId,
          title: item.trackName + ' (30s Preview)',
          artist: item.artistName,
          album: item.collectionName,
          duration: 30,
          url: item.previewUrl,
          artwork: item.artworkUrl100.replace('100x100', '600x600'),
          genre: item.primaryGenreName,
          isFull: false
        }))
        setSearchResults(formatted)
      }
    } catch (error) {
      console.error("Search failed completely:", error)
      setSearchResults([])
    }
  }, [])

  const stepTrack = useCallback(
    (direction) => {
      if (!currentSong) return
      const list = queueSource.length ? queueSource : mockSongs
      const idx = list.findIndex((s) => s.id === currentSong.id)
      if (idx === -1) return
      
      if (shuffle) {
        let randomIdx = Math.floor(Math.random() * list.length)
        playSong(list[randomIdx], list)
        return
      }
      const nextIdx = (idx + direction + list.length) % list.length
      playSong(list[nextIdx], list)
    },
    [currentSong, queueSource, shuffle, playSong]
  )

  const playNext = useCallback(() => {
    if (repeat) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      return
    }
    stepTrack(1)
  }, [repeat, stepTrack])

  const playPrev = useCallback(() => {
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }
    stepTrack(-1)
  }, [stepTrack])

  useEffect(() => {
    playNextRef.current = playNext
  }, [playNext])

  const seekTo = useCallback((percent) => {
    if (audioRef.current.duration) {
      const target = (percent / 100) * audioRef.current.duration
      audioRef.current.currentTime = target
      setCurrentTime(target)
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
  const deletePlaylist = useCallback((playlistId) => setPlaylists((prev) => prev.filter((p) => p.id !== playlistId)), [])
  const renamePlaylist = useCallback((playlistId, name) => setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, name } : p))), [])
  const addToPlaylist = useCallback((playlistId, songId) => setPlaylists((prev) => prev.map((p) => p.id === playlistId && !p.songIds.includes(songId) ? { ...p, songIds: [...p.songIds, songId] } : p)), [])
  const removeFromPlaylist = useCallback((playlistId, songId) => setPlaylists((prev) => prev.map((p) => p.id === playlistId ? { ...p, songIds: p.songIds.filter((id) => id !== songId) } : p)), [])
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const value = {
    songs: mockSongs,
    currentSong,
    isPlaying,
    currentTime,
    duration,
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