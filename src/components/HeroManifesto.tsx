import { Text } from '@react-three/drei'

export function HeroManifesto() {
  return (
    <Text
      position={[0, 3.45, -6]}
      anchorX="center"
      anchorY="middle"
      color="rgba(255, 255, 255, 0.6)"
      fontSize={0.28}
      lineHeight={1.4}
      maxWidth={7.4}
      textAlign="center"
    >
      {'Some problems have felt like closed doors.\nThese are the projects I’m building to open them.'}
    </Text>
  )
}
