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

  test('orders the doors in the requested three rows', () => {
    expect(projects.map(({ title }) => title)).toEqual([
      'Weft',
      'Polar',
      'EasyMD',
      'GigPilot',
      'Ascent',
      'ByteForm',
    ])
    expect(projects.map(({ index }) => index)).toEqual(['01', '02', '03', '04', '05', '06'])
    expect(projects[0].description.startsWith('An AI powered platform')).toBe(true)
    expect(projects[1].description.startsWith('Polar is an AI powered Work OS')).toBe(true)
    expect(projects[2].description.startsWith('EasyMD is a telemedicine startup')).toBe(true)
    expect(projects[3].description.startsWith('GigPilot is an AI powered freelance assistant')).toBe(true)
    expect(projects[4].description.startsWith('Ascent is an AI powered platform')).toBe(true)
    expect(projects[5].description.startsWith('ByteForm is an open source form builder')).toBe(true)
  })

  test('defines tool stacks and public destinations for project rooms', () => {
    expect(projects.every((project) => project.tools.length > 0)).toBe(true)
    expect(projects.filter((project) => project.link === '').map(({ title }) => title)).toEqual([
      'Polar',
      'EasyMD',
    ])
  })

  test('uses violet ByteForm and blue EasyMD palettes', () => {
    expect(projects[5].title).toBe('ByteForm')
    expect(projects[5].status).toBe('LIVE')
    expect(projects[5].room.gradient).toEqual(['#bf66f4', '#7b29b0', '#32104a'])
    expect(projects[2].title).toBe('EasyMD')
    expect(projects[2].status).toBe('SHIPPING')
    expect(projects[2].room.gradient).toEqual(['#49a6ff', '#176bc5', '#092241'])
  })
})
