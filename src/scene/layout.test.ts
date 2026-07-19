import { describe, expect, test } from 'bun:test'
import { projects } from '../data/projects'
import { layoutDoors } from './layout'

describe('layoutDoors', () => {
  const placements = layoutDoors(projects)

  test('one placement per project, order preserved', () => {
    expect(placements.length).toBe(projects.length)
    expect(placements.map((p) => p.project.title)).toEqual(projects.map((p) => p.title))
  })

  test('doors alternate sides: even indices left (x<0), odd right (x>0)', () => {
    for (const [i, p] of placements.entries()) {
      if (i % 2 === 0) expect(p.position[0]).toBeLessThan(0)
      else expect(p.position[0]).toBeGreaterThan(0)
    }
  })

  test('rows recede: z decreases every two doors', () => {
    for (let i = 2; i < placements.length; i++) {
      expect(placements[i].position[2]).toBeLessThan(placements[i - 2].position[2])
    }
  })

  test('doors face the path: outward normal points toward x=0', () => {
    for (const p of placements) {
      const nx = Math.sin(p.rotationY)
      // left door (x<0) must have normal with +x component, right door -x
      if (p.position[0] < 0) expect(nx).toBeGreaterThan(0)
      else expect(nx).toBeLessThan(0)
    }
  })

  test('focus point sits in front of the door at eye height', () => {
    for (const p of placements) {
      const nx = Math.sin(p.rotationY)
      const nz = Math.cos(p.rotationY)
      const dx = p.focus[0] - p.position[0]
      const dz = p.focus[2] - p.position[2]
      expect(dx * nx + dz * nz).toBeGreaterThan(0) // in front, not behind
      expect(p.focus[1]).toBe(1.5)
      // focus is between the door and the path center
      expect(Math.abs(p.focus[0])).toBeLessThan(Math.abs(p.position[0]))
    }
  })
})
