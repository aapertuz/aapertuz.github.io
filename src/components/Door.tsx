import { useCursor } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { easing } from 'maath'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointLight } from 'three'
import type { DoorPlacement } from '../scene/layout'
import { createRoomTexture } from './roomTexture'

const FRAME_W = 1.5
const FRAME_H = 2.7
const FRAME_T = 0.09 // frame bar thickness
const FRAME_D = 0.14 // frame depth
const OPENING_W = FRAME_W - FRAME_T * 2
const OPENING_H = FRAME_H - FRAME_T
const ACTION_Y = 0.31
const ACTION_H = 0.34

interface DoorProps {
  placement: DoorPlacement
  accent?: boolean
  selected: boolean
  onSelect: () => void
}

export function Door({ placement, accent = false, selected, onSelect }: DoorProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const light = useRef<PointLight>(null)
  const roomTexture = useMemo(
    () => createRoomTexture(placement.project),
    [placement.project],
  )

  useEffect(() => () => roomTexture?.dispose(), [roomTexture])

  useFrame((_, delta) => {
    const lightIntensity = selected ? 1.5 : hovered ? 2.2 : 1.1
    if (light.current) easing.damp(light.current, 'intensity', lightIntensity, 0.2, delta)
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

  const visit = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (!placement.project.link) return
    window.open(placement.project.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <group
      position={placement.position}
      rotation-y={placement.rotationY}
      onPointerOver={over}
      onPointerOut={out}
      onClick={click}
    >
      {/* frame: two side jambs */}
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
        <meshBasicMaterial
          map={roomTexture ?? undefined}
          color={roomTexture ? '#ffffff' : placement.project.room.base}
        />
      </mesh>
      <mesh
        position={[0, ACTION_Y, 0.01]}
        onClick={visit}
        onPointerOver={over}
        onPointerOut={out}
      >
        <planeGeometry args={[OPENING_W, ACTION_H]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <pointLight
        ref={light}
        position={[0, OPENING_H / 2, 0.6]}
        intensity={1.1}
        distance={5}
        color={placement.project.room.light}
      />

    </group>
  )
}
