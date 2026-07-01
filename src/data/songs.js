// Mock catalogue — no external audio/image assets required.
// Each genre owns a gradient pair, used to generate distinctive
// "cover art" purely in CSS (see ArtTile component).

export const genreGradients = {
  Synthwave: ['#FF2E92', '#5B2CFF'],
  'Indie Pop': ['#FFB86B', '#FF5E5E'],
  'Hip-Hop': ['#3A3A3A', '#1DB954'],
  'Lo-fi': ['#6B7A8F', '#2C3E50'],
  Electronic: ['#00E5FF', '#7B2FFF'],
  Rock: ['#FF4B4B', '#8A0000'],
  'R&B': ['#B76BFF', '#5B2C8F'],
  Jazz: ['#D4A24C', '#6B3F1D'],
  Classical: ['#8FA6B2', '#2E3A45'],
  Folk: ['#8BAA6E', '#3E5C2C'],
  Pop: ['#FF6EC7', '#FFA94D'],
  Ambient: ['#4C6E91', '#1A2B3C'],
}

const raw = [
  ['Midnight Skyline', 'Nova Ridge', 'Synthwave', 214],
  ['Neon Drift', 'Nova Ridge', 'Synthwave', 198],
  ['Static Glow', 'Vela Croft', 'Synthwave', 231],
  ['Analog Heart', 'The Circuits', 'Synthwave', 205],
  ['Paper Planes Again', 'June Harlow', 'Indie Pop', 187],
  ['Yellow Bicycle', 'June Harlow', 'Indie Pop', 176],
  ['Sunroom', 'Milk Teeth', 'Indie Pop', 203],
  ['Postcards', 'Milk Teeth', 'Indie Pop', 194],
  ['Corner Store Blues', 'Ashgrove', 'Indie Pop', 210],
  ['Concrete Bloom', 'MC Solace', 'Hip-Hop', 189],
  ['Night Shift', 'MC Solace', 'Hip-Hop', 172],
  ['Low Beam', 'Drez', 'Hip-Hop', 201],
  ['Ledger', 'Drez', 'Hip-Hop', 215],
  ['Cornerside', 'Tay Marsh', 'Hip-Hop', 183],
  ['Rainy Window', 'Soft Static', 'Lo-fi', 142],
  ['3 AM Kettle', 'Soft Static', 'Lo-fi', 156],
  ['Study Hall', 'Kepler Tapes', 'Lo-fi', 138],
  ['Dust on the Shelf', 'Kepler Tapes', 'Lo-fi', 149],
  ['Warm Static', 'Home Recordings', 'Lo-fi', 161],
  ['Pulse Grid', 'Actual Machine', 'Electronic', 224],
  ['Glass Elevator', 'Actual Machine', 'Electronic', 219],
  ['Chrome Orbit', 'Halcyon Drive', 'Electronic', 207],
  ['Undertow', 'Halcyon Drive', 'Electronic', 233],
  ['Function/Form', 'Kilo Wave', 'Electronic', 198],
  ['Broken Amp', 'Redline Riot', 'Rock', 226],
  ['Gravel Road', 'Redline Riot', 'Rock', 241],
  ['Fault Line', 'The Aftershocks', 'Rock', 213],
  ['Static King', 'The Aftershocks', 'Rock', 229],
  ['Ember & Ash', 'Coldwater Radio', 'Rock', 237],
  ['Velvet Hour', 'Simone Frey', 'R&B', 218],
  ['Slow Burn', 'Simone Frey', 'R&B', 202],
  ['Honeycomb', 'Tobias Reign', 'R&B', 195],
  ['After Hours Call', 'Tobias Reign', 'R&B', 211],
  ['Blue Room', 'Nadia Vale', 'R&B', 206],
  ['Smoke Signal', 'The Blue Quartet', 'Jazz', 254],
  ['Late Set', 'The Blue Quartet', 'Jazz', 268],
  ['Brushwork', 'Elias Moon', 'Jazz', 245],
  ['Corner Booth', 'Elias Moon', 'Jazz', 233],
  ['Nocturne No. 4', 'Aria Bellweather', 'Classical', 289],
  ['Glass Variations', 'Aria Bellweather', 'Classical', 312],
  ['String Theory', 'The Lumen Ensemble', 'Classical', 276],
  ['Riverbend', 'Cora Wilkes', 'Folk', 198],
  ['Wildwood', 'Cora Wilkes', 'Folk', 187],
  ['Wheat Field Radio', 'Barrow & Sons', 'Folk', 204],
  ['Sugar Rush', 'Lyric Vance', 'Pop', 179],
  ['Champagne Static', 'Lyric Vance', 'Pop', 191],
  ['Heart on Camera', 'Bellamy Rae', 'Pop', 184],
  ['Drift Ceiling', 'Field Notes', 'Ambient', 301],
  ['Slow Tide', 'Field Notes', 'Ambient', 318],
]

export const songs = raw.map(([title, artist, genre, duration], i) => ({
  id: i + 1,
  title,
  artist,
  genre,
  duration,
  album: `${artist} — Sessions`,
}))

export const genres = Object.keys(genreGradients)

export const getSongById = (id) => songs.find((s) => s.id === Number(id))
