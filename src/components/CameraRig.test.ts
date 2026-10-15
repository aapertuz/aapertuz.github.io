import { describe, expect, test } from 'bun:test'

const rigSource = await Bun.file(new URL('./CameraRig.tsx', import.meta.url)).text()
const sceneSource = await Bun.file(new URL('./Scene.tsx', import.meta.url)).text()
const framingFile = Bun.file(new URL('../scene/cameraFraming.ts', import.meta.url))

describe('responsive camera framing', () => {
  test('uses viewport-aware home distance in the rig and initial camera', async () => {
    expect(await framingFile.exists()).toBe(true)
    expect(rigSource).toContain('getHomeCameraZ(size.width, size.height, cameraFov)')
    expect(sceneSource).toContain('getHomeCameraZ(window.innerWidth, window.innerHeight, homeFov)')
  })

  test('keeps the home camera fixed when the pointer moves', () => {
    expect(rigSource).not.toContain('state.pointer')
  })
})
