import { describe, expect, test } from 'bun:test'
import { CubicBezierCurve3, Matrix4, Quaternion, Vector3 } from 'three'
import { projects } from '../data/projects'
import { FRAME_HEIGHT, FRAME_THICKNESS } from '../components/frameGeometry'
import { getHomeCameraZ } from './cameraFraming'
import { revealProgress } from './entrance'
import { layoutDoors } from './layout'
import { advanceReturnJourney, createReturnJourney, RETURN_DURATION } from './returnJourney'

describe('return to the corridor', () => {
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    test(`backs out gently and arrives home for every doorway at ${width} × ${height}`, () => {
      const narrow = width <= 900
      const home = new Vector3(0, narrow ? 3.15 : 1.65, getHomeCameraZ(width, height, narrow ? 52 : 40))
      const homeLook = new Vector3(0, narrow ? 2.5 : 1.65, -6)
      const homeRotation = new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(home, homeLook, new Vector3(0, 1, 0)))
      for (const placement of layoutDoors(projects, narrow)) {
        const normal = new Vector3(Math.sin(placement.rotationY), 0, Math.cos(placement.rotationY))
        const threshold = new Vector3(placement.position[0], (FRAME_HEIGHT - FRAME_THICKNESS) / 2, placement.position[2]).addScaledVector(normal, -0.16)
        const path = new CubicBezierCurve3(home, threshold.clone().addScaledVector(normal, 6), threshold.clone().addScaledVector(normal, 2.5), threshold.clone().addScaledVector(normal, -1.4))
        const inside = path.getPointAt(1)
        const insideRotation = new Quaternion().setFromRotationMatrix(new Matrix4().lookAt(inside, inside.clone().sub(normal), new Vector3(0, 1, 0)))
        const journey = createReturnJourney(path, 2.6, insideRotation)
        const position = inside.clone()
        const rotation = insideRotation.clone()
        advanceReturnJourney(journey, 0, homeRotation, position, rotation, false)
        expect(position.distanceTo(inside)).toBeLessThan(1e-8)
        expect(rotation.angleTo(insideRotation)).toBeLessThan(1e-7)
        advanceReturnJourney(journey, 1 / 60, homeRotation, position, rotation, false)
        // The opening frames must retain the fully blended interior, not flash
        // the corridor or jump away from the arrival pose.
        expect(position.distanceTo(inside)).toBeLessThan(0.01)
        expect(position.clone().sub(threshold).dot(normal)).toBeLessThan(0)
        while (journey.elapsed < RETURN_DURATION * 0.28) {
          advanceReturnJourney(journey, 1 / 60, homeRotation, position, rotation, false)
        }
        // Rotation starts only after the camera has cleared the portal blend.
        expect(position.clone().sub(threshold).dot(normal)).toBeGreaterThan(1.6)
        let complete = false
        while (!complete) complete = advanceReturnJourney(journey, 1 / 60, homeRotation, position, rotation, false)
        expect(position.distanceTo(home)).toBeLessThan(1e-8)
        expect(rotation.angleTo(homeRotation)).toBeLessThan(1e-7)
      }
    })
  }

  test('continues from an interrupted approach without snapping to the interior', () => {
    const path = new CubicBezierCurve3(new Vector3(0, 2, 15), new Vector3(0, 2, 8), new Vector3(4, 2, 3), new Vector3(6, 2, 3))
    const elapsed = 1.1
    const current = path.getPointAt(revealProgress(elapsed, 0, 2.6))
    const journey = createReturnJourney(path, elapsed, new Quaternion())
    const position = new Vector3()
    advanceReturnJourney(journey, 0, new Quaternion(), position, new Quaternion(), false)
    expect(position.distanceTo(current)).toBeLessThan(1e-8)
    advanceReturnJourney(journey, 1 / 60, new Quaternion(), position, new Quaternion(), false)
    expect(position.distanceTo(current)).toBeLessThan(0.01)
  })

  test('finishes immediately for reduced motion and limits resumed-tab jumps', () => {
    const path = new CubicBezierCurve3(new Vector3(0, 2, 15), new Vector3(0, 2, 8), new Vector3(4, 2, 3), new Vector3(6, 2, 3))
    const position = new Vector3()
    const rotation = new Quaternion()
    const homeRotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.5)
    const journey = createReturnJourney(path, 2.6, new Quaternion())
    expect(advanceReturnJourney(journey, 10, homeRotation, position, rotation, false)).toBe(false)
    expect(position.distanceTo(path.v3)).toBeLessThan(0.02)
    expect(advanceReturnJourney(journey, 1 / 60, homeRotation, position, rotation, true)).toBe(true)
    expect(position.distanceTo(path.v0)).toBeLessThan(1e-8)
    expect(rotation.angleTo(homeRotation)).toBeLessThan(1e-7)
  })
})
