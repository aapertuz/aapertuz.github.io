import { useTexture } from '@react-three/drei'
import { SRGBColorSpace, type Mesh } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { easing } from 'maath'
import type { Project } from '../data/projects'

// The scenic backdrop is recessed well behind real threshold geometry. The
// portal clips the entire scene, preserving parallax as the camera approaches.
export function PortalWorld({ project, selected }: { project: Project; selected: boolean }) {
  const texture = useTexture(`/worlds/${project.title.toLowerCase()}.png`)
  // Preserve the artwork aspect ratio; the doorway supplies the only crop.
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)
  texture.colorSpace = SRGBColorSpace
  const image = texture.image as HTMLImageElement
  const backdrop = useRef<Mesh>(null)
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const { size } = useThree()
  // Fit the full interior to the arrival camera, with only the crop needed to
  // cover the viewport. The original doorway composition stays unchanged.
  const fov = size.width <= 900 ? 52 : 40
  const visibleHeight = 2 * 6.76 * Math.tan(fov * Math.PI / 360)
  const fittedHeight = Math.max(visibleHeight, visibleHeight * (size.width / size.height) / (image.width / image.height)) * 1.04
  useFrame((_, delta) => {
    if (!backdrop.current) return
    const scale = selected ? fittedHeight / 11.1 : 1
    if (reducedMotion) backdrop.current.scale.setScalar(scale)
    else easing.damp3(backdrop.current.scale, [scale, scale, scale], 0.65, delta)
  })

  return (
    <>
      <color attach="background" args={[project.room.frame]} />
      <ambientLight intensity={0.65} />
      <pointLight position={[0, 3, -3]} color={project.room.light} intensity={24} distance={18} />
      <mesh ref={backdrop} position={[0, 0, -8]}>
        <planeGeometry args={[11.1 * (image.width / image.height), 11.1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 2.4, -1.65, -2.8]} rotation={[0.12, side * 0.4, 0.2]} scale={[0.8, 1.2, 0.9]}>
            <dodecahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial color={project.room.frame} roughness={0.93} />
          </mesh>
          <mesh position={[side * 2.8, 0.5, -5.2]} rotation-y={side * 0.15}>
            <boxGeometry args={[0.18, 4.8, 0.24]} />
            <meshStandardMaterial color={project.room.frame} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </>
  )
}
