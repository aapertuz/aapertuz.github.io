import type { Project } from '../data/projects'

export interface DoorPlacement {
  project: Project
  position: [number, number, number]
  rotationY: number
  focus: [number, number, number]
}

const SIDE_X = 5.6 // distance of each door row from the path center
const NEAR_Z = 3.0 // z of the doors closest to the viewer
const SPACING = 4.8 // z gap between rows
const INWARD = 0.22 // small turn from the corridor wall toward the viewer
const ROW_TURN = 0.12 // distant doors reveal a little more of their opening
const FOCUS_DIST = 7.4 // how far in front of a door the camera stops
const FOCUS_HEIGHT = 1.5

export function layoutDoors(projects: Project[], narrow = false): DoorPlacement[] {
  const sideX = narrow ? 2.2 : SIDE_X
  return projects.map((project, i) => {
    const side = i % 2 === 0 ? -1 : 1
    const row = Math.floor(i / 2)
    const z = NEAR_Z - row * (narrow ? 4 : SPACING)
    const rowX = narrow ? sideX - row * 0.6 : sideX
    // Keep the door planes almost parallel to the corridor, facing inward.
    // A larger turn toward the camera flattens their receding top edges.
    const turn = narrow ? 0.92 : INWARD + row * ROW_TURN
    const rotationY = -side * (Math.PI / 2 - turn)
    const nx = Math.sin(rotationY)
    const nz = Math.cos(rotationY)
    return {
      project,
      position: [side * rowX, 0, z],
      rotationY,
      focus: [side * rowX + nx * FOCUS_DIST, FOCUS_HEIGHT, z + nz * FOCUS_DIST],
    }
  })
}
