import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { IconHandFinger, IconMouse } from '@tabler/icons-react'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PlaneGeometry, type BufferGeometry } from 'three'
import { projects } from '../data/projects'
import { getHomeCameraZ } from '../scene/cameraFraming'
import { layoutDoors } from '../scene/layout'
import type { RenderPhase } from '../scene/rendererMode'
import { getRendererMode } from '../scene/rendererMode'
import type { DoorReveal } from '../scene/entrance'
import { CameraRig } from './CameraRig'
import { Door, OPENING_HEIGHT, OPENING_WIDTH } from './Door'
import { Floor } from './Floor'
import { HeroManifesto } from './HeroManifesto'
import { NameText } from './NameText'
import { ProjectDetails } from './ProjectDetails'
import { useFrameEnvironment } from './useFrameEnvironment'
import { StarField } from './StarField'
import { PerformanceSampler, TransitionCompositor } from './TransitionCompositor'
import type { TransitionState } from './transitionTypes'
import { createFrameGeometry } from './frameGeometry'

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

const isNarrow = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
const homeFov = isNarrow ? 52 : 40
const homeZ = typeof window === 'undefined'
  ? 11
  : getHomeCameraZ(window.innerWidth, window.innerHeight, homeFov)

interface SceneProps {
  revealing: boolean
  aboutOpen?: boolean
  onNameSelect?: () => void
  onReady: () => void
  onProfileArrived?: () => void
}

interface DoorwaysProps {
  placements: ReturnType<typeof layoutDoors>
  reveals: DoorReveal[]
  revealing: boolean
  selected: number | null
  returning: number | null
  labelsVisible: boolean
  directRenderer: boolean
  transitionState: TransitionState
  environment: ReturnType<typeof useFrameEnvironment>
  frameGeometry: BufferGeometry
  openingGeometry: BufferGeometry
  onSelect: (index: number) => void
}

function Doorways({ placements, reveals, revealing, selected, returning, labelsVisible, directRenderer, transitionState, environment, frameGeometry, openingGeometry, onSelect }: DoorwaysProps) {
  return placements.map((placement, index) => (
    <Door
      key={placement.project.title}
      placement={placement}
      environment={environment}
      frameGeometry={frameGeometry}
      openingGeometry={openingGeometry}
      transitionState={transitionState}
      directRenderer={directRenderer}
      revealing={revealing}
      reveal={reveals[index]}
      entranceOrder={index}
      selected={selected === index}
      returning={returning === index}
      labelsVisible={labelsVisible}
      onSelect={() => onSelect(index)}
    />
  ))
}

function SceneContents({ placements, reveals, revealing, aboutOpen, narrow, selected, returning, labelsVisible, phase, transitionState, directRenderer, dpr, pageVisible, frameGeometry, openingGeometry, onSelect, onNameSelect, onReady, onSettled, onReturned, onProfileArrived }: {
  placements: ReturnType<typeof layoutDoors>
  reveals: DoorReveal[]
  revealing: boolean
  aboutOpen: boolean
  narrow: boolean
  selected: number | null
  returning: number | null
  labelsVisible: boolean
  phase: RenderPhase
  transitionState: TransitionState
  directRenderer: boolean
  dpr: number
  pageVisible: boolean
  frameGeometry: BufferGeometry
  openingGeometry: BufferGeometry
  onSelect: (index: number) => void
  onNameSelect?: () => void
  onReady: () => void
  onSettled: (placement: ReturnType<typeof layoutDoors>[number]) => void
  onReturned: () => void
  onProfileArrived?: () => void
}) {
  const environment = useFrameEnvironment()
  const invalidate = useThree((state) => state.invalidate)
  const size = useThree((state) => state.size)
  useEffect(() => {
    if (pageVisible && document.visibilityState === 'visible') invalidate()
  }, [phase, aboutOpen, revealing, selected, returning, dpr, pageVisible, size.width, size.height, invalidate])

  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 20, 52]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 8, 6]} intensity={0.9} />
      <pointLight position={[0, 5, -2]} intensity={12} distance={24} />
      <StarField />
      <Floor placements={placements} reveals={reveals} />
      {revealing && <>
        {!narrow && <Suspense fallback={null}><HeroManifesto profile={aboutOpen} /></Suspense>}
        <Suspense fallback={null}><NameText onSelect={selected === null ? onNameSelect : undefined} visible={!narrow || selected === null} narrow={narrow} profile={aboutOpen} /></Suspense>
      </>}
      <Suspense fallback={null}>
        <Doorways
          placements={placements}
          reveals={reveals}
          revealing={revealing}
          selected={selected}
          returning={returning}
          labelsVisible={labelsVisible}
          directRenderer={directRenderer}
          transitionState={transitionState}
          environment={environment}
          frameGeometry={frameGeometry}
          openingGeometry={openingGeometry}
          onSelect={onSelect}
        />
      </Suspense>
      <SceneReady onReady={onReady} />
      <CameraRig
        profile={aboutOpen}
        onProfileArrived={onProfileArrived}
        onSettled={onSettled}
        onReturned={onReturned}
        narrow={narrow}
        focus={selected === null ? null : placements[selected]}
      />
      {directRenderer
        ? <TransitionCompositor transitionState={transitionState} dpr={dpr} expectedTextureCount={placements.length} />
        : <PerformanceSampler transitionState={transitionState} dpr={dpr} target={null} />}
    </>
  )
}

export function Scene({ revealing, aboutOpen = false, onNameSelect, onReady, onProfileArrived }: SceneProps) {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 2))
  useEffect(() => {
    const update = () => setDpr(Math.min(window.devicePixelRatio, 2))
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
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
  const doorPlacements = useMemo(() => layoutDoors(projects, narrow), [narrow])
  const reveals = useMemo(() => doorPlacements.map(() => ({ current: 0 })), [doorPlacements])
  const frameGeometry = useMemo(createFrameGeometry, [])
  const openingGeometry = useMemo(() => new PlaneGeometry(OPENING_WIDTH, OPENING_HEIGHT), [])
  useEffect(() => () => {
    frameGeometry.dispose()
    openingGeometry.dispose()
  }, [frameGeometry, openingGeometry])
  const rendererMode = useMemo(() => getRendererMode(window.location.search), [])
  const directRenderer = rendererMode === 'direct'
  const [phase, setPhase] = useState<RenderPhase>('corridor')
  const transitionState = useMemo<TransitionState>(() => ({ blend: 0, phase: 'corridor', artwork: null }), [])
  transitionState.phase = phase
  const [selected, setSelected] = useState<number | null>(null)
  const [returning, setReturning] = useState<number | null>(null)
  const [settledProject, setSettledProject] = useState<ReturnType<typeof layoutDoors>[number] | null>(null)
  const wasAboutOpen = useRef(false)

  useEffect(() => {
    if (aboutOpen) setPhase('profile-journey')
    else if (wasAboutOpen.current) setPhase('profile-journey')
    wasAboutOpen.current = aboutOpen
  }, [aboutOpen])

  const selectProject = useCallback((index: number) => {
    if (index === selected || returning !== null) return
    setSettledProject(null)
    transitionState.blend = 0
    setPhase('entering')
    setSelected(index)
  }, [selected, returning, transitionState])

  const closeProject = useCallback(() => {
    if (selected === null) return
    setPhase('returning')
    setReturning(selected)
    setSelected(null)
  }, [selected])

  const finishReturn = useCallback(() => {
    const projectIndex = returning === null ? null : doorPlacements[returning]?.project.index
    setReturning(null)
    setSettledProject(null)
    transitionState.blend = 0
    setPhase('corridor')
    requestAnimationFrame(() => {
      if (projectIndex !== null && projectIndex !== undefined) {
        document.querySelector<HTMLButtonElement>(`[data-project-index="${projectIndex}"]`)?.focus({ preventScroll: true })
      }
    })
  }, [returning, doorPlacements, transitionState])

  const handleSettled = useCallback((placement: ReturnType<typeof layoutDoors>[number]) => {
    setSettledProject(placement)
    setPhase('project')
  }, [])
  const handleProfileArrived = useCallback(() => {
    setPhase('profile')
    onProfileArrived?.()
  }, [onProfileArrived])

  useEffect(() => {
    if (selected === null) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeProject() }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [selected, closeProject])

  const frameloop = !pageVisible ? 'never' : phase === 'project' ? 'demand' : 'always'

  return (
    <>
      <Canvas
        dpr={dpr}
        gl={{ antialias: true }}
        camera={{ position: [0, narrow ? 3.15 : 1.65, homeZ], fov: homeFov }}
        frameloop={frameloop}
        style={aboutOpen ? { pointerEvents: 'none' } : undefined}
        onPointerMissed={closeProject}
      >
        {doorPlacements.length > 0 && <SceneContents
          placements={doorPlacements}
          reveals={reveals}
          revealing={revealing}
          aboutOpen={aboutOpen}
          narrow={narrow}
          selected={selected}
          returning={returning}
          labelsVisible={settledProject === null && returning === null && !narrow}
          phase={phase}
          transitionState={transitionState}
          directRenderer={directRenderer}
          dpr={dpr}
          pageVisible={pageVisible}
          frameGeometry={frameGeometry}
          openingGeometry={openingGeometry}
          onSelect={selectProject}
          onNameSelect={onNameSelect}
          onReady={onReady}
          onSettled={handleSettled}
          onReturned={finishReturn}
          onProfileArrived={handleProfileArrived}
        />}
      </Canvas>
      {narrow && settledProject === null && returning === null && (
        <header className="scene-mobile-intro">
          <p>Some problems have felt like closed doors.<br />These are the projects I’m building to open them.</p>
        </header>
      )}
      {narrow && settledProject === null && returning === null && !aboutOpen && (
        <div className="scene-mobile-footer">
          <nav className="mobile-projects" aria-label="Explore projects">
            {projects.map((project, index) => <button key={project.title} data-project-index={project.index} onClick={() => selectProject(index)}><span className="mobile-projects__identity"><strong>{project.title}</strong><span>{project.industry}</span></span><span aria-hidden="true">↗</span></button>)}
          </nav>
          {revealing && selected === null && <p className="scene-interaction-hint scene-interaction-hint--touch">
            <IconHandFinger size={18} stroke={1.5} aria-hidden="true" />
            <span>Touch a door or my name to interact</span>
          </p>}
        </div>
      )}
      {!narrow && revealing && selected === null && returning === null && !aboutOpen && (
        <p className="scene-interaction-hint">
          <IconMouse size={24} stroke={1.25} aria-hidden="true" />
          <span>Click any door or my name to explore the portfolio.</span>
        </p>
      )}
      {settledProject !== null && !aboutOpen && <ProjectDetails project={settledProject.project} closing={returning !== null} onClose={closeProject} />}
    </>
  )
}
