export function Corridor() {
  return (
    <group>
      {/* Dark side walls and overhead ribs establish a shared vanishing point. */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 6.3, 3.8, -10]}>
            <boxGeometry args={[0.3, 7.6, 40]} />
            <meshStandardMaterial color="#101113" roughness={0.9} />
          </mesh>
          <mesh position={[side * 6.05, 0.1, -10]}>
            <boxGeometry args={[0.2, 0.2, 40]} />
            <meshStandardMaterial color="#2a2b2d" roughness={0.7} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 7.5, -10]}>
        <boxGeometry args={[12.6, 0.2, 40]} />
        <meshStandardMaterial color="#0a0a0b" roughness={1} />
      </mesh>
      {[3, -1, -5, -9, -13, -17].map((z) => (
        <group key={z}>
          <mesh position={[0, 7.3, z]}><boxGeometry args={[12.6, 0.18, 0.22]} /><meshStandardMaterial color="#101113" roughness={0.8} /></mesh>
          {[-1, 1].map((side) => <mesh key={side} position={[side * 6.1, 3.65, z]}><boxGeometry args={[0.18, 7.3, 0.22]} /><meshStandardMaterial color="#101113" roughness={0.8} /></mesh>)}
        </group>
      ))}
    </group>
  )
}
