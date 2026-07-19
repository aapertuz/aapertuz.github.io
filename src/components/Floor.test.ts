import { describe, expect, test } from 'bun:test'

const floorSource = await Bun.file(new URL('./Floor.tsx', import.meta.url)).text()

describe('Floor reflection', () => {
  test('uses a brighter polished surface with a strong blurred reflection', () => {
    expect(floorSource).toContain('blur={[220, 80]}')
    expect(floorSource).toContain('mixStrength={75}')
    expect(floorSource).toContain('roughness={0.72}')
    expect(floorSource).toContain('color="#101010"')
    expect(floorSource).toContain('mirror={0.9}')
  })
})
