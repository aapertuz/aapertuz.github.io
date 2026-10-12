import { Matrix4, Vector2, Vector3, type Camera } from 'three'
import type { DoorPlacement } from './layout'
import { FRAME_HEIGHT, FRAME_THICKNESS, FRAME_WIDTH } from '../components/frameGeometry'

// Normalized artwork coordinates, measured from the bottom left. Keep a
// recognizable subject in each narrow opening without changing image scale.
export const previewFocalPoints: Record<string, readonly [number, number]> = {
  Weft: [0.61, 0.39], // conversation in the foreground
  Polar: [0.59, 0.43], // person facing the workspace
  EasyMD: [0.59, 0.51], // doctor on the consultation screen
  GigPilot: [0.71, 0.42], // assistant at the desk
  Ascent: [0.185, 0.42], // face of the person seated at the desk on the left
  ByteForm: [0.12, 0.48], // person seated at the desk on the left
}

export function createPreviewFraming(placement: DoorPlacement) {
  const height = FRAME_HEIGHT - FRAME_THICKNESS
  const width = FRAME_WIDTH - FRAME_THICKNESS * 2
  const opening = new Matrix4().makeRotationY(placement.rotationY)
    .setPosition(...placement.position)
    .multiply(new Matrix4().makeTranslation(0, height / 2, -0.16))
  const corners = [
    new Vector3(-width / 2, -height / 2, 0), new Vector3(width / 2, -height / 2, 0),
    new Vector3(-width / 2, height / 2, 0), new Vector3(width / 2, height / 2, 0),
  ].map(point => point.applyMatrix4(opening))
  const point = new Vector3()
  const focal = previewFocalPoints[placement.project.title] ?? [0.5, 0.5]

  return (camera: Camera, crop: Vector2, progress: number, offset: Vector2) => {
    if (progress >= 1) return offset.set(0, 0)
    let left = 1, right = 0, bottom = 1, top = 0
    for (const corner of corners) {
      point.copy(corner).project(camera)
      const u = Math.max(0, Math.min(1, point.x * 0.5 + 0.5))
      const v = Math.max(0, Math.min(1, point.y * 0.5 + 0.5))
      left = Math.min(left, u)
      right = Math.max(right, u)
      bottom = Math.min(bottom, v)
      top = Math.max(top, v)
    }
    const minU = (left - 0.5) * crop.x + 0.5
    const maxU = (right - 0.5) * crop.x + 0.5
    const minV = (bottom - 0.5) * crop.y + 0.5
    const maxV = (top - 0.5) * crop.y + 0.5
    // Bound the pan by the visible opening, so no image edge can enter it.
    const x = Math.max(-minU, Math.min(1 - maxU, focal[0] - (minU + maxU) / 2))
    const y = Math.max(-minV, Math.min(1 - maxV, focal[1] - (minV + maxV) / 2))
    return offset.set(x * (1 - progress), y * (1 - progress))
  }
}
