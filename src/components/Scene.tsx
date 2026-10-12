import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { projects } from '../data/projects'
import { getHomeCameraZ } from '../scene/cameraFraming'
import { layoutDoors } from '../scene/layout'
import { CameraRig } from './CameraRig'
import { Door } from './Door'
import { Floor } from './Floor'
import { HeroManifesto } from './HeroManifesto'
import { NameText } from './NameText'
import { ProjectDetails } from './ProjectDetails'
import { useFrameEnvironment } from './useFrameEnvironment'
import { StarField } from './StarField'

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
  aboutOpen?: boolean
  onNameSelect?: () => void
  onReady: () => void
}

function Doorways({ placements, selected, labelsVisible, onSelect }: {
  placements: ReturnType<typeof layoutDoors>
  selected: number | null
  labelsVisible: boolean
  onSelect: (index: number) => void
}) {
  const environment = useFrameEnvironment()
  return placements.map((placement, index) => (
    <Door key={placement.project.title} placement={placement} environment={environment}
      selected={selected === index} labelsVisible={labelsVisible}
      onSelect={() => onSelect(index)} />
  ))
}

export function Scene({ aboutOpen, onNameSelect, onReady }: SceneProps) {
  const [narrow, setNarrow] = useState(isNarrow)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const update = () => setNarrow(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const placements = useMemo(() => layoutDoors(projects, narrow), [narrow])
  const [selected, setSelected] = useState<number | null>(null)

  const [settledProject, setSettledProject] = useState<ReturnType<typeof layoutDoors>[number] | null>(null)
  const selectProject = useCallback((index: number) => {
    if (index === selected) return
    setSettledProject(null)
    setSelected(index)
  }, [selected])

  const closeProject = useCallback(() => {
    const projectIndex = selected === null ? null : placements[selected].project.index
    setSettledProject(null)
    setSelected(null)
    requestAnimationFrame(() => {
      document.querySelector<HTMLButtonElement>(`[data-project-index="${projectIndex}"]`)?.focus({ preventScroll: true })
    })
  }, [selected, placements])

  useEffect(() => {
    if (selected === null) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeProject() }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [selected, closeProject])

  return (
    <>
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, narrow ? 3.15 : 1.65, homeZ], fov: homeFov }}
      onCreated={onReady}
      style={aboutOpen ? { pointerEvents: 'none' } : undefined}
      onPointerMissed={closeProject}
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 20, 52]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 8, 6]} intensity={0.9} />
      <pointLight position={[0, 5, -2]} intensity={12} distance={24} />
      <StarField />
      <Floor placements={placements} />
      <Suspense fallback={null}>
        {!narrow && <>
          <HeroManifesto />
          <NameText onSelect={onNameSelect} />
        </>}
        <Doorways placements={placements} selected={selected} labelsVisible={settledProject === null && !narrow} onSelect={selectProject} />
      </Suspense>
      <CameraRig onSettled={setSettledProject} narrow={narrow} focus={selected === null ? null : placements[selected]} />
    </Canvas>
    {narrow && settledProject === null && !aboutOpen && <>
      <header className="scene-mobile-intro">
        <button onClick={onNameSelect}>Alexis Pertuz</button>
        <p>Some problems have felt like closed doors.<br />These are the projects I’m building to open them.</p>
      </header>
      <nav className="mobile-projects" aria-label="Explore projects">
        {projects.map((project, index) => <button key={project.title} data-project-index={project.index} onClick={() => selectProject(index)}><span>{project.index}</span>{project.title}<span aria-hidden="true">↗</span></button>)}
      </nav>
    </>}
    {selected !== null && settledProject === placements[selected] && !aboutOpen && <ProjectDetails project={placements[selected].project} onClose={closeProject} />}
    </>
  )
}
