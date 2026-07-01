import { useMemo } from 'react'
import { songs, genres, getSongById } from '../data/songs'
import { useMusic } from '../context/MusicContext'
import SongCard from '../components/SongCard'

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Still up?'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { recentlyPlayed } = useMusic()
  const recentSongs = useMemo(
    () => recentlyPlayed.map(getSongById).filter(Boolean),
    [recentlyPlayed]
  )

  // A handful of genre sections so the page has real structure, not just one big grid
  const featuredGenres = genres.slice(0, 5)

  return (
    <div className="px-4 sm:px-6 pb-8 pt-2 animate-fade-in">
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-white light:text-neutral-900 mb-6">
        {greeting()}
      </h1>

      {recentSongs.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display font-semibold text-lg sm:text-xl text-white light:text-neutral-900 mb-4">
            Recently played
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {recentSongs.map((song) => (
              <SongCard key={song.id} song={song} sourceList={recentSongs} />
            ))}
          </div>
        </section>
      )}

      {featuredGenres.map((genre) => {
        const genreSongs = songs.filter((s) => s.genre === genre)
        return (
          <section key={genre} className="mb-10">
            <h2 className="font-display font-semibold text-lg sm:text-xl text-white light:text-neutral-900 mb-4">
              {genre}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {genreSongs.map((song) => (
                <SongCard key={song.id} song={song} sourceList={genreSongs} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
