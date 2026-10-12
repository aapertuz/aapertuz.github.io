import { Center, Text3D } from '@react-three/drei'

const FONT = '/fonts/helvetiker_bold.typeface.json'

function Line({ text, size, y }: { text: string; size: number; y: number }) {
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
        <meshStandardMaterial color="#ffffff" roughness={0.42} metalness={0.08} />
      </Text3D>
    </Center>
  )
}

export function NameText({ onSelect }: { onSelect?: () => void }) {
  return (
    <group position={[0, 1.55, -13]} onClick={onSelect}>
      <Line text="Alexis Pertuz" size={0.84} y={1.35} />
      {/* dedicated light so the white faces read against the black background */}
      <pointLight position={[0, 2, 4]} intensity={14} distance={12} />
    </group>
  )
}
