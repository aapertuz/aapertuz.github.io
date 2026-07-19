import { Center, Text3D } from '@react-three/drei'

const FONT = '/fonts/helvetiker_bold.typeface.json'

function Line({ text, size, y }: { text: string; size: number; y: number }) {
  return (
    <Center position={[0, y, 0]}>
      <Text3D
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
        <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.15} />
      </Text3D>
    </Center>
  )
}

export function NameText() {
  return (
    <group position={[0, 0, -6]}>
      <Line text="I'm" size={0.3} y={3.05} />
      <Line text="Lex" size={0.7} y={2.15} />
      <Line text="Pertuz" size={1.1} y={0.85} />
      {/* dedicated light so the white faces read against the black background */}
      <pointLight position={[0, 2, 4]} intensity={14} distance={12} />
    </group>
  )
}
