import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useEffect, useMemo, useRef } from 'react'
import type { Group } from 'three'

export function HeroManifesto({ profile = false }: { profile?: boolean }) {
  const group = useRef<Group>(null)
  const settled = useRef(false)
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  useEffect(() => { settled.current = false }, [profile])
  useFrame((_, delta) => {
    if (!group.current || settled.current) return
    const scale = profile ? 0.72 : 1
    if (reducedMotion) {
      group.current.scale.setScalar(scale)
      settled.current = true
    } else {
      settled.current = !easing.damp(group.current.scale, 'x', scale, 0.45, Math.min(delta, 0.05))
      group.current.scale.setScalar(group.current.scale.x)
    }
  })

  return (
    <group ref={group} position={[0, 1.85, -13]}>
      <Text
        layers-mask={1}
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
    </group>
  )
}
