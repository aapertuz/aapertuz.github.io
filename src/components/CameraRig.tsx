import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useMemo, useRef } from 'react'
import { CubicBezierCurve3, Matrix4, Quaternion, Vector3 } from 'three'
import { FRAME_HEIGHT, FRAME_THICKNESS } from './frameGeometry'
import { getHomeCameraZ } from '../scene/cameraFraming'
import type { DoorPlacement } from '../scene/layout'

const HOME_POS = new Vector3(0, 1.65, 14.5)
const HOME_LOOK = new Vector3(0, 1.65, -6)

const targetPos = new Vector3()
const targetLook = new Vector3()
const aimMatrix = new Matrix4()
const targetRotation = new Quaternion()

export function CameraRig({ focus, narrow, onSettled }: { focus: DoorPlacement | null; narrow: boolean; onSettled?: (focus: DoorPlacement) => void }) {
  const journey = useRef<{ focus: DoorPlacement; path: CubicBezierCurve3; rotation: Quaternion; elapsed: number } | null>(null)
  const settled = useRef<DoorPlacement | null>(null)
  const look = useRef(HOME_LOOK.clone())
  const reducedMotion = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, [])

  const focusPose = useMemo(() => {
    if (!focus) return null
    const normal = new Vector3(Math.sin(focus.rotationY), 0, Math.cos(focus.rotationY))
    const threshold = new Vector3(focus.position[0], focus.position[1] + (FRAME_HEIGHT - FRAME_THICKNESS) / 2, focus.position[2]).addScaledVector(normal, -0.16)
    return { normal, threshold, inward: normal.clone().negate() }
  }, [focus])

  useFrame((state, frameDelta) => {
    // A resumed tab must not jump through a journey or its damping animation.
    const delta = Math.min(frameDelta, 0.05)
    if ('fov' in state.camera && state.camera.fov !== (narrow ? 52 : 40)) {
      state.camera.fov = narrow ? 52 : 40
      state.camera.updateProjectionMatrix()
      state.invalidate()
    }
    if (focus && focusPose) {
      const { normal, threshold, inward } = focusPose
      if (journey.current?.focus !== focus) {
        journey.current = {
          focus, elapsed: 0, rotation: state.camera.quaternion.clone(),
          path: new CubicBezierCurve3(
            state.camera.position.clone(),
            threshold.clone().addScaledVector(normal, 6),
            threshold.clone().addScaledVector(normal, 2.5),
            threshold.clone().addScaledVector(normal, -1.4),
          ),
        }
      }
      journey.current.elapsed += Math.min(delta, 0.05)
      const progress = reducedMotion ? 1 : Math.min(journey.current.elapsed / 2.6, 1)
      // One uninterrupted move: align with the opening, cross it, settle inside.
      const eased = progress * progress * (3 - 2 * progress)
      // Arc-length sampling prevents the control-point spacing from changing speed.
      journey.current.path.getPointAt(eased, targetPos)
      const distance = targetLook.subVectors(targetPos, threshold).dot(normal)
      // Track the opening until the portal fills the view, then face into the room.
      const interior = Math.max(0, Math.min(1, (1.6 - distance) / 1.5))
      targetLook.subVectors(threshold, targetPos).normalize()
        .lerp(inward, interior * interior * (3 - 2 * interior)).normalize()
        .add(targetPos)
      aimMatrix.lookAt(targetPos, targetLook, state.camera.up)
      targetRotation.setFromRotationMatrix(aimMatrix)
      const turn = Math.min(journey.current.elapsed / 0.55, 1)
      state.camera.quaternion.slerpQuaternions(journey.current.rotation, targetRotation, reducedMotion ? 1 : turn * turn * (3 - 2 * turn))
    } else {
      journey.current = null
      const fov = 'fov' in state.camera && typeof state.camera.fov === 'number' ? state.camera.fov : 40
      const homeZ = getHomeCameraZ(state.size.width, state.size.height, fov)
      targetPos.set(HOME_POS.x, narrow ? 3.15 : HOME_POS.y, homeZ)
      targetLook.copy(HOME_LOOK)
      if (narrow) targetLook.y = 2.5
    }
    if (reducedMotion) {
      state.camera.position.copy(targetPos)
      look.current.copy(targetLook)
    } else {
      if (focus) state.camera.position.copy(targetPos)
      else easing.damp3(state.camera.position, targetPos, 0.45, delta)
      if (focus) look.current.copy(targetLook)
      else easing.damp3(look.current, targetLook, 0.45, delta)
    }
    if (!focus) state.camera.lookAt(look.current)
    if (!focus) settled.current = null
    else if (settled.current !== focus && (reducedMotion || (journey.current?.elapsed ?? 0) >= 2.6) && state.camera.position.distanceToSquared(targetPos) < 0.0004 && look.current.distanceToSquared(targetLook) < 0.0004) {
      settled.current = focus
      onSettled?.(focus)
    }
  })

  return null
}
