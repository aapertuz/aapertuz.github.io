import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AboutWindow } from './components/AboutWindow'
import { FloatingNav } from './components/FloatingNav'
import { NAV_ITEMS, type NavItem } from './components/floatingNavModel'
import { SceneBoundary } from './components/SceneBoundary'
import { isPerformanceDiagnosticsEnabled, type PerformanceSnapshot } from './components/performanceDiagnostics'
import { INTRO_DURATION_MS } from './scene/entrance'

const SHOW_NAVBAR = false

function PerformanceOverlay() {
  const [snapshot, setSnapshot] = useState<PerformanceSnapshot | null>(null)
  useEffect(() => {
    if (!isPerformanceDiagnosticsEnabled()) return
    const update = () => setSnapshot(window.__portfolioPerf ?? null)
    const timer = window.setInterval(update, 500)
    update()
    return () => window.clearInterval(timer)
  }, [])
  if (!isPerformanceDiagnosticsEnabled() || !snapshot) return null
  const gpu = snapshot.gpuP95Ms === null ? 'unavailable' : `${snapshot.gpuP95Ms.toFixed(2)} ms`
  return (
    <pre className="performance-overlay" aria-hidden="true">
      {`phase ${snapshot.phase} · DPR ${snapshot.dpr.toFixed(2)}\n`}
      {`frame interval p95 ${snapshot.frameIntervalP95Ms.toFixed(2)} ms · >16.67 ms ${snapshot.intervalsOver16MsPercent.toFixed(1)}%\n`}
      {`CPU update/render p95 ${snapshot.cpuUpdateP95Ms.toFixed(2)} / ${snapshot.cpuRenderP95Ms.toFixed(2)} ms\n`}
      {`GPU p95 / frame ${gpu} · draws ${snapshot.drawCalls.toFixed(1)} / frame\n`}
      {`canvas ${snapshot.canvas.width}×${snapshot.canvas.height} · target ${snapshot.target.width}×${snapshot.target.height}\n`}
      {`resources ${snapshot.estimatedResourceMiB.toFixed(1)} MiB est. · ${snapshot.geometries} geometries · ${snapshot.textures} textures · ${snapshot.samples} frames`}
    </pre>
  )
}

const Scene = lazy(() =>
  import('./components/Scene').then(({ Scene: SceneComponent }) => ({
    default: SceneComponent,
  })),
)

function PresentationShell({ ready }: { ready: boolean }) {
  return (
    <header
      aria-hidden={ready || undefined}
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
      <h1>Antonio Pertuz</h1>
    </header>
  )
}

export default function App() {
  const [sceneReady, setSceneReady] = useState(false)
  const [introDone, setIntroDone] = useState(false)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setIntroDone(true), reduced ? 0 : INTRO_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [])
  const sceneShown = sceneReady && introDone
  const [active, setActive] = useState<NavItem>('home')
  const [aboutOpen, setAboutOpen] = useState(false)
  const [aboutArrived, setAboutArrived] = useState(false)
  const arriveAbout = useCallback(() => setAboutArrived(true), [])

  const openAbout = () => {
    setActive('about')
    setAboutArrived(false)
    setAboutOpen(true)
  }

  const handleNavSelect = (item: NavItem) => {
    setActive(item)
    setAboutArrived(false)
    setAboutOpen(item === 'about')
  }

  const closeAbout = useCallback(() => {
    setActive(NAV_ITEMS[0])
    setAboutOpen(false)
    setAboutArrived(false)
  }, [])

  useEffect(() => {
    if (!aboutOpen) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeAbout() }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [aboutOpen, closeAbout])

  return (
    <main className="experience" data-about-open={aboutOpen || undefined}>
      <PerformanceOverlay />
      <FloatingNav active={active} onSelect={handleNavSelect} inert={aboutOpen} hidden={!SHOW_NAVBAR} />
      <AboutWindow open={aboutOpen && aboutArrived} onClose={closeAbout} spatial />
      {aboutOpen && !aboutArrived && <button className="profile-journey-back" onClick={closeAbout}>← Back to projects</button>}
      <SceneBoundary>
        <Suspense fallback={<PresentationShell ready={false} />}>
          <PresentationShell ready={sceneShown} />
          <div
            className={
              sceneShown ? 'scene-layer scene-layer--ready' : 'scene-layer'
            }
          >
            <Scene
              revealing={sceneShown}
              aboutOpen={aboutOpen}
              onNameSelect={openAbout}
              onProfileArrived={arriveAbout}
              onReady={() => setSceneReady(true)}
            />
          </div>
        </Suspense>
      </SceneBoundary>
    </main>
  )
}
