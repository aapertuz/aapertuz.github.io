import { describe, expect, test } from 'bun:test'
import { getCompositeMode } from './compositorMode'

describe('shared transition compositor', () => {
  test('renders the corridor directly when no transition artwork is active', () => {
    expect(getCompositeMode(0, false)).toBe('corridor')
    expect(getCompositeMode(0, true)).toBe('corridor')
  })

  test('uses the shared mix only during a partial entry or return', () => {
    expect(getCompositeMode(0.001, true)).toBe('blend')
    expect(getCompositeMode(0.5, true)).toBe('blend')
    expect(getCompositeMode(0.999, true)).toBe('blend')
  })

  test('draws only the artwork at a fully opaque transition', () => {
    expect(getCompositeMode(1, true)).toBe('artwork')
    expect(getCompositeMode(1.2, true)).toBe('artwork')
  })
})
