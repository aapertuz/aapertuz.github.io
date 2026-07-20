import { describe, expect, test } from 'bun:test'

const appSource = await Bun.file(new URL('./App.tsx', import.meta.url)).text()
const sceneSource = await Bun.file(new URL('./components/Scene.tsx', import.meta.url)).text()
const manifestoFile = Bun.file(new URL('./components/HeroManifesto.tsx', import.meta.url))

describe('progressive WebGL loading', () => {
  test('keeps meaningful HTML visible while the scene bundle loads', () => {
    expect(appSource).not.toContain("import { Scene } from './components/Scene'")
    expect(appSource).toContain("import('./components/Scene').then")
    expect(appSource).toContain('fallback={<PresentationShell ready={false} />}')
    expect(appSource).toContain('<h1>Alexis Pertuz</h1>')
    expect(appSource).toContain('Some problems have felt like closed doors.')
    expect(appSource).toContain("These are the projects I’m building to open them.")
  })

  test('reveals the scene only after Canvas reports WebGL initialization', () => {
    expect(appSource).toContain('const [sceneReady, setSceneReady] = useState(false)')
    expect(appSource).toContain('onReady={() => setSceneReady(true)}')
    expect(appSource).toContain("sceneReady ? 'scene-layer scene-layer--ready' : 'scene-layer'")
    expect(sceneSource).toContain('export function Scene({ onReady }: { onReady: () => void })')
    expect(sceneSource).toContain('onCreated={onReady}')
  })
})

describe('existing hero composition', () => {
  test('retains the approved manifesto inside the 3D world', async () => {
    expect(await manifestoFile.exists()).toBe(true)
    expect(sceneSource).toContain("import { HeroManifesto } from './HeroManifesto'")
    expect(sceneSource).toContain('<HeroManifesto />')

    const manifestoSource = await manifestoFile.text()
    expect(manifestoSource).toContain("from '@react-three/drei'")
    expect(manifestoSource).toContain('Some problems have felt like closed doors.')
    expect(manifestoSource).toContain("These are the projects I’m building to open them.")
    expect(manifestoSource).toContain('position={[0, 3.45, -6]}')
  })

  test('keeps floating navigation above the progressive scene', () => {
    expect(appSource).toContain("import { FloatingNav } from './components/FloatingNav'")
    expect(appSource).toContain('<FloatingNav />')
    expect(appSource).toContain('<Scene onReady={() => setSceneReady(true)} />')
  })
})
