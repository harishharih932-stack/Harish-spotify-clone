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

  // Sync Volume
  useEffect(() => {
    audioRef.current.volume = volume / 100
  }, [volume])

  // Audio Event Listeners
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

  // Persist State
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

      console.log("Playing Full Song:", song.title, "Length:", song.duration, "seconds");
      
      setCurrentSong(song)
      setQueueSource(source)
      
      const audioUrl = song.url || song.previewUrl
      if (audioUrl) {
        audioRef.current.src = audioUrl
        audioRef.current.load()
        setDuration(song.duration || 0)
        setCurrentTime(0)
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

    console.log("Searching for:", query);

    // Primary API: JioSaavn (Full Songs)
    try {
      const response = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=30`)
      const res = await response.json()
      
      if (res.success && res.data?.results?.length > 0) {
        console.log("Full songs found!");
        const formatted = res.data.results.map(item => {
          // Get the best quality download link (usually 320kbps is at the end)
          const downloadUrl = item.downloadUrl[item.downloadUrl.length - 1].link;
          const artwork = item.image[item.image.length - 1].link;

          return {
            id: item.id,
            title: item.name,
            artist: item.artists?.primary?.[0]?.name || 'Unknown Artist',
            album: item.album?.name || '',
            duration: parseInt(item.duration) || 0,
            url: downloadUrl,
            artwork: artwork,
            genre: 'Music',
            isFull: true
          }
        }).filter(s => s.url);

        if (formatted.length > 0) {
          setSearchResults(formatted)
          return
        }
      }
    } catch (error) {
      console.warn("Full song API failed, trying alternate...");
    }

    // Alternate Full Song API
    try {
      const response = await fetch(`https://jiosaavn-api-v3.vercel.app/search/songs?query=${encodeURIComponent(query)}`)
      const res = await response.json()
      const results = res.data?.results || res.data || [];

      if (results.length > 0) {
        console.log("Full songs found via alternate!");
        const formatted = results.map(item => ({
          id: item.id,
          title: item.name,
          artist: item.artists?.primary?.[0]?.name || 'Unknown Artist',
          album: item.album?.name || '',
          duration: parseInt(item.duration) || 0,
          url: item.downloadUrl[item.downloadUrl.length - 1].link,
          artwork: item.image[item.image.length - 1].link,
          genre: 'Music',
          isFull: true
        })).filter(s => s.url);

        if (formatted.length > 0) {
          setSearchResults(formatted)
          return
        }
      }
    } catch (error) {
      console.warn("Alternate full song API also failed.");
    }

    // Last Resort: iTunes (Only 30s Previews)
    try {
      console.log("Falling back to iTunes (30s previews)");
      const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`)
      const itunesData = await itunesRes.json()
      if (itunesData.results) {
        setSearchResults(itunesData.results.map(item => ({
          id: item.trackId.toString(),
          title: item.trackName + ' (30s Preview Only)',
          artist: item.artistName,
          album: item.collectionName,
          duration: 30,
          url: item.previewUrl,
          artwork: item.artworkUrl100.replace('100x100', '600x600'),
          genre: 'Preview',
          isFull: false
        })));
      }
    } catch (e) {
      setSearchResults([]);
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