import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useRef } from 'react'
import { Vector3 } from 'three'
import { getHomeCameraZ } from '../scene/cameraFraming'
import type { DoorPlacement } from '../scene/layout'

const HOME_POS = new Vector3(0, 2.3, 11)
const HOME_LOOK = new Vector3(0, 1.15, -4)

const targetPos = new Vector3()
const targetLook = new Vector3()

export function CameraRig({ focus }: { focus: DoorPlacement | null }) {
  const look = useRef(HOME_LOOK.clone())

  useFrame((state, delta) => {
    if (focus) {
      targetPos.set(...focus.focus)
      targetLook.set(focus.position[0], 1.4, focus.position[2])
    } else {
      const fov = 'fov' in state.camera && typeof state.camera.fov === 'number' ? state.camera.fov : 40
      const homeZ = getHomeCameraZ(state.size.width, state.size.height, fov)
      targetPos.set(HOME_POS.x, HOME_POS.y, homeZ)
      targetLook.copy(HOME_LOOK)
    }
    easing.damp3(state.camera.position, targetPos, 0.45, delta)
    easing.damp3(look.current, targetLook, 0.45, delta)
    state.camera.lookAt(look.current)
  })

  return null
}
