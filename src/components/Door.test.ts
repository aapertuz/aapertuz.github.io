import { describe, expect, test } from 'bun:test'

const doorSource = await Bun.file(new URL('./Door.tsx', import.meta.url)).text()
const textureFile = Bun.file(new URL('./roomTexture.ts', import.meta.url))

describe('Door visuals', () => {
  test('renders an open textured frame without a slab, handle, or labels', () => {
    expect(doorSource).toContain('<planeGeometry args={[OPENING_W, OPENING_H]} />')
    expect(doorSource).toContain('<pointLight')
    expect(doorSource.match(/<boxGeometry/g)).toHaveLength(3)
    expect(doorSource).toContain('createRoomTexture(placement.project)')
    expect(doorSource).toContain('color={placement.project.room.light}')
    expect(doorSource).not.toContain('#f0a24a')
    expect(doorSource).not.toContain('#ffb45e')
    expect(doorSource).not.toContain('<Text')
    expect(doorSource).not.toContain('<sphereGeometry')
    expect(doorSource).not.toContain('rotation-y={-1.2}')
  })

  test('provides a native canvas texture renderer', async () => {
    expect(await textureFile.exists()).toBe(true)
    const source = await textureFile.text()
    expect(source).toContain('new CanvasTexture(canvas)')
    expect(source).toContain('createLinearGradient')
    expect(source).toContain('createRadialGradient')
    expect(source).toContain('getImageData')
    expect(source).toContain('fillText')
  })
})
