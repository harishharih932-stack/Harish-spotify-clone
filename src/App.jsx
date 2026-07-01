import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MusicProvider } from './context/MusicContext'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Player from './components/Player'
import Home from './pages/Home'
import Search from './pages/Search'
import Liked from './pages/Liked'
import Playlists from './pages/Playlists'
import PlaylistDetail from './pages/PlaylistDetail'

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <MusicProvider>
      <div className="h-screen flex flex-col bg-base-bg light:bg-light-bg text-white light:text-neutral-900 overflow-hidden">
        <div className="flex flex-1 min-h-0">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0 h-full">
            <Sidebar />
          </div>

          {/* Mobile sidebar drawer */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
              <div className="relative w-64 h-full animate-slide-up">
                <Sidebar onNavigate={() => setMobileNavOpen(false)} />
              </div>
            </div>
          )}

          <main className="flex-1 min-w-0 h-full overflow-y-auto">
            <Header onMenuClick={() => setMobileNavOpen(true)} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/liked" element={<Liked />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>

        <Player />
      </div>
    </MusicProvider>
  )
}
