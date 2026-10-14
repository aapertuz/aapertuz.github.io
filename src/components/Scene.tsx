import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { IconMouse } from '@tabler/icons-react'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { projects } from '../data/projects'
import { getHomeCameraZ } from '../scene/cameraFraming'
import { layoutDoors } from '../scene/layout'
import type { DoorReveal } from '../scene/entrance'
import { CameraRig } from './CameraRig'
import { Door } from './Door'
import { Floor } from './Floor'
import { HeroManifesto } from './HeroManifesto'
import { NameText } from './NameText'
import { ProjectDetails } from './ProjectDetails'
import { useFrameEnvironment } from './useFrameEnvironment'
import { StarField } from './StarField'

// Report the first frame of the corridor, independently of fonts and artwork.
function SceneReady({ onReady }: { onReady: () => void }) {
  const reported = useRef(false)
  useFrame(() => {
    if (reported.current) return
    reported.current = true
    performance.mark('portfolio-scene-ready')
    onReady()
  })
  return null
}

// Narrow viewports need a wider field of view and a bit more distance so the
// full path and name stay framed instead of being cropped by the tall aspect.
const isNarrow =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
const homeFov = isNarrow ? 52 : 40
const homeZ =
  typeof window === 'undefined'
    ? 11
    : getHomeCameraZ(window.innerWidth, window.innerHeight, homeFov)

interface SceneProps {
  revealing: boolean
  aboutOpen?: boolean
  onNameSelect?: () => void
  onReady: () => void
}

function Doorways({ placements, reveals, revealing, selected, returning, labelsVisible, onSelect }: {
  placements: ReturnType<typeof layoutDoors>
  reveals: DoorReveal[]
  revealing: boolean
  selected: number | null
  returning: number | null
  labelsVisible: boolean
  onSelect: (index: number) => void
}) {
  const environment = useFrameEnvironment()
  return placements.map((placement, index) => (
    <Door key={placement.project.title} placement={placement} environment={environment}
      revealing={revealing} reveal={reveals[index]} entranceOrder={index}
      selected={selected === index} returning={returning === index} labelsVisible={labelsVisible}
      onSelect={() => onSelect(index)} />
  ))
}

export function Scene({ revealing, aboutOpen, onNameSelect, onReady }: SceneProps) {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 2))
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  const [narrow, setNarrow] = useState(isNarrow)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const update = () => setNarrow(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const placements = useMemo(() => layoutDoors(projects, narrow), [narrow])
  const reveals = useMemo(() => placements.map(() => ({ current: 0 })), [placements])
  const [selected, setSelected] = useState<number | null>(null)
  const [returning, setReturning] = useState<number | null>(null)

  const [settledProject, setSettledProject] = useState<ReturnType<typeof layoutDoors>[number] | null>(null)
  const selectProject = useCallback((index: number) => {
    if (index === selected || returning !== null) return
    setSettledProject(null)
    setSelected(index)
  }, [selected, returning])

  const closeProject = useCallback(() => {
    if (selected === null) return
    setReturning(selected)
    setSelected(null)
  }, [selected])

  const finishReturn = useCallback(() => {
    const projectIndex = returning === null ? null : placements[returning].project.index
    setReturning(null)
    setSettledProject(null)
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-project-index="${projectIndex}"]`)?.focus({ preventScroll: true })
    })
  }, [returning, placements])

  useEffect(() => {
    if (selected === null) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeProject() }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [selected, closeProject])

  return (
    <>
    <Canvas
      dpr={dpr}
      camera={{ position: [0, narrow ? 3.15 : 1.65, homeZ], fov: homeFov }}
      frameloop={pageVisible && !aboutOpen ? 'always' : 'never'}
      style={aboutOpen ? { pointerEvents: 'none' } : undefined}
      onPointerMissed={closeProject}
    >
      <PerformanceMonitor
        bounds={() => [45, 58]}
        onDecline={() => setDpr(current => Math.max(1, current - 0.25))}
        onIncline={() => setDpr(current => Math.min(window.devicePixelRatio, 2, current + 0.25))}
      />
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 20, 52]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 8, 6]} intensity={0.9} />
      <pointLight position={[0, 5, -2]} intensity={12} distance={24} />
      <StarField />
      <Floor placements={placements} reveals={reveals} />
      {!narrow && revealing && <>
        <Suspense fallback={null}><HeroManifesto /></Suspense>
        <Suspense fallback={null}><NameText onSelect={onNameSelect} /></Suspense>
      </>}
      <Suspense fallback={null}>
        <Doorways placements={placements} reveals={reveals} revealing={revealing} selected={selected} returning={returning} labelsVisible={settledProject === null && returning === null && !narrow} onSelect={selectProject} />
      </Suspense>
      <SceneReady onReady={onReady} />
      <CameraRig onSettled={setSettledProject} onReturned={finishReturn} narrow={narrow} focus={selected === null ? null : placements[selected]} />
    </Canvas>
    {narrow && settledProject === null && returning === null && !aboutOpen && <>
      <header className="scene-mobile-intro">
        <button onClick={onNameSelect}>Alexis Pertuz</button>
        <p>Some problems have felt like closed doors.<br />These are the projects I’m building to open them.</p>
      </header>
      <nav className="mobile-projects" aria-label="Explore projects">
        {projects.map((project, index) => <button key={project.title} data-project-index={project.index} onClick={() => selectProject(index)}><span className="mobile-projects__identity"><strong>{project.title}</strong><span>{project.industry}</span></span><span aria-hidden="true">↗</span></button>)}
      </nav>
    </>}
    {revealing && selected === null && returning === null && !aboutOpen && (
      <p className="scene-interaction-hint">
        <IconMouse size={24} stroke={1.25} aria-hidden="true" />
        <span>Click any door or my name to explore the portfolio.</span>
      </p>
    )}
    {settledProject !== null && !aboutOpen && <ProjectDetails project={settledProject.project} closing={returning !== null} onClose={closeProject} />}
    </>
  )
}
