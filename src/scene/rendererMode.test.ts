import { describe, expect, test } from 'bun:test'
import { getRendererMode } from './rendererMode'

describe('renderer selection', () => {
  test('uses the direct compositor by default', () => {
    expect(getRendererMode('')).toBe('direct')
    expect(getRendererMode('?perf=1')).toBe('direct')
  })

  test('supports explicit direct selection and falls back to direct for unknown values', () => {
    expect(getRendererMode('?renderer=direct')).toBe('direct')
    expect(getRendererMode('?renderer=direct&perf=1')).toBe('direct')
    expect(getRendererMode('?renderer=unknown')).toBe('direct')
  })

  test('retains the legacy renderer through the explicit comparison query', () => {
    expect(getRendererMode('?renderer=legacy')).toBe('legacy')
    expect(getRendererMode('?renderer=legacy&perf=1')).toBe('legacy')
  })
})
