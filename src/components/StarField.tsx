import { Sparkles, Stars } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export function StarField() {
  const dpr = useThree((state) => state.viewport.dpr)

  return (
    <group>
      {/* Stars sizes points in drawing-buffer pixels, so account for display density. */}
      <Stars radius={80} depth={50} count={4000} factor={4 * dpr} saturation={0} fade speed={0.5} />
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
