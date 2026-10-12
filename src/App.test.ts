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

  test('reveals the corridor independently of artwork after the brief introduction', () => {
    expect(appSource).toContain('const [sceneReady, setSceneReady] = useState(false)')
    expect(appSource).toContain('onReady={() => setSceneReady(true)}')
    expect(appSource).toContain("sceneShown ? 'scene-layer scene-layer--ready' : 'scene-layer'")
    expect(sceneSource).toContain('onReady: () => void')
    expect(sceneSource).not.toContain('onCreated={onReady}')
    expect(sceneSource).toContain('<SceneReady onReady={onReady} />')
  })
})

describe('hero and About integration', () => {
  test('retains the approved manifesto inside the 3D world', async () => {
    expect(appSource).toContain('<main className="experience"')
    expect(await manifestoFile.exists()).toBe(true)
    expect(sceneSource).toContain("import { HeroManifesto } from './HeroManifesto'")
    expect(sceneSource).toContain('<HeroManifesto />')

    const manifestoSource = await manifestoFile.text()
    expect(manifestoSource).toContain("from '@react-three/drei'")
    expect(manifestoSource).toContain('Some problems have felt like closed doors.')
    expect(manifestoSource).toContain("These are the projects I’m building to open them.")
  })

  test('keeps controlled navigation and the About window above the lazy scene', () => {
    expect(appSource).toContain("import { FloatingNav } from './components/FloatingNav'")
    expect(appSource).toContain('<FloatingNav active={active}')
    expect(appSource).toContain('<AboutWindow open={aboutOpen}')
    expect(appSource).toContain('aboutOpen={aboutOpen}')
    expect(appSource).toContain('onNameSelect={openAbout}')
  })

  test('wires About state through both entry points and keeps the canvas inert while open', () => {
    expect(appSource).toContain("useState<NavItem>('home')")
    expect(appSource).toContain('onSelect={handleNavSelect}')
    expect(sceneSource).toContain('<NameText onSelect={onNameSelect} />')
    expect(sceneSource).toContain("style={aboutOpen ? { pointerEvents: 'none' } : undefined}")
  })
})
