import { FloatingNav } from './components/FloatingNav'
import { Scene } from './components/Scene'
import { SceneBoundary } from './components/SceneBoundary'

export default function App() {
  return (
    <main className="experience">
      <FloatingNav />
      <SceneBoundary>
        <Scene />
      </SceneBoundary>
    </main>
  )
}
