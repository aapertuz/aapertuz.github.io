import { Scene } from './components/Scene'
import { SceneBoundary } from './components/SceneBoundary'

export default function App() {
  return (
    <SceneBoundary>
      <Scene />
    </SceneBoundary>
  )
}
