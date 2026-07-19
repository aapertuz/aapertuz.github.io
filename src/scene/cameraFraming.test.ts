import { describe, expect, test } from 'bun:test'
import { getHomeCameraZ } from './cameraFraming'

describe('getHomeCameraZ', () => {
  test('uses the closer home distance when the viewport is wide enough', () => {
    expect(getHomeCameraZ(2560, 1080, 40)).toBe(9.5)
  })

  test('moves back when a narrow viewport needs more horizontal room', () => {
    expect(getHomeCameraZ(390, 844, 52)).toBeGreaterThan(9.5)
  })
})
