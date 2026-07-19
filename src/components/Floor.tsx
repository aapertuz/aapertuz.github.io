import { MeshReflectorMaterial } from '@react-three/drei'

export function Floor() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 2]}>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        blur={[220, 80]}
        resolution={1024}
        mixBlur={1}
        mixStrength={75}
        roughness={0.72}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#101010"
        metalness={0.6}
        mirror={0.9}
      />
    </mesh>
  )
}
