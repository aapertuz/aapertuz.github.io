import { Text, useCursor } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef, useState } from 'react'
import type { MeshStandardMaterial, PointLight } from 'three'
import type { DoorPlacement } from '../scene/layout'

const LABEL_FONT = '/fonts/inter-medium.woff'

const FRAME_W = 1.5
const FRAME_H = 2.7
const FRAME_T = 0.09 // frame bar thickness
const FRAME_D = 0.14 // frame depth
const OPENING_W = FRAME_W - FRAME_T * 2
const OPENING_H = FRAME_H - FRAME_T

interface DoorProps {
  placement: DoorPlacement
  accent?: boolean
  selected: boolean
  onSelect: () => void
}

export function Door({ placement, accent = false, selected, onSelect }: DoorProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const glow = useRef<MeshStandardMaterial>(null)
  const light = useRef<PointLight>(null)

  useFrame((_, delta) => {
    const lit = hovered || selected
    if (glow.current) easing.damp(glow.current, 'emissiveIntensity', lit ? 1.15 : 0.6, 0.2, delta)
    if (light.current) easing.damp(light.current, 'intensity', lit ? 2.6 : 1.4, 0.2, delta)
  })

  const frameColor = accent ? '#e8a33d' : '#141414'

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
  }
  const out = () => setHovered(false)
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect()
  }

  return (
    <group
      position={placement.position}
      rotation-y={placement.rotationY}
      onPointerOver={over}
      onPointerOut={out}
      onClick={click}
    >
      {/* frame: two jambs + header */}
      <mesh position={[-(FRAME_W - FRAME_T) / 2, FRAME_H / 2, 0]}>
        <boxGeometry args={[FRAME_T, FRAME_H, FRAME_D]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[(FRAME_W - FRAME_T) / 2, FRAME_H / 2, 0]}>
        <boxGeometry args={[FRAME_T, FRAME_H, FRAME_D]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, FRAME_H - FRAME_T / 2, 0]}>
        <boxGeometry args={[FRAME_W, FRAME_T, FRAME_D]} />
        <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.3} />
      </mesh>

      {/* glowing doorway */}
      <mesh position={[0, OPENING_H / 2, -0.02]}>
        <planeGeometry args={[OPENING_W, OPENING_H]} />
        <meshStandardMaterial
          ref={glow}
          color="#100a03"
          emissive="#f0a24a"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight ref={light} position={[0, OPENING_H / 2, 0.6]} intensity={1.6} distance={5} color="#ffb45e" />

      {/* door panel, hinged on the left jamb, swung open ~68° toward the viewer */}
      <group position={[-OPENING_W / 2, 0, FRAME_D / 2]} rotation-y={-1.2}>
        <mesh position={[OPENING_W / 2, OPENING_H / 2, 0]}>
          <boxGeometry args={[OPENING_W, OPENING_H, 0.05]} />
          <meshStandardMaterial color="#0b0b0b" roughness={0.35} metalness={0.4} />
        </mesh>
        {/* handle */}
        <mesh position={[OPENING_W - 0.12, OPENING_H / 2, 0.05]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#8a8a8a" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* labels beside the doorway */}
      <group position={[FRAME_W / 2 + 0.22, 2.05, 0.02]}>
        <Text font={LABEL_FONT} fontSize={0.13} anchorX="left" anchorY="top" color="#ffffff" letterSpacing={0.02}>
          {placement.project.title}
        </Text>
        <Text
          font={LABEL_FONT}
          position={[0, -0.2, 0]}
          fontSize={0.07}
          anchorX="left"
          anchorY="top"
          color="#8f8f8f"
          maxWidth={1.1}
        >
          {placement.project.subheadline}
        </Text>
      </group>
    </group>
  )
}
