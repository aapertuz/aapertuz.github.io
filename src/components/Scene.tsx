import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { projects } from '../data/projects'
import { layoutDoors } from '../scene/layout'
import { Door } from './Door'
import { Floor } from './Floor'
import { NameText } from './NameText'
import { StarField } from './StarField'

const placements = layoutDoors(projects)

export function Scene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.7, 9.5], fov: 42 }}>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 14, 34]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 8, 6]} intensity={0.6} />
      <pointLight position={[0, 2.5, -4]} intensity={8} />
      <StarField />
      <Floor />
      <Suspense fallback={null}>
        <NameText />
        {placements.map((p, i) => (
          <Door
            key={p.project.title}
            placement={p}
            accent={i === placements.length - 1}
            selected={false}
            onSelect={() => {}}
          />
        ))}
      </Suspense>
    </Canvas>
  )
}
