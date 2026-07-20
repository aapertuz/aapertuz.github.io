import { useState } from 'react'
import { AboutWindow } from './components/AboutWindow'
import { FloatingNav } from './components/FloatingNav'
import { NAV_ITEMS, type NavItem } from './components/floatingNavModel'
import { Scene } from './components/Scene'
import { SceneBoundary } from './components/SceneBoundary'

export default function App() {
  const [active, setActive] = useState<NavItem>('home')
  const [aboutOpen, setAboutOpen] = useState(false)

  const openAbout = () => {
    setActive('about')
    setAboutOpen(true)
  }

  const handleNavSelect = (item: NavItem) => {
    setActive(item)
    setAboutOpen(item === 'about')
  }

  const closeAbout = () => {
    setActive(NAV_ITEMS[0])
    setAboutOpen(false)
  }

  return (
    <main className="experience" data-about-open={aboutOpen || undefined}>
      <FloatingNav active={active} onSelect={handleNavSelect} inert={aboutOpen} />
      <AboutWindow open={aboutOpen} onClose={closeAbout} />
      <SceneBoundary>
        <Scene aboutOpen={aboutOpen} onNameSelect={openAbout} />
      </SceneBoundary>
    </main>
  )
}
