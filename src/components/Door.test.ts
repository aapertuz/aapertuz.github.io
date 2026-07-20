import { describe, expect, test } from 'bun:test'

const doorSource = await Bun.file(new URL('./Door.tsx', import.meta.url)).text()
const textureFile = Bun.file(new URL('./roomTexture.ts', import.meta.url))

describe('Door visuals', () => {
  test('renders an open textured frame without a slab, handle, or labels', () => {
    expect(doorSource).toContain('<planeGeometry args={[OPENING_W, OPENING_H]} />')
    expect(doorSource).toContain('<pointLight')
    expect(doorSource.match(/<boxGeometry/g)).toHaveLength(3)
    expect(doorSource).toContain('createRoomTexture(placement.project)')
    expect(doorSource).toContain('<meshBasicMaterial\n          map={roomTexture ?? undefined}')
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

  test('keeps focused doors dimmer than hovered doors', () => {
    expect(doorSource).toContain('selected ? 1.5 : hovered ? 2.2 : 1.1')
  })

  test('opens published project links and leaves unavailable projects in place', () => {
    expect(doorSource).toContain("window.open(placement.project.link, '_blank', 'noopener,noreferrer')")
    expect(doorSource).toContain('if (!placement.project.link) return')
  })

  test('draws project tools and a visit action in every room texture', async () => {
    const source = await textureFile.text()
    expect(source).toContain('function drawTools')
    expect(source).toContain('function drawVisitAction')
    expect(source).toContain('project.tools')
    expect(source).toContain("project.link ? 'VISIT' : 'COMING SOON'")
    expect(source).toContain('const toolIconUrls')
    expect(source).toContain('const pineconeIconUrl')
    expect(source).toContain('Pinecone: pineconeIconUrl')
    expect(source).toContain('new Image()')
    expect(source).not.toContain('/ffffff')
    expect(source).toContain('stroke="%236D5DFB"')
    expect(source).toContain("context.fillStyle = 'rgba(17, 17, 19, 0.9)'")
    expect(source).toContain("FastAPI: 'https://cdn.simpleicons.org/fastapi/00E5D1'")
    expect(source).toContain("Supabase: 'https://cdn.simpleicons.org/supabase/3ECF8E'")
    expect(source).not.toContain("fillText('TOOLS'")
    expect(source).not.toContain('const toolMarks')
  })
})
