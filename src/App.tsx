import { lazy, Suspense, useState } from 'react'
import { FloatingNav } from './components/FloatingNav'
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

  return (
    <main className="experience">
      <FloatingNav />
      <SceneBoundary>
        <Suspense fallback={<PresentationShell ready={false} />}>
          <PresentationShell ready={sceneReady} />
          <div
            className={
              sceneReady ? 'scene-layer scene-layer--ready' : 'scene-layer'
            }
          >
            <Scene onReady={() => setSceneReady(true)} />
          </div>
        </Suspense>
      </SceneBoundary>
    </main>
  )
}
