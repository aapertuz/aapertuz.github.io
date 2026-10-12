import { CubicBezierCurve3, Quaternion, Vector3 } from 'three'
import { revealProgress } from './entrance'

export const RETURN_DURATION = 2.8

export function createReturnJourney(path: CubicBezierCurve3, entryElapsed: number, rotation: Quaternion) {
  return {
    path: path.clone(),
    start: revealProgress(entryElapsed, 0, 2.6),
    rotation: rotation.clone(),
    elapsed: 0,
  }
}

export function advanceReturnJourney(
  journey: ReturnType<typeof createReturnJourney>,
  delta: number,
  homeRotation: Quaternion,
  position: Vector3,
  rotation: Quaternion,
  reducedMotion: boolean,
) {
  journey.elapsed += Math.min(delta, 0.05)
  const progress = reducedMotion ? 1 : revealProgress(journey.elapsed, 0, RETURN_DURATION)
  // Retrace the approach at a gentle pace, including an interrupted approach.
  journey.path.getPointAt(journey.start * (1 - progress), position)
  // Back through the opening before turning to face the corridor.
  const turn = reducedMotion ? 1 : revealProgress(journey.elapsed / RETURN_DURATION, 0.28, 0.64)
  rotation.slerpQuaternions(journey.rotation, homeRotation, turn)
  return reducedMotion || journey.elapsed >= RETURN_DURATION
}
