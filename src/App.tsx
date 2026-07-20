import { lazy, Suspense, useState } from 'react'
import { AboutWindow } from './components/AboutWindow'
import { FloatingNav } from './components/FloatingNav'
import { NAV_ITEMS, type NavItem } from './components/floatingNavModel'
import { SceneBoundary } from './components/SceneBoundary'

const Scene = lazy(() =>
  import('./components/Scene').then(({ Scene: SceneComponent }) => ({
    default: SceneComponent,
  })),
)

function PresentationShell({ ready }: { ready: boolean }) {
  return (
    <header
      className={
        ready
          ? 'presentation-shell presentation-shell--ready'
          : 'presentation-shell'
      }
    >
      <p>
        Some problems have felt like closed doors.
        <span>These are the projects I’m building to open them.</span>
      </p>
      <h1>Alexis Pertuz</h1>
    </header>
  )
}

export default function App() {
  const [sceneReady, setSceneReady] = useState(false)
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
        <Suspense fallback={<PresentationShell ready={false} />}>
          <PresentationShell ready={sceneReady} />
          <div
            className={
              sceneReady ? 'scene-layer scene-layer--ready' : 'scene-layer'
            }
          >
            <Scene
              aboutOpen={aboutOpen}
              onNameSelect={openAbout}
              onReady={() => setSceneReady(true)}
            />
          </div>
        </Suspense>
      </SceneBoundary>
    </main>
  )
}
