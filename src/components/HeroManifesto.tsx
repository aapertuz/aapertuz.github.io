import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import type { Group } from 'three'
import { Text } from '@react-three/drei'

export function HeroManifesto({ profile = false }: { profile?: boolean }) {
  const group = useRef<Group>(null)
  const settled = useRef(false)
  useEffect(() => { settled.current = false }, [profile])
  useFrame((_, delta) => {
    if (!group.current || settled.current) return
    settled.current = !easing.damp(group.current.position, 'y', profile ? -4 : 0, 0.5, delta)
  })
  return (
    <group ref={group}><Text
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
    </Text></group>
  )
}
