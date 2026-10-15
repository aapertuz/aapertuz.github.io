import { Center, Html, Text3D, useCursor } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useState } from 'react'
import { getProfileFraming } from '../scene/profileFraming'
import { useFrameEnvironment } from './useFrameEnvironment'

const FONT = '/fonts/helvetiker_bold.typeface.json'

function Line({ text, size, y }: { text: string; size: number; y: number }) {
  const environment = useFrameEnvironment()
  return (
    <Center position={[0, y, 0]}>
      <Text3D
        layers-mask={1}
        font={FONT}
        size={size}
        height={0.06}
        bevelEnabled
        bevelSize={size * 0.015}
        bevelThickness={0.015}
        bevelSegments={4}
        curveSegments={10}
      >
        {text}
        <meshPhysicalMaterial
          color="#f7f4ee"
          roughness={0.32}
          metalness={0.2}
          envMap={environment}
          envMapIntensity={1.6}
          emissive="#f7f4ee"
          emissiveIntensity={0.12}
          clearcoat={0.4}
          clearcoatRoughness={0.22}
        />
      </Text3D>
    </Center>
  )
}

export function NameText({ onSelect, visible = true, narrow = false, profile = false }: { onSelect?: () => void; visible?: boolean; narrow?: boolean; profile?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const size = useThree((state) => state.size)
  useCursor(hovered && visible && !!onSelect)

  if (narrow && !visible) return null
  if (narrow) return (
    <Html center position={getProfileFraming(size.width, size.height, true).name} zIndexRange={[6, 6]}>
      <button
        className="scene-mobile-name"
        disabled={profile || !onSelect}
        onClick={onSelect}
      >Antonio Pertuz</button>
    </Html>
  )

  return (
    <group
      visible={visible}
      position={[0, 1.55, -13]}
      onClick={(event) => { event.stopPropagation(); setHovered(false); onSelect?.() }}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
    >
      {/* One continuous hit area for the name, manifesto, and their whitespace. */}
      {onSelect && <mesh position={[0, 0.55, 0.12]}>
        <planeGeometry args={[10, 3.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>}
      <Line text="Antonio Pertuz" size={0.84} y={1.35} />
      {/* The studio map lights the name without spilling extra light onto the floor. */}
      <pointLight position={[0, 2, 4]} intensity={14} distance={12} />
    </group>
  )
}
