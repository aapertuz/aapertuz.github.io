import { describe, expect, test } from 'bun:test'

const appSource = await Bun.file(new URL('./App.tsx', import.meta.url)).text()
const sceneSource = await Bun.file(new URL('./components/Scene.tsx', import.meta.url)).text()
const manifestoFile = Bun.file(new URL('./components/HeroManifesto.tsx', import.meta.url))

describe('hero manifesto overlay', () => {
  test('anchors the approved copy in the world with the name lockup', async () => {
    expect(appSource).toContain('<main className="experience">')
    expect(appSource).not.toContain('hero-manifesto')
    expect(await manifestoFile.exists()).toBe(true)
    expect(sceneSource).toContain("import { HeroManifesto } from './HeroManifesto'")
    expect(sceneSource).toContain('<HeroManifesto />')

    const manifestoSource = await manifestoFile.text()
    expect(manifestoSource).toContain("from '@react-three/drei'")
    expect(manifestoSource).toContain('Some problems have felt like closed doors.')
    expect(manifestoSource).toContain("These are the projects I’m building to open them.")
    expect(manifestoSource).toContain('position={[0, 3.45, -6]}')
  })
})
