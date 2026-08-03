import { useEffect, useState } from 'react'
import { Background } from './components/Background'
import { Nav, ScrollProgress } from './components/Nav'
import { CommandPalette } from './components/CommandPalette'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Work } from './components/Work'
import { Experience } from './components/Experience'
import { Resume } from './components/Resume'
import { Contact, Footer } from './components/Contact'

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="grain relative min-h-svh">
      <Background />
      <ScrollProgress />
      <Nav onOpenPalette={() => setPaletteOpen(true)} />

      <main>
        <Hero />
        <About />
        <Work />
        <Experience />
        <Resume />
        <Contact />
      </main>

      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
