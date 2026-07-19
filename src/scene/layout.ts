import type { Project } from '../data/projects'

export interface DoorPlacement {
  project: Project
  position: [number, number, number]
  rotationY: number
  focus: [number, number, number]
}

const SIDE_X = 3.8 // distance of each door row from the path center
const NEAR_Z = 3.0 // z of the doors closest to the viewer
const SPACING = 2.8 // z gap between rows
const INWARD = 0.3 // radians each door tilts toward the viewer
const FOCUS_DIST = 4.6 // how far in front of a door the camera stops
const FOCUS_HEIGHT = 1.5

export function layoutDoors(projects: Project[]): DoorPlacement[] {
  return projects.map((project, i) => {
    const side = i % 2 === 0 ? -1 : 1
    const row = Math.floor(i / 2)
    const z = NEAR_Z - row * SPACING
    // -side flips the door's +z normal toward the path; INWARD tilts it toward the camera
    const rotationY = -side * (Math.PI / 2 - INWARD)
    const nx = Math.sin(rotationY)
    const nz = Math.cos(rotationY)
    return {
      project,
      position: [side * SIDE_X, 0, z],
      rotationY,
      focus: [side * SIDE_X + nx * FOCUS_DIST, FOCUS_HEIGHT, z + nz * FOCUS_DIST],
    }
  })
}
