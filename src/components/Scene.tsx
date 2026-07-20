import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { projects } from '../data/projects'
import { getHomeCameraZ } from '../scene/cameraFraming'
import { layoutDoors } from '../scene/layout'
import { CameraRig } from './CameraRig'
import { Door } from './Door'
import { Floor } from './Floor'
import { HeroManifesto } from './HeroManifesto'
import { NameText } from './NameText'
import { StarField } from './StarField'

const placements = layoutDoors(projects)

// Narrow viewports need a wider field of view and a bit more distance so the
// full path and name stay framed instead of being cropped by the tall aspect.
const isNarrow =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
const homeFov = isNarrow ? 52 : 40
const homeZ =
  typeof window === 'undefined'
    ? 11
    : getHomeCameraZ(window.innerWidth, window.innerHeight, homeFov)

interface SceneProps {
  aboutOpen?: boolean
  onNameSelect?: () => void
  onReady: () => void
}

export function Scene({ aboutOpen, onNameSelect, onReady }: SceneProps) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 2.3, homeZ], fov: homeFov }}
      onCreated={onReady}
      style={aboutOpen ? { pointerEvents: 'none' } : undefined}
      onPointerMissed={() => setSelected(null)}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 14, 34]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 8, 6]} intensity={0.6} />
      <pointLight position={[0, 2.5, -4]} intensity={8} />
      <StarField />
      <Floor />
      <Suspense fallback={null}>
        <HeroManifesto />
        <NameText onSelect={onNameSelect} />
        {placements.map((p, i) => (
          <Door
            key={p.project.title}
            placement={p}
            accent={i === placements.length - 1}
            selected={selected === i}
            onSelect={() => setSelected(i)}
          />
        ))}
      </Suspense>
      <CameraRig focus={selected === null ? null : placements[selected]} />
    </Canvas>
  )
}
