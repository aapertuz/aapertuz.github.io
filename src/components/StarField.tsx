import { Sparkles, Stars } from '@react-three/drei'

export function StarField() {
  return (
    <group>
      <Stars radius={80} depth={50} count={4000} factor={4} saturation={0} fade speed={0.5} />
      <Sparkles
        count={60}
        scale={[40, 14, 40]}
        size={3}
        speed={0.3}
        opacity={0.6}
        color="#ffffff"
        position={[0, 6, -4]}
      />
    </group>
  )
}
