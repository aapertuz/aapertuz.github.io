import { describe, expect, test } from 'bun:test'

const floorSource = await Bun.file(new URL('./Floor.tsx', import.meta.url)).text()

describe('solid corridor floor', () => {
  test('uses textured stone without mirrored door images', () => {
    expect(floorSource).not.toContain('MeshReflectorMaterial')
    expect(floorSource).toContain('roughness={0.7}')
    expect(floorSource).toContain('bumpMap={grain}')
  })
})
