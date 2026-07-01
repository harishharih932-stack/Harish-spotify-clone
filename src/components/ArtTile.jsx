import { genreGradients } from '../data/songs'

export default function ArtTile({ genre, image, gradient, seed = 0, rounded = 'rounded-md', className = '' }) {
  if (image) {
    return (
      <div className={`relative overflow-hidden ${rounded} ${className}`}>
        <img src={image} alt="" className="w-full h-full object-cover" />
      </div>
    )
  }

  const [from, to] = gradient || genreGradients[genre] || ['#1DB954', '#121212']
  const bars = Array.from({ length: 5 }, (_, i) => 30 + ((seed + i * 37) % 60))

  return (
    <div
      className={`relative overflow-hidden flex items-end justify-center gap-[3px] p-3 ${rounded} ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div className="absolute inset-0 bg-black/10" />
      {bars.map((h, i) => (
        <span
          key={i}
          className="relative w-[3px] rounded-full bg-white/70"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}