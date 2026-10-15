import { describe, expect, test } from 'bun:test'
import { Box3, CubicBezierCurve3, Frustum, Matrix4, PerspectiveCamera, Vector3 } from 'three'
import { FRAME_HEIGHT, FRAME_WIDTH } from '../components/frameGeometry'
import { projects } from '../data/projects'
import { getHomeCameraZ } from './cameraFraming'
import { layoutDoors } from './layout'
import { aimMobileProfile, getProfileFraming } from './profileFraming'
import { advanceReturnJourney, createReturnJourney } from './returnJourney'

describe('mobile profile framing', () => {
  for (const [width, height] of [[320, 568], [390, 844], [430, 932], [768, 1024], [844, 390]]) {
    test(`follows the heading above the doors at ${width} × ${height}`, () => {
      const framing = getProfileFraming(width, height, true)
      const camera = new PerspectiveCamera(52, width / height, 0.1, 100)
      camera.position.set(0, 3.15, getHomeCameraZ(width, height, 52))
      camera.lookAt(0, 2.5, -6)
      camera.updateMatrixWorld()
      const homeHeading = framing.name.clone().project(camera)
      const compact = width <= 640 && height <= 700
      const expectedTop = compact ? 0.15 : 0.19
      // The heading starts at the existing mobile intro, without a handoff jump.
      expect((1 - homeHeading.y) / 2 - (compact ? 16.5 : 20.9) / height).toBeCloseTo(expectedTop, 6)
      expect(framing.end.y).toBeGreaterThan(camera.position.y)

      camera.position.copy(framing.end)
      camera.lookAt(framing.look)
      camera.updateMatrixWorld()
      const arrivedHeading = framing.name.clone().project(camera)
      expect(arrivedHeading.y).toBeCloseTo(homeHeading.y, 6)
      expect(arrivedHeading.x).toBeCloseTo(0, 6)
      const view = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
      for (const door of layoutDoors(projects, true)) {
        const corners: Vector3[] = []
        for (const x of [-FRAME_WIDTH / 2, FRAME_WIDTH / 2]) {
          for (const y of [0, FRAME_HEIGHT]) {
            for (const z of [-0.19, 0.19]) {
              corners.push(new Vector3(x, y, z).applyAxisAngle(new Vector3(0, 1, 0), door.rotationY).add(new Vector3(...door.position)))
            }
          }
        }
        // The details appear in clear space above the corridor, never over doors.
        expect(view.intersectsBox(new Box3().setFromPoints(corners))).toBe(false)
      }
    })
  }

  for (const [width, height] of [[320, 568], [390, 844], [430, 932], [768, 1024], [844, 390]]) {
    test(`keeps the name fixed throughout approach and return at ${width} × ${height}`, () => {
      const framing = getProfileFraming(width, height, true)
      const camera = new PerspectiveCamera(52, width / height, 0.1, 100)
      camera.position.set(0, 3.15, getHomeCameraZ(width, height, 52))
      camera.lookAt(0, 2.5, -6)
      camera.updateMatrixWorld()
      const homeRotation = camera.quaternion.clone()
      const headingY = framing.name.clone().project(camera).y
      const path = new CubicBezierCurve3(camera.position.clone(),
        new Vector3(camera.position.x, framing.end.y, camera.position.z),
        framing.end.clone().add(new Vector3(0, 0, 2)), framing.end)
      const checkHeading = () => {
        camera.updateMatrixWorld()
        expect(framing.name.clone().project(camera).y).toBeCloseTo(headingY, 6)
      }
      for (let frame = 0; frame <= 156; frame++) {
        path.getPointAt(frame / 156, camera.position)
        aimMobileProfile(camera.position, framing, camera.quaternion)
        checkHeading()
      }
      const returning = createReturnJourney(path, 2.6, camera.quaternion)
      let complete = false
      while (!complete) {
        complete = advanceReturnJourney(returning, 1 / 60, homeRotation, camera.position, camera.quaternion, false)
        aimMobileProfile(camera.position, framing, camera.quaternion)
        checkHeading()
      }
      // Handing control back to the home camera must not introduce a final jump.
      expect(camera.quaternion.angleTo(homeRotation)).toBeLessThan(1e-7)
    })
  }

  test('preserves the desktop name and arrival pose', () => {
    const { name, look, end } = getProfileFraming(1440, 900, false)
    expect(name.toArray()).toEqual([0, 2.9, -13])
    expect(end.z).toBe(-4)
    expect(look.y).toBeCloseTo(2.9 - 9 * Math.tan(20 * Math.PI / 180) * 0.54)
    expect(end.y).toBeCloseTo(Math.max(0.9, look.y))
  })
})
