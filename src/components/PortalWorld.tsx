import { useTexture } from '@react-three/drei'
import { SRGBColorSpace, type Mesh, type MeshBasicMaterial } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { easing } from 'maath'
import type { Project } from '../data/projects'
import { DARK_FRAME_HOLD, DOOR_STAGGER, revealProgress } from '../scene/entrance'

// The scenic backdrop is recessed well behind real threshold geometry. The
// portal clips the entire scene, preserving parallax as the camera approaches.
export function PortalWorld({ project, selected, revealing, entranceOrder }: {
  project: Project
  selected: boolean
  revealing: boolean
  entranceOrder: number
}) {
  const texture = useTexture(`/worlds/${project.title.toLowerCase()}.webp`)
  // Preserve the artwork aspect ratio; the doorway supplies the only crop.
  texture.repeat.set(1, 1)
  texture.offset.set(0, 0)
  texture.colorSpace = SRGBColorSpace
  const image = texture.image as HTMLImageElement
  const backdrop = useRef<Mesh>(null)
  const elapsed = useRef(0)
  const artwork = useMemo(() => ({ blur: { value: 4.5 }, reveal: { value: 0 } }), [])
  const revealArtwork = useMemo(() => (shader: Parameters<MeshBasicMaterial['onBeforeCompile']>[0]) => {
    shader.uniforms.artworkBlur = artwork.blur
    shader.uniforms.artworkReveal = artwork.reveal
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform float artworkBlur; uniform float artworkReveal;')
      .replace('#include <map_fragment>', `
        #ifdef USE_MAP
          // Blend existing mip levels to soften the artwork with one lookup.
          // Zero bias restores the ordinary material sampling after the reveal.
          diffuseColor *= texture2D(map, vMapUv, artworkBlur);
          diffuseColor.rgb *= artworkReveal;
        #endif
      `)
  }, [artwork])
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const { size } = useThree()
  // Fit the full interior to the arrival camera, with only the crop needed to
  // cover the viewport. The original doorway composition stays unchanged.
  const fov = size.width <= 900 ? 52 : 40
  const visibleHeight = 2 * 6.76 * Math.tan(fov * Math.PI / 360)
  const fittedHeight = Math.max(visibleHeight, visibleHeight * (size.width / size.height) / (image.width / image.height)) * 1.04
  useFrame((_, frameDelta) => {
    const delta = Math.min(frameDelta, 0.05)
    if (revealing) elapsed.current += delta
    const delay = DARK_FRAME_HOLD + entranceOrder * DOOR_STAGGER + 0.18
    const immediate = reducedMotion || selected
    artwork.reveal.value = revealing ? (immediate ? 1 : revealProgress(elapsed.current, delay, 0.8)) : 0
    artwork.blur.value = immediate ? 0 : 4.5 * (1 - revealProgress(elapsed.current, delay, 1.75))
    if (!backdrop.current) return
    const scale = selected ? fittedHeight / 11.1 : 1
    if (reducedMotion) backdrop.current.scale.setScalar(scale)
    else easing.damp3(backdrop.current.scale, [scale, scale, scale], 0.65, delta)
  })

  return (
    <>
      <ambientLight intensity={0.65} />
      <pointLight position={[0, 3, -3]} color={project.room.light} intensity={24} distance={18} />
      <mesh ref={backdrop} position={[0, 0, -8]}>
        <planeGeometry args={[11.1 * (image.width / image.height), 11.1]} />
        <meshBasicMaterial map={texture} toneMapped={false} onBeforeCompile={revealArtwork} />
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
