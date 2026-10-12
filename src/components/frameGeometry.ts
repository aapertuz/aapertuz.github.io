import { BufferGeometry, Float32BufferAttribute, ShapeUtils, Vector2 } from 'three'

export const FRAME_WIDTH = 1.95
export const FRAME_HEIGHT = 4.4
export const FRAME_THICKNESS = 0.12

// Cross-section of one folded metal casing: [inset from outside, depth].
// The front fascia, shadow recess, reveal and small rear lip share vertices.
const section = [
  [0.01, -0.19], [0, -0.18], [0, 0.18], [0.01, 0.19],
  [0.07, 0.19], [0.08, 0.18], [0.08, 0.085],
  [0.072, 0.075], [0.072, 0.052], [0.09, 0.038],
  [0.095, -0.10], [0.112, -0.10], [0.12, -0.108],
  [0.12, -0.145], [0.112, -0.155], [0.105, -0.19],
] as const

export function createFrameGeometry() {
  const halfWidth = FRAME_WIDTH / 2
  // Inset vectors at the corners produce exact mitres through every layer.
  const path = [
    [-halfWidth, 0, 1, 0],
    [-halfWidth, FRAME_HEIGHT, 1, -1],
    [halfWidth, FRAME_HEIGHT, -1, -1],
    [halfWidth, 0, -1, 0],
  ]
  const vertices: number[] = []
  const point = (station: number, profile: number) => {
    const [x, y, ix, iy] = path[station]
    const [inset, z] = section[profile]
    return [x + ix * inset, y + iy * inset, z]
  }
  const triangle = (a: number[], b: number[], c: number[]) => vertices.push(...a, ...b, ...c)
  for (let station = 0; station < path.length - 1; station++) {
    for (let edge = 0; edge < section.length; edge++) {
      const next = (edge + 1) % section.length
      const a = point(station, edge), b = point(station + 1, edge)
      const c = point(station + 1, next), d = point(station, next)
      triangle(a, c, b)
      triangle(a, d, c)
    }
  }
  const caps = ShapeUtils.triangulateShape(section.map(([d, z]) => new Vector2(d, z)), [])
  for (const [a, b, c] of caps) {
    triangle(point(0, a), point(0, b), point(0, c))
    triangle(point(3, a), point(3, c), point(3, b))
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  return geometry
}
