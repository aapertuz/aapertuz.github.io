import { describe, expect, test } from 'bun:test'
import { layoutDoors } from '../scene/layout'
import { projects } from './projects'

describe('project rooms', () => {
  test('contains six rooms arranged three per side', () => {
    expect(projects).toHaveLength(6)

    const placements = layoutDoors(projects)
    expect(placements.filter(({ position }) => position[0] < 0)).toHaveLength(3)
    expect(placements.filter(({ position }) => position[0] > 0)).toHaveLength(3)
  })

  test('preserves the four reference projects and palette stops', () => {
    expect(projects.slice(0, 4).map(({ title }) => title)).toEqual([
      'Omoi',
      'GigPilot',
      'Weft',
      'Ascent',
    ])
    expect(projects[0].description.startsWith('A memory layer')).toBe(true)
    expect(projects[1].description.startsWith('Finds gigs matched')).toBe(true)
    expect(projects[2].description.startsWith('Professional connection')).toBe(true)
    expect(projects[3].description.startsWith('Capital intelligence')).toBe(true)
    expect(projects[0].room.gradient).toEqual(['#262019', '#141310', '#05040300'])
    expect(projects[1].room.gradient).toEqual(['#2036e6', '#1626c9', '#0d1a99'])
    expect(projects[2].room.gradient).toEqual(['#ff9a3d', '#f26a0a', '#b34700'])
    expect(projects[3].room.gradient).toEqual(['#35d17c', '#12a657', '#0a7a3d'])
  })

  test('uses distinct violet and deep-red placeholder palettes', () => {
    expect(projects[4].status).toBe('COMING SOON')
    expect(projects[4].room.gradient).toEqual(['#a978f2', '#7442c8', '#432477'])
    expect(projects[5].status).toBe('COMING SOON')
    expect(projects[5].room.gradient).toEqual(['#e05a64', '#b62d3d', '#681721'])
  })
})
