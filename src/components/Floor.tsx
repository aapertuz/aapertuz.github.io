import { MeshReflectorMaterial } from '@react-three/drei'

export function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 2]}>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={60}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080808"
        metalness={0.6}
        mirror={0.75}
      />
    </mesh>
  )
}
