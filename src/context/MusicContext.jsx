import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { songs as mockSongs, genreGradients } from '../data/songs'

const MusicContext = createContext(null)

export function MusicProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [searchResults, setSearchResults] = useState([])
  const audioRef = useRef(new Audio())

  useEffect(() => {
    const audio = audioRef.current
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration)
    const onEnded = () => setIsPlaying(false)
    
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('ended', onEnded)
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const searchSongs = async (query) => {
    if (!query) return setSearchResults([])
    try {
      // Direct call to Saavn for FULL songs
      const res = await fetch(`https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&limit=20`)
      const json = await res.json()
      
      if (json.success && json.data.results && json.data.results.length > 0) {
        setSearchResults(json.data.results.map(s => ({
          id: s.id,
          title: s.name,
          artist: s.artists.primary[0]?.name || 'Unknown',
          artwork: s.image[s.image.length - 1]?.link || s.image[0]?.link,
          url: s.downloadUrl[s.downloadUrl.length - 1]?.link || s.downloadUrl[0]?.link,
          duration: parseInt(s.duration)
        })))
      } else {
        // iTunes fallback
        const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`)
        const itunesJson = await itunesRes.json()
        setSearchResults(itunesJson.results.map(item => ({
          id: item.trackId.toString(),
          title: item.trackName + ' (Preview)',
          artist: item.artistName,
          artwork: item.artworkUrl100.replace('100x100', '600x600'),
          url: item.previewUrl,
          duration: 30
        })))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) { audioRef.current.pause() } 
      else { audioRef.current.play() }
      setIsPlaying(!isPlaying)
    } else {
      setCurrentSong(song)
      audioRef.current.src = song.url
      audioRef.current.load()
      audioRef.current.play().catch(e => console.error(e))
      setIsPlaying(true)
    }
  }

  return (
    <MusicContext.Provider value={{ 
      currentSong, isPlaying, currentTime, duration, 
      searchResults, searchSongs, playSong, 
      togglePlay: () => playSong(currentSong),
      seekTo: (percent) => {
        const time = (percent / 100) * audioRef.current.duration
        audioRef.current.currentTime = time
      }
    }}>
      {children}
    </MusicContext.Provider>
  )
}

export const useMusic = () => useContext(MusicContext)
