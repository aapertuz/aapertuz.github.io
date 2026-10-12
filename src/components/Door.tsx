import { Html, MeshPortalMaterial, useCursor } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { easing } from 'maath'
import { Suspense, useEffect, useMemo, useRef, useState, type ComponentRef, type CSSProperties } from 'react'
import { Color, type MeshStandardMaterial, type PointLight, type Texture } from 'three'
import type { DoorPlacement } from '../scene/layout'
import { DARK_FRAME_HOLD, DOOR_STAGGER, revealProgress, type DoorReveal } from '../scene/entrance'
import { PortalWorld } from './PortalWorld'

import { createFrameGeometry, FRAME_WIDTH, FRAME_HEIGHT, FRAME_THICKNESS } from './frameGeometry'

const FRAME_METAL = { roughness: 0.46, metalness: 0.44, envMapIntensity: 0.25 }
const OPENING_W = FRAME_WIDTH - FRAME_THICKNESS * 2
const OPENING_H = FRAME_HEIGHT - FRAME_THICKNESS

interface DoorProps {
  revealing: boolean
  reveal: DoorReveal
  entranceOrder: number
  environment: Texture
  placement: DoorPlacement
  selected: boolean
  returning: boolean
  labelsVisible: boolean
  onSelect: () => void
}

export function Door({ revealing, reveal, entranceOrder, placement, environment, selected, returning, labelsVisible, onSelect }: DoorProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const geometry = useMemo(createFrameGeometry, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  const elapsed = useRef(0)
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const doorGlow = useMemo(() => ({ value: 0 }), [])
  const light = useRef<PointLight>(null)
  const portal = useRef<ComponentRef<typeof MeshPortalMaterial>>(null)
  // Illuminate the existing metal itself, without extra bars over the opening.
  const illuminateFrame = useMemo(() => (shader: Parameters<MeshStandardMaterial['onBeforeCompile']>[0]) => {
    shader.uniforms.doorGlow = doorGlow
    shader.uniforms.doorColor = { value: new Color(placement.project.room.light) }
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 framePosition; varying vec3 frameNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nframePosition = position; frameNormal = normal;')
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 framePosition; varying vec3 frameNormal; uniform vec3 doorColor; uniform float doorGlow;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        float recess = smoothstep(0.035, 0.052, framePosition.z)
          * (1.0 - smoothstep(0.075, 0.09, framePosition.z));
        diffuseColor.rgb *= 1.0 - recess * 0.48;
      `)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        // Fine variations in the finish break up perfectly uniform highlights.
        float phase = framePosition.y * 1550.0 + sin(framePosition.x * 620.0) * 2.0;
        float brushed = sin(phase) * (1.0 - smoothstep(0.5, 3.0, fwidth(phase)));
        roughnessFactor = clamp(roughnessFactor + brushed * 0.018 + recess * 0.1, 0.28, 0.55);
      `)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float edgeLight = exp(-abs(framePosition.z + 0.14) * 22.0);
        float inward = max(-frameNormal.x * sign(framePosition.x), 0.0)
          + max(-frameNormal.y, 0.0) * smoothstep(4.1, 4.28, framePosition.y);
        totalEmissiveRadiance += doorColor * edgeLight * inward * 1.2 * doorGlow;
      `)
  }, [placement.project.room.light, doorGlow])
  useFrame(({ camera }, frameDelta) => {
    const delta = Math.min(frameDelta, 0.05)
    if (revealing) elapsed.current += delta
    reveal.current = revealing ? (reducedMotion || selected ? 1 : revealProgress(elapsed.current, DARK_FRAME_HOLD + entranceOrder * DOOR_STAGGER, 1.25)) : 0
    doorGlow.value = reveal.current
    if (portal.current) {
      const distance = (camera.position.x - placement.position[0]) * Math.sin(placement.rotationY)
        + (camera.position.z - placement.position[2]) * Math.cos(placement.rotationY)
      const blend = selected || returning ? Math.max(0, Math.min(1, (1.6 - distance) / 1.5)) : 0
      portal.current.blend = blend * blend * (3 - 2 * blend)
    }
    if (light.current) easing.damp(light.current, 'intensity', placement.project.room.spill.lightIntensity * 0.9 * reveal.current * (hovered ? 1.18 : selected ? 0.82 : 1), 0.2, delta)
  }, -2)
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect() }

  return (
    <group position={placement.position} rotation-y={placement.rotationY}>
      <group onClick={click} onPointerOver={(event) => { event.stopPropagation(); setHovered(true) }} onPointerOut={() => setHovered(false)}>
        <mesh geometry={geometry}>
          <meshStandardMaterial {...FRAME_METAL} color={placement.project.room.frame} envMap={environment} onBeforeCompile={illuminateFrame} />
        </mesh>
        <mesh position={[0, OPENING_H / 2, -0.16]}>
          <planeGeometry args={[OPENING_W, OPENING_H]} />
          <MeshPortalMaterial ref={portal} events={false} blur={0} resolution={256}>
            <color attach="background" args={['#030303']} />
            <Suspense fallback={null}>
              <PortalWorld placement={placement} selected={selected} returning={returning} revealing={revealing} entranceOrder={entranceOrder} />
            </Suspense>
          </MeshPortalMaterial>
        </mesh>
      </group>
      <pointLight ref={light} position={[0, 0.65, 0.28]} intensity={0} distance={4.4} decay={2} color={placement.project.room.light} />
      {labelsVisible && <Html position={[0, FRAME_HEIGHT + 0.55, 0.2]} transform distanceFactor={6} zIndexRange={[5, 1]}>
        <button data-project-index={placement.project.index} className="door-label" style={{ '--sign-light': placement.project.room.light, '--sign-text': placement.project.room.text } as CSSProperties} aria-pressed={selected} onClick={(event) => { event.stopPropagation(); onSelect() }} onPointerDown={(event) => event.stopPropagation()} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)}>
          <strong>{placement.project.title}</strong>
          <span>{placement.project.industry}</span>
        </button>
      </Html>}
    </group>
  )
}
