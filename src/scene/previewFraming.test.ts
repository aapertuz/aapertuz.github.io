import { describe, expect, test } from 'bun:test'
import { Matrix4, PerspectiveCamera, Vector2, Vector3 } from 'three'
import { projects } from '../data/projects'
import { FRAME_HEIGHT, FRAME_THICKNESS, FRAME_WIDTH } from '../components/frameGeometry'
import { getHomeCameraZ } from './cameraFraming'
import { layoutDoors } from './layout'
import { createPreviewFraming, previewFocalPoints } from './previewFraming'

describe('doorway preview framing', () => {
  for (const [width, height] of [[1440, 900], [390, 844], [844, 390], [2560, 1080]]) {
    test(`frames each subject without exposing artwork edges at ${width} × ${height}`, () => {
      const narrow = width <= 900
      const camera = new PerspectiveCamera(narrow ? 52 : 40, width / height)
      camera.position.set(0, narrow ? 3.15 : 1.65, getHomeCameraZ(width, height, camera.fov))
      camera.lookAt(0, narrow ? 2.5 : 1.65, -6)
      camera.updateMatrixWorld()
      const imageAspect = 1672 / 941
      const crop = new Vector2(Math.min(1, camera.aspect / imageAspect), Math.min(1, imageAspect / camera.aspect))
      for (const placement of layoutDoors(projects, narrow)) {
        const frame = createPreviewFraming(placement)
        const focal = previewFocalPoints[placement.project.title]
        expect(focal).toBeDefined()
        const opening = new Matrix4().makeRotationY(placement.rotationY).setPosition(...placement.position)
          .multiply(new Matrix4().makeTranslation(0, (FRAME_HEIGHT - FRAME_THICKNESS) / 2, -0.16))
        const corners = [-1, 1].flatMap(x => [-1, 1].map(y => {
          const point = new Vector3(x * (FRAME_WIDTH - 2 * FRAME_THICKNESS) / 2, y * (FRAME_HEIGHT - FRAME_THICKNESS) / 2, 0)
            .applyMatrix4(opening).project(camera)
          return new Vector2(Math.max(0, Math.min(1, point.x * 0.5 + 0.5)), Math.max(0, Math.min(1, point.y * 0.5 + 0.5)))
            .subScalar(0.5).multiply(crop).addScalar(0.5)
        }))
        const preview = frame(camera, crop, 0, new Vector2())
        for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
          const offset = frame(camera, crop, progress, new Vector2())
          expect(offset.length()).toBeLessThanOrEqual(preview.length())
          for (const point of corners) {
            const uv = point.clone().add(offset)
            expect(uv.x).toBeGreaterThanOrEqual(-1e-8)
            expect(uv.x).toBeLessThanOrEqual(1 + 1e-8)
            expect(uv.y).toBeGreaterThanOrEqual(-1e-8)
            expect(uv.y).toBeLessThanOrEqual(1 + 1e-8)
          }
        }
        const center = new Vector2(
          (Math.min(...corners.map(p => p.x)) + Math.max(...corners.map(p => p.x))) / 2,
          (Math.min(...corners.map(p => p.y)) + Math.max(...corners.map(p => p.y))) / 2,
        )
        expect(center.clone().add(preview).distanceTo(new Vector2(...focal)))
          .toBeLessThanOrEqual(center.distanceTo(new Vector2(...focal)) + 1e-8)
        expect(frame(camera, crop, 1, new Vector2()).toArray()).toEqual([0, 0])
      }
    })
  }
})
