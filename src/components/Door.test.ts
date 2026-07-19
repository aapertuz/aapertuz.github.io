import { describe, expect, test } from 'bun:test'

const source = await Bun.file(new URL('./Door.tsx', import.meta.url)).text()

describe('Door visuals', () => {
  test('renders an open glowing frame without a slab, handle, or labels', () => {
    expect(source).toContain('<planeGeometry args={[OPENING_W, OPENING_H]} />')
    expect(source).toContain('<pointLight')
    expect(source.match(/<boxGeometry/g)).toHaveLength(3)
    expect(source).not.toContain('<Text')
    expect(source).not.toContain('<sphereGeometry')
    expect(source).not.toContain('rotation-y={-1.2}')
  })
})
