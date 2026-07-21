import { describe, expect, test } from 'bun:test'
import { aboutContent } from './about'

describe('About content', () => {
  test('contains every placeholder profile group', () => {
    expect(aboutContent.name).toBe('Antonio')
    expect(aboutContent.description).toContain('telemedicine')
    expect(aboutContent.technologies).toHaveLength(6)
    expect(aboutContent.links.map((link) => link.label)).toEqual(['Email', 'GitHub', 'LinkedIn'])
    expect(aboutContent.technologies.every((item) => item.icon)).toBe(true)
  })
})
