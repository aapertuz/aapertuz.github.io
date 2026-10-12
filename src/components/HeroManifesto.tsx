import { Text } from '@react-three/drei'

export function HeroManifesto() {
  return (
    <Text
      layers-mask={1}
      position={[0, 1.25, -13]}
      font="/fonts/inter-medium.woff"
      characters={'Some problems have felt like closed doors.\nThese are the projects I’m building to open them.'}
      anchorX="center"
      anchorY="middle"
      color="#b8b7b4"
      fontSize={0.28}
      lineHeight={1.4}
      maxWidth={7.4}
      textAlign="center"
    >
      {'Some problems have felt like closed doors.\nThese are the projects I’m building to open them.'}
    </Text>
  )
}
