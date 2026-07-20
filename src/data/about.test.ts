import { describe, expect, test } from 'bun:test'
import { aboutContent } from './about'

describe('About content', () => {
  test('contains every placeholder profile group', () => {
    expect(aboutContent.name).toBe('Your Name')
    expect(aboutContent.description).toContain('short introduction')
    expect(aboutContent.technologies).toHaveLength(6)
    expect(aboutContent.companies).toHaveLength(3)
    expect(aboutContent.projects).toHaveLength(3)
    expect(aboutContent.links.map((link) => link.label)).toEqual(['Email', 'GitHub', 'LinkedIn'])
  })
})
